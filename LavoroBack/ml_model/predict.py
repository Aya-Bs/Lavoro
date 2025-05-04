import sys
import json
import joblib
from pathlib import Path
import warnings

# Suppress warnings
warnings.filterwarnings("ignore")

# Load models once at startup
model_path = Path(__file__).parent / 'models' / 'knn_model.joblib'
mlb_path = Path(__file__).parent / 'models' / 'mlb_encoder.joblib'

model = joblib.load(model_path)
mlb = joblib.load(mlb_path)

def predict_match(required_skills, member_skills):
    try:
        combined = list(set(required_skills + member_skills))
        encoded = mlb.transform([combined])
        proba = model.predict_proba(encoded)[0]
        return {
            'match': bool(model.predict(encoded)[0]),
            'confidence': float(proba[1]),
            'required_skills': required_skills,
            'member_skills': member_skills
        }
    except Exception as e:
        return {'error': str(e)}

if __name__ == "__main__":
    # Persistent process for multiple predictions
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            
            data = json.loads(line)
            result = predict_match(data['required_skills'], data['member_skills'])
            print(json.dumps(result))
            sys.stdout.flush()
            
        except Exception as e:
            print(json.dumps({'error': str(e)}))
            sys.stdout.flush()