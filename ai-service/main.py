"""
MicroCred AI Inference Service
FastAPI server yang melayani prediksi kelayakan kredit UMKM.

Mencoba memuat model Keras (.keras) dengan backend NumPy+JAX,
jika tidak, menggunakan algoritma scoring berbasis rumus.

PENTING: Model di-train dengan dataset USD (Kaggle Credit Risk).
Frontend mengirim nilai dalam Rupiah → perlu konversi ke skala USD.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import os

# ──── App Setup ────────────────────────────────────────
app = FastAPI(title="MicroCred AI Inference", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──── Model Loading ────────────────────────────────────
MODEL = None
SCALER = None
MODEL_PATH = os.path.join(os.path.dirname(__file__), "microcred_model_v3.keras")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "scaler.pkl")

try:
    os.environ["KERAS_BACKEND"] = "numpy"
    import keras
    MODEL = keras.saving.load_model(MODEL_PATH, compile=False)
    print(f"[OK] Model Keras berhasil dimuat dari: {MODEL_PATH}")
except Exception as e:
    import traceback
    traceback.print_exc()
    MODEL = None
    print(f"[WARN] Gagal memuat model Keras: {e}")

try:
    import joblib
    SCALER = joblib.load(SCALER_PATH)
    print(f"[OK] Scaler berhasil dimuat dari: {SCALER_PATH}")
except Exception as e:
    SCALER = None
    print(f"[WARN] Gagal memuat Scaler: {e}")


# ──── Request Schema ───────────────────────────────────
class PredictRequest(BaseModel):
    # Numeric
    person_age: float = 30
    person_income: float = 5000000
    person_emp_length: float = 5
    loan_amnt: float = 10000000
    loan_percent_income: float = 0.2
    # Categorical
    person_home_ownership: str = "RENT"
    loan_intent: str = "PERSONAL"
    cb_person_default_on_file: str = "N"


# ──── Rule-based Scoring (Fallback) ────────────────────
def rule_based_score(data: PredictRequest) -> int:
    """Fallback logic jika Keras error."""
    score = 500
    if data.loan_percent_income <= 0.3:
        score += 100
    elif data.loan_percent_income >= 0.6:
        score -= 100
    
    if data.cb_person_default_on_file == "N":
        score += 50
    else:
        score -= 150
        
    return max(300, min(900, score))


# ──── Currency Conversion ──────────────────────────────
# Model di-train dengan data USD (Kaggle Credit Risk Dataset).
# Frontend mengirim dalam Rupiah → konversi ke skala USD.
IDR_TO_USD = 16000.0

def convert_to_model_scale(income_idr: float, loan_idr: float):
    """Konversi IDR ke USD agar sesuai skala training model."""
    # Deteksi otomatis: jika nilai > 100_000, kemungkinan besar IDR
    if income_idr > 100_000:
        income = income_idr / IDR_TO_USD
    else:
        income = income_idr  # Sudah dalam skala USD

    if loan_idr > 100_000:
        loan = loan_idr / IDR_TO_USD
    else:
        loan = loan_idr  # Sudah dalam skala USD

    return income, loan


# ──── Predict Endpoint ─────────────────────────────────
@app.post("/predict")
async def predict(req: PredictRequest):
    try:
        if MODEL is not None:
            # 0. Konversi mata uang (IDR → USD scale)
            income_usd, loan_usd = convert_to_model_scale(
                req.person_income, req.loan_amnt
            )

            # Hitung ulang loan_percent_income dengan nilai yang sudah dikonversi
            loan_pct = loan_usd / income_usd if income_usd > 0 else req.loan_percent_income

            # 1. Feature Extraction & Scaling (Numeric)
            # Urutan: person_age, person_emp_length, person_income, loan_amnt, loan_percent_income
            raw_num_features = [[
                req.person_age,
                req.person_emp_length,
                income_usd,
                loan_usd,
                loan_pct
            ]]

            if SCALER is not None:
                scaled_num_features = SCALER.transform(raw_num_features).tolist()[0]
            else:
                scaled_num_features = raw_num_features[0]

            # 2. One-Hot Encoding (Categorical)
            # person_home_ownership: OTHER, OWN, RENT
            home_other = 1.0 if req.person_home_ownership == "OTHER" else 0.0
            home_own   = 1.0 if req.person_home_ownership == "OWN" else 0.0
            home_rent  = 1.0 if req.person_home_ownership == "RENT" else 0.0

            # loan_intent: EDUCATION, HOMEIMPROVEMENT, MEDICAL, PERSONAL, VENTURE
            intent_edu  = 1.0 if req.loan_intent == "EDUCATION" else 0.0
            intent_home = 1.0 if req.loan_intent == "HOMEIMPROVEMENT" else 0.0
            intent_med  = 1.0 if req.loan_intent == "MEDICAL" else 0.0
            intent_pers = 1.0 if req.loan_intent == "PERSONAL" else 0.0
            intent_vent = 1.0 if req.loan_intent == "VENTURE" else 0.0

            # cb_person_default_on_file: Y
            default_Y = 1.0 if req.cb_person_default_on_file == "Y" else 0.0

            # 3. Combine to 14 features array
            features_list = scaled_num_features + [
                home_other, home_own, home_rent,
                intent_edu, intent_home, intent_med, intent_pers, intent_vent,
                default_Y
            ]

            features = np.array([features_list], dtype=np.float32)
            prediction = MODEL.predict(features, verbose=0)

            # Model output = probabilitas GAGAL BAYAR (default).
            # Semakin tinggi output → semakin berisiko → score harus RENDAH.
            # Formula: score = 300 + (1 - prob_default) * 600
            raw_output = float(prediction[0][0]) if prediction.ndim > 1 else float(prediction[0])
            score = int(300 + (1.0 - raw_output) * 600)
            score = max(300, min(900, score))

            print(f"[DEBUG] income_usd={income_usd:.2f}, loan_usd={loan_usd:.2f}, "
                  f"loan_pct={loan_pct:.4f}, raw_output={raw_output:.6f}, score={score}")
        else:
            # Fallback: rule-based scoring
            score = rule_based_score(req)

        status = "Layak" if score >= 600 else "Berisiko"
        return {
            "score": score,
            "status": status,
            "engine": "keras_model" if MODEL is not None else "rule_based"
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        score = rule_based_score(req)
        status = "Layak" if score >= 600 else "Berisiko"
        return {
            "score": score,
            "status": status,
            "engine": "rule_based_fallback",
            "error": str(e)
        }


# ──── Health Check ─────────────────────────────────────
@app.get("/")
async def health():
    return {
        "message": "MicroCred AI Inference Service is running",
        "model_loaded": MODEL is not None,
        "version": "1.0.0"
    }


# ──── Run ──────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
