def predict_match(required_skills, member_skills):
    try:
        # Normaliser la casse
        required_skills = [s.lower().strip() for s in required_skills]
        member_skills = [s.lower().strip() for s in member_skills]

        # Charger les similarités depuis le fichier
        skill_similarity = joblib.load('models/skill_similarity.joblib')
        
        total_score = 0
        exact_matches = 0
        
        for req_skill in required_skills:
            max_sim = 0
            if req_skill in member_skills:
                exact_matches += 1
                max_sim = 1.0
            else:
                for mem_skill in member_skills:
                    sim = skill_similarity.get(req_skill, {}).get(mem_skill, 0)
                    if sim > max_sim:
                        max_sim = sim
            total_score += max_sim

        similarity_score = total_score / len(required_skills) if required_skills else 0
        
        # Bonus pour les membres ayant plusieurs compétences exactes
        multi_skill_bonus = min(exact_matches * 0.1, 0.3)
        final_score = min(similarity_score + multi_skill_bonus, 1.0)

        return {
            'match': True,  # Toujours retourner True
            'confidence': final_score,
            'required_skills': required_skills,
            'member_skills': member_skills
        }
    except Exception as e:
        return {
            'match': True,  # Même en cas d'erreur, considérer comme match
            'confidence': 0,
            'error': str(e)
        }