import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BestPerformer = () => {
  const [bestPerformer, setBestPerformer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestPerformer = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Appel API pour récupérer l'utilisateur avec le plus de points
        const response = await axios.get('http://localhost:3000/users/best-performer', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setBestPerformer(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération du meilleur performeur:', err);
        setError('Impossible de charger les données du meilleur performeur');
        setLoading(false);
      }
    };

    fetchBestPerformer();
  }, []);

  if (loading) {
    return (
      <div className="card custom-card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card custom-card">
        <div className="card-body text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!bestPerformer) {
    return (
      <div className="card custom-card">
        <div className="card-body text-center">
          <p>Aucun membre avec des points de performance trouvé.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card custom-card">
      <div className="card-header justify-content-between">
        <div className="card-title">
          Meilleur Performeur
        </div>
      </div>
      <div className="card-body">
        <p className="card-title mb-3">Employé avec le plus de points de performance</p>
        <div className="text-center">
          <img 
            src={`http://localhost:3000${bestPerformer.image}`} 
            className="img-thumbnail rounded-pill" 
            alt={`${bestPerformer.firstName} ${bestPerformer.lastName}`}
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
          <h5 className="mt-3">{bestPerformer.firstName} {bestPerformer.lastName}</h5>
          <div className="d-flex justify-content-center align-items-center">
            <span className="badge bg-primary rounded-pill fs-6 px-3 py-2 mt-2">
              {bestPerformer.performancePoints} Points
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestPerformer;
