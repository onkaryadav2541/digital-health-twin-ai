# 🏥 Digital Health Twin AI: Explainable RAG Dashboard

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/) [![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/) [![FAISS](https://img.shields.io/badge/VectorDB-FAISS-00a3e0?style=flat)](https://github.com/facebookresearch/faiss) [![LLM](https://img.shields.io/badge/Model-Sentence--Transformers-ff6F00?style=flat)](https://sbert.net/)

A production-ready healthcare platform that creates a **Digital Twin** for each patient. This system leverages **Retrieval-Augmented Generation (RAG)** to analyze biometric trends, medical history, and clinical notes with full transparency. Every clinical insight is backed by data, with complete explainability throughout the decision-making process.

---

## 🛠️ Architecture Overview

The system is structured around two core components that work in tandem:

### 1. **Backend Layer (Python & FastAPI)**
- **Data Layer:** Comprehensive patient profiles stored in structured `patients.json` format
- **RAG Pipeline:** Leverages `Sentence-Transformers` for semantic embeddings and `FAISS` for high-performance vector retrieval with metadata filtering
- **Clinical Monitoring:** Automated alerts for critical health indicators including hypertension (Stage 2), tachycardia, and sleep pattern abnormalities

### 2. **Frontend Layer (React & Lucide)**
- **Responsive Interface:** Optimized dashboard design that provides consistent user experience across desktop, tablet, and mobile platforms
- **Explainability Module:** Dedicated interface elements for vector data retrieval visualization and technical reasoning transparency
- **Interactive Query System:** Intelligent assistant for medication queries, clinical history review, and vital sign analysis

---

## 🚀 Key Features

- **Part 1: Data Integration** – Comprehensive patient database with 10 complete clinical profiles
- **Part 2: API Foundation** – RESTful endpoints for patient retrieval and intelligent querying
- **Part 3: Semantic Search** – Vector-based retrieval system for rapid identification of relevant clinical context
- **Part 4: Dashboard Interface** – Professional UI with real-time biometric visualization and monitoring
- **Part 5: Clinical Alerts** – Automated detection and notification of critical vital sign thresholds (BP > 140/90 mmHg, HR > 100 bpm)
- **Part 6: Explainability Framework** – Complete transparency showing source data and reasoning for all clinical assessments

---

## 📋 Installation & Configuration

### **System Requirements**
- Python 3.10 or higher
- Node.js v16+ with npm package manager

### **Backend Setup**

```bash
cd backend

# Initialize virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sentence-transformers faiss-cpu numpy

# Start the server
python main.py
```

The API server will be available at `http://127.0.0.1:8000` with interactive documentation.

### **Frontend Setup**

```bash
cd frontend

# Install required packages
npm install axios lucide-react

# Start development server
npm run dev
```

The dashboard will be accessible at `https://digital-health-twin-5okdfiyoh-onkaryadav2541-1859s-projects.vercel.app/` (or the URL provided in terminal output).

---

## 🩺 Clinical Use Case Example

**Patient:** Samuel Okoro (P010)  
**Query:** "What are the most urgent risks for this patient?"

**System Response:**
1. **Alert Identification:** Flags Stage 2 Hypertension, Tachycardia, and Sleep Deprivation with corresponding severity indicators
2. **Data Retrieval:** Automatically identifies and retrieves relevant historical data including Sleep Apnea diagnosis and CPAP therapy records
3. **Evidence Presentation:** Displays source data excerpts and reasoning chain, providing full clinical justification for risk assessment

This exemplifies the system's commitment to transparent, evidence-based clinical decision support.

---

## 📂 Project Structure

```
digital-health-twin-ai/
├── backend/
│   ├── main.py            # FastAPI application server with FAISS indexing
│   └── patients.json      # Structured patient database
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # React dashboard component
│   │   └── index.css      # Responsive styling
│   └── package.json
└── README.md              # Project documentation
```

---

## 🛡️ Data Privacy & Security

- **Data Isolation:** Patient records are maintained in logically separate indexes, preventing cross-patient data leakage
- **Local Processing:** All clinical analysis and inference operations execute on-premises. No patient data is transmitted to external services or cloud platforms
- **Compliance:** Architecture supports HIPAA-compliant deployment patterns for healthcare environments

---

## 📄 License

MIT License - See LICENSE file for complete terms.

---

## 🚀 Deployment

To finalize your repository with this documentation, execute:

```bash
git add README.md
git commit -m "Final: Add comprehensive system documentation and architectural overview"
git push origin main
```