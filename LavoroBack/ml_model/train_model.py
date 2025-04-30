import os
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import classification_report
import joblib
import ast

# Créer le dossier models s'il n'existe pas
os.makedirs('models', exist_ok=True)

# Charger les données nettoyées
df = pd.read_csv('task_employer_dataset_cleaned.csv')

# Convertir les chaînes de compétences en listes
df['required_skills_list'] = df['required_skills_list'].apply(ast.literal_eval)
df['employer_skills_list'] = df['employer_skills_list'].apply(ast.literal_eval)

# Créer un ensemble de toutes les compétences uniques
all_skills = set()
for skills in df['required_skills_list']:
    all_skills.update(skills)
for skills in df['employer_skills_list']:
    all_skills.update(skills)

all_skills = list(all_skills)

# Encoder les compétences en caractéristiques binaires
mlb = MultiLabelBinarizer()
mlb.fit([all_skills])

X = []
y = df['match'].values

for idx, row in df.iterrows():
    # Combinaison des compétences requises et des compétences de l'employeur
    combined_features = list(set(row['required_skills_list'] + row['employer_skills_list']))
    encoded = mlb.transform([combined_features])
    X.append(encoded[0])

# Diviser les données
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Entraîner le modèle KNN
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)

# Évaluer le modèle
y_pred = knn.predict(X_test)
print(classification_report(y_test, y_pred))

# Sauvegarder le modèle et l'encodeur
joblib.dump(knn, 'models/knn_model.joblib')
joblib.dump(mlb, 'models/mlb_encoder.joblib')

print("Modèle entraîné et sauvegardé avec succès dans le dossier 'models'!")