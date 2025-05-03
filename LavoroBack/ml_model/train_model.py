import os
import pandas as pd
import numpy as np
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import classification_report
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import ast
from sklearn.calibration import CalibratedClassifierCV
from collections import defaultdict

# Créer le dossier models s'il n'existe pas
os.makedirs('models', exist_ok=True)

# Charger les données
df = pd.read_csv('task_employer_dataset_cleaned1.csv')
df['required_skills_list'] = df['required_skills_list'].apply(ast.literal_eval)
df['employer_skills_list'] = df['employer_skills_list'].apply(ast.literal_eval)

# Générer le dictionnaire de similarité et le sauvegarder
def generate_and_save_similarity(df):
    all_skills = set()
    df['combined_skills'] = df['required_skills_list'] + df['employer_skills_list']
    for skills in df['combined_skills']:
        all_skills.update(skills)
    
    # Matrice de co-occurrence
    co_occurrence = pd.DataFrame(0, index=list(all_skills), columns=list(all_skills))
    
    for _, row in df.iterrows():
        skills = list(set(row['combined_skills']))
        for i in range(len(skills)):
            for j in range(i+1, len(skills)):
                co_occurrence.loc[skills[i], skills[j]] += 1
                co_occurrence.loc[skills[j], skills[i]] += 1
    
    # Similarité cosinus
    similarity_matrix = cosine_similarity(co_occurrence)
    skill_similarity = defaultdict(dict)
    
    for i, skill1 in enumerate(co_occurrence.index):
        for j, skill2 in enumerate(co_occurrence.columns):
            if i != j and similarity_matrix[i][j] > 0.1:
                skill_similarity[skill1][skill2] = round(similarity_matrix[i][j], 2)
    
    joblib.dump(dict(skill_similarity), 'models/skill_similarity.joblib')
    return dict(skill_similarity)

# Générer et sauvegarder la similarité
skill_similarity = generate_and_save_similarity(df)

# Préparation des données pour le modèle SVM
all_skills = list(set().union(*df['required_skills_list'], *df['employer_skills_list']))
mlb = MultiLabelBinarizer()
mlb.fit([all_skills])

X = []
y = df['match'].values

for idx, row in df.iterrows():
    req_encoded = mlb.transform([row['required_skills_list']])
    mem_encoded = mlb.transform([row['employer_skills_list']])
    intersection = req_encoded & mem_encoded
    difference = req_encoded - mem_encoded
    features = np.concatenate([req_encoded, mem_encoded, intersection, difference], axis=1)
    X.append(features[0])

X = np.array(X)

# Entraînement du modèle
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
svm = SVC(class_weight='balanced', probability=True)
calibrated_svm = CalibratedClassifierCV(svm, method='sigmoid', cv=5)
calibrated_svm.fit(X_train, y_train)

# Évaluation
y_pred = calibrated_svm.predict(X_test)
print(classification_report(y_test, y_pred))

# Sauvegarde
joblib.dump(calibrated_svm, 'models/svm_model.joblib')
joblib.dump(mlb, 'models/mlb_encoder.joblib')

print("Modèle et similarités sauvegardés avec succès!")