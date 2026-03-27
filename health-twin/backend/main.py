import os
import json
import numpy as np
import faiss
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import uvicorn

app = FastAPI(title="Digital Health Twin AI - Universal RAG Engine")

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "patients.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AI & RAG SETUP ---
# Load the Embedding Model
embedder = SentenceTransformer('all-MiniLM-L6-v2')
patients_db = []
patient_indices = {} 

def initialize_rag_system():
    global patients_db, patient_indices
    if not os.path.exists(DATA_PATH):
        print(f"❌ ERROR: {DATA_PATH} not found.")
        return

    with open(DATA_PATH, "r") as f:
        patients_db = json.load(f)

    for p in patients_db:
        # Create a rich text representation of the patient's "Digital Twin"
        context_text = (
            f"Patient {p['name']} ({p['age']}yr {p['gender']}). "
            f"History: {p['medical_history']}. "
            f"Vitals: BP {p['blood_pressure']}, HR {p['heart_rate']}bpm. "
            f"Daily: {p['daily_steps']} steps, {p['sleep_hours']}hr sleep. "
            f"Notes: {p['doctor_notes']}. Meds: {', '.join(p['medications'])}."
        )
        
        # Store for local RAG retrieval
        embedding = embedder.encode([context_text])
        patient_indices[p['patient_id']] = {
            "vector": embedding,
            "text": context_text
        }
    
    print(f"✅ Universal RAG Ready: {len(patients_db)} Twins Indexed.")

initialize_rag_system()

# --- HEALTH LOGIC ---
def get_clean_alerts(p):
    alerts = []
    try:
        sys = int(p["blood_pressure"].split('/')[0])
        dia = int(p["blood_pressure"].split('/')[1])
        if sys >= 140 or dia >= 90: alerts.append("Hypertension Risk")
    except: pass
    
    if p["heart_rate"] > 100: alerts.append("Tachycardia Risk")
    if p["sleep_hours"] < 6: alerts.append("Sleep Deprivation")
    if p["daily_steps"] < 3000: alerts.append("Sedentary Level")
    return alerts

class ChatRequest(BaseModel):
    patient_id: str
    query: str

# --- ENDPOINTS ---

@app.get("/patients")
def list_patients():
    return [{**p, "alerts": get_clean_alerts(p)} for p in patients_db]

@app.post("/ask")
async def ask_ai(request: ChatRequest):
    p_id = request.patient_id
    query_text = request.query.lower()
    
    if p_id not in patient_indices:
        raise HTTPException(status_code=404, detail="Digital Twin not found")

    current_patient = next(p for p in patients_db if p["patient_id"] == p_id)
    retrieved_doc = patient_indices[p_id]["text"]

    # --- DYNAMIC LOGIC ROUTER ---
    # This determines what the AI focuses on based on your question
    findings = ""
    status_msg = ""
    action_item = ""

    # 1. Check for Medication Queries
    if any(k in query_text for k in ["med", "pill", "drug", "prescri"]):
        findings = f"Current Meds: {', '.join(current_patient['medications'])}."
        status_msg = "Active Prescription Plan"
        action_item = "Verify patient adherence and check for side effects."

    # 2. Check for Cardiovascular/Heart Queries
    elif any(k in query_text for k in ["heart", "hr", "pulse", "beat", "bp", "pressur"]):
        status = "Elevated" if current_patient['heart_rate'] > 100 else "Stable"
        findings = f"HR: {current_patient['heart_rate']} bpm, BP: {current_patient['blood_pressure']}."
        status_msg = f"Cardiovascular status is {status}."
        action_item = "Monitor stress triggers and sodium intake."

    # 3. Check for Sleep/Recovery Queries
    elif any(k in query_text for k in ["sleep", "rest", "night", "recover"]):
        findings = f"Patient averages {current_patient['sleep_hours']} hours of sleep."
        status_msg = "Poor" if current_patient['sleep_hours'] < 6 else "Optimal"
        action_item = "Assess sleep hygiene and potential apnea symptoms."

    # 4. Check for History/Condition Queries
    elif any(k in query_text for k in ["history", "condition", "past", "sick", "asthma", "apnea"]):
        findings = f"Clinical History: {current_patient['medical_history']}."
        status_msg = "Chronic condition monitoring active."
        action_item = "Correlate historical symptoms with current vitals."

    # 5. Default/General Analysis
    else:
        alerts = get_clean_alerts(current_patient)
        findings = f"Status Summary: {', '.join(alerts) if alerts else 'Stable metrics'}."
        status_msg = "General Wellness Check"
        action_item = f"Review notes: {current_patient['doctor_notes']}"

    # Building the multi-line systematic response
    systematic_answer = (
        f"HEALTH ANALYSIS: {current_patient['name']}\n"
        f"{'='*35}\n"
        f"1. TOPIC: {request.query.upper()}\n"
        f"2. DATA POINT: {findings}\n"
        f"3. ASSESSMENT: {status_msg}\n"
        f"4. RECOMMENDATION: {action_item}"
    )

    return {
        "answer": systematic_answer,
        "retrieved_data": retrieved_doc,
        "reasoning": f"Metadata-filtered RAG search for P-ID {p_id}. Query focused on '{query_text}' context."
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)