import React from 'react';
import BestPerformer from '../Tasks/BestPerformer';

const BestPerformerPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 mb-4">
          <h2 className="page-title">Meilleur Performeur</h2>
          <p className="text-muted">Découvrez l'employé avec le plus de points de performance</p>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6 col-lg-8 col-md-10 mx-auto">
          <BestPerformer />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">À propos du système de points</div>
            </div>
            <div className="card-body">
              <h5>Comment les points sont attribués :</h5>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Tâche terminée dans le délai
                  <span className="badge bg-success rounded-pill">+1 point</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Terminée 1 heure avant la durée estimée
                  <span className="badge bg-success rounded-pill">+2 points</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Terminée 2 heures avant, etc.
                  <span className="badge bg-success rounded-pill">+3 points</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Tâche non terminée à temps
                  <span className="badge bg-danger rounded-pill">-1 point</span>
                </li>
              </ul>

              <p className="mb-0">
                Les points sont automatiquement attribués lorsqu'une tâche est marquée comme terminée.
                Plus vous terminez de tâches à l'avance, plus vous gagnez de points !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestPerformerPage;
