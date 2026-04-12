from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from model import predict
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Content Moderation API",
    description="Detects toxic content using DistilBERT fine-tuned on Jigsaw dataset.",
    version="1.0.0",
    contact={"name": "Sarin", "url": "https://sarinms.dev"}
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)

class PredictionResponse(BaseModel):
    label: str
    confidence: float
    processing_time_ms: float

@app.get("/")
def root():
    return {"name": "Content Moderation API", "version": "1.0.0", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictionResponse)
@limiter.limit("10/minute")
def run_prediction(request: Request, body: TextInput):
    start = time.time()
    result = predict(body.text)
    result["processing_time_ms"] = round((time.time() - start) * 1000, 2)
    return result