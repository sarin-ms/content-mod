from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

MODEL_PATH =  "sarin-ms/distilbert-toxicity"

def load_model():
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    return pipeline("text-classification", model=model, tokenizer=tokenizer)

classifier = load_model()

def predict(text: str) -> dict:
    result = classifier(text, truncation=True, max_length=128)[0]
    label = result["label"]  
    score = result["score"]
    return {
        "label": "toxic" if label == "LABEL_1" else "clean",
        "confidence": round(score * 100, 1)
    }