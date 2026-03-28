# 🏥 Digital Health Twin AI: Explainable RAG Dashboard

[![Vercel](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://digital-health-twin-ai.vercel.app)
[![Render](https://img.shields.io/badge/API-Live-blue?style=for-the-badge&logo=render)](https://digital-health-twin-ai.onrender.com/patients)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)

A production-ready healthcare platform that creates a **Digital Twin** for each patient. This system leverages **Retrieval-Augmented Generation (RAG)** to analyze biometric trends, medical history, and clinical notes with 100% transparency and explainability.

---

## 🏗️ System Architecture

The platform follows a **Decoupled Full-Stack Architecture**:

- **Frontend:** React 18 (Vite) hosted on **Vercel**, using Tailwind-inspired responsive styling and Lucide icons.
- **Backend:** FastAPI (Python 3.10) hosted on **Render**, utilizing a high-performance Uvicorn server.
- **Communication:** RESTful API integration via Axios with full CORS support for secure cross-origin data fetching.

---

## 🧠 RAG (Retrieval-Augmented Generation) Design

To prevent AI "hallucinations," the system uses a custom-built RAG pipeline:

1. **Vectorization:** Clinical data from `patients.json` is transformed into high-dimensional embeddings using `sentence-transformers` (All-MiniLM-L6-v2).
2. **Indexing:** Embeddings are stored in a **FAISS (Facebook AI Similarity Search)** index for sub-millisecond semantic retrieval.
3. **Context Injection:** User queries trigger a similarity search. The retrieved "Ground Truth" data is injected into the prompt, ensuring every response is evidence-based.

---

## 🔌 API Structure

The backend provides a standardized interface for clinical data access:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/patients` | `GET` | Retrieves the complete database of 10 Digital Twin profiles. |
| `/ask` | `POST` | Processes natural language queries using the RAG engine. |
| `/health` | `GET` | Monitors system heartbeat and Vector Index status. |

---

## 📂 Project Structure

```
digital-health-twin-ai/
├── health-twin/              # Main Project Container
│   ├── backend/              # Python FastAPI Server
│   │   ├── main.py           # Core Logic, FAISS Indexing & RAG Engine
│   │   ├── patients.json     # Structured Clinical Database
│   │   └── requirements.txt  # Cloud Deployment Dependencies
│   └── frontend/             # React Vite Application
│       ├── src/              # Dashboard Components & Logic
│       ├── index.html        # Vite Entry Point
│       ├── package.json      # Node Dependencies
│       └── vite.config.js    # Build Configuration
├── .gitignore                # Environment Exclusions
└── README.md                 # Project Documentation
```

---

## 🚀 Installation & Local Setup

### Backend Setup

```bash
cd health-twin/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend Setup

```bash
cd health-twin/frontend
npm install
npm run dev
```

---

## 🩺 Clinical Use Case Example

**Query:** "What are the most urgent risks for Samuel Okoro?"

**System Logic:**
1. **Search:** Retrieves Samuel's latest vitals (BP: 145/95).
2. **Analysis:** Identifies Stage 2 Hypertension and Tachycardia.
3. **Reasoning:** Cross-references with historical Sleep Apnea data to provide a risk-stratified summary.

---

## 🛡️ Data Privacy & Security

- **Data Isolation:** Metadata filtering ensures zero cross-patient data leakage.
- **Local Processing:** All vector operations execute on-premises to support HIPAA-compliant patterns.
- **MIT License:** Open-source for educational and clinical research.

---

## 📝 Git Commands to Push Final Version

Run these commands in your **Digital Health Twin** folder:

```powershell
# 1. Stage the file
git add README.md

# 2. Commit with a message
git commit -m "Final: Add comprehensive system documentation and architectural overview"

# 3. Push to GitHub
git push origin main
```

---


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.