# 🛡️ Content Moderation API

![Build Status](https://img.shields.io/badge/Status-Live-success)
![Model](https://img.shields.io/badge/Model-DistilBERT-blue)
![F1 Score](https://img.shields.io/badge/F1_Score-~87%25-green)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?logo=vite&logoColor=FFD62E)

This uses a fine-tuned DistilBERT model to instantly detect whether a given string of text is clean or toxic. Whether you're building a chat app, a forum, or just tinkering with AI, you can throw text at this API and it will flag the nasty stuff for you.

And the best part? It's a completely **free public API with zero authentication required**. Just make a request and get a response.

👉 **[Check out the live app and API docs here!](https://content-mod.sarinms.dev)**

---

## 🚀 Quick Start

The API is served lightning-fast from Hugging Face Spaces.

### Using Python

```python
import requests

url = "https://sarin-ms-content-mod.hf.space/predict"
payload = {"text": "I absolutely love this project, great work!"}

response = requests.post(url, json=payload)
print(response.json())
# Output: {'label': 'CLEAN', 'confidence': 99.8, 'processing_time_ms': 14.5}
```

### Using cURL

```bash
curl -X POST "https://sarin-ms-content-mod.hf.space/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "You are absolutely worthless."}'
```

## 🧠 How it Works

I wanted something lightweight but highly accurate, so the ML pipeline looks like this:

1. **The Dataset**: I used the famous [Jigsaw Toxic Comment Classification Challenge](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge) dataset containing roughly ~150,000 Wikipedia comments.
2. **The Model**: I took Hugging Face's `distilbert-base-uncased` (which is highly optimized for speed) and fine-tuned it for binary classification (Toxic vs Clean).
3. **The Results**: The model achieves roughly an **87% F1 Score** on unseen test data, meaning it strikes a great balance between catching actual toxicity without wildly false-flagging innocent text.

---

## 🛠️ Tech Stack

- **Backend / ML**: Python, FastAPI, PyTorch, Hugging Face `transformers`
- **Frontend**: React, Vite, Tailwind CSS
- **Hosting**: Hugging Face Spaces (Backend), Vercel (Frontend)

---

## 📂 Project Structure

```text
content-mod/
├── backend/            # FastAPI server & Model inference
│   ├── main.py         # Primary API endpoints
│   ├── model.py        # DistilBERT model loading logic
│   └── requirements.txt
└── frontend/           # React application
    ├── src/
    │   ├── pages/      # Home, API Docs, Safety Standards
    │   ├── components/ # Navbar, UI Cards
    │   └── App.jsx     # Routing
    ├── index.html
    └── tailwind.config.js
```

---

## 💻 Local Setup

Want to run this yourself or contribute?

### 1. Clone the repo

```bash
git clone https://github.com/your-username/content-mod.git
cd content-mod
```

### 2. Backend Setup

Navigate to the backend directory and fire up the FastAPI server.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt

# Start the uvicorn development server
uvicorn main:app --reload --port 8000
```

_The backend will be running at `http://localhost:8000`_

### 3. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and start Vite.

```bash
cd frontend
npm install
npm run dev
```

_The frontend will be running at `http://localhost:5173`_
