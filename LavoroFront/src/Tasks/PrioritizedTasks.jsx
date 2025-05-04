import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

// Style pour l'animation de l'infobulle
const tooltipStyle = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const PrioritizedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [prioritizedTasks, setPrioritizedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrioritized, setShowPrioritized] = useState(false);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [autoRefresh, setAutoRefresh] = useState(true); // État pour activer/désactiver le rafraîchissement automatique
  const navigate = useNavigate();

  // Référence pour l'intervalle de rafraîchissement
  const refreshIntervalRef = useRef(null);

  // Fonction pour récupérer les tâches normales et priorisées
  const fetchTasks = async () => {
    try {
      console.log('Rafraîchissement des données de priorisation...');
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      // Essayer d'abord de récupérer les données depuis l'API
      try {
        const response = await axios.get('http://localhost:3000/ai-prioritization/my-tasks', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.data && response.data.data.length > 0) {
          // Stocker les tâches priorisées
          setPrioritizedTasks(response.data.data);

          // Stocker également les tâches non triées pour l'affichage normal
          setTasks(response.data.data.slice().sort((a, b) => {
            // Tri par statut puis par deadline
            if (a.status !== b.status) {
              return a.status === 'In Progress' ? -1 : 1;
            }
            return new Date(a.deadline) - new Date(b.deadline);
          }));

          setError(null);
          setLoading(false);
          return;
        }
      } catch (apiError) {
        console.error("API error, using mock data instead:", apiError);
      }

      // Si l'API ne renvoie pas de données, utiliser des données de test
      console.log("Using mock data for demonstration");

      
      // Trier les tâches par score de priorité pour l'affichage priorisé
      setPrioritizedTasks([...mockTasks].sort((a, b) => b.priority_score - a.priority_score));

      // Trier les tâches par statut et deadline pour l'affichage normal
      setTasks([...mockTasks].sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === 'In Progress' ? -1 : 1;
        }
        return new Date(a.deadline) - new Date(b.deadline);
      }));

      setError(null);
    } catch (error) {
      console.error("Error in fetchTasks:", error);
      setError('Une erreur est survenue lors de la récupération des tâches');
      setTasks([]);
      setPrioritizedTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les tâches au chargement du composant et configurer le rafraîchissement automatique
  useEffect(() => {
    // Charger les tâches immédiatement
    fetchTasks();

    // Configurer l'intervalle de rafraîchissement automatique (toutes les 5 secondes)
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        if (showPrioritized) {  // Ne rafraîchir que si l'affichage ML est actif
          fetchTasks();
        }
      }, 5000);
    }

    // Nettoyer l'intervalle lors du démontage du composant
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, showPrioritized, navigate]); // Dépendances: rafraîchir si ces états changent

  // Fonction pour basculer entre les tâches normales et priorisées
  const togglePrioritizedView = () => {
    setShowPrioritized(!showPrioritized);
  };

  // Fonction pour obtenir la classe de couleur en fonction du score de priorité
  const getPriorityScoreClass = (score) => {
    if (score >= 70) return 'bg-danger';
    if (score >= 40) return 'bg-warning';
    return 'bg-success';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <style>{tooltipStyle}</style>

      {/* Infobulle qui suit le curseur */}
      {hoveredTask && (
        <div style={{
          position: 'fixed',
          top: mousePosition.y + 10,
          left: mousePosition.x + 10,
          backgroundColor: 'rgba(33, 37, 41, 0.85)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          zIndex: 9999,
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '12px',
          maxWidth: '250px',
          animation: 'fadeIn 0.15s ease-in-out',
          pointerEvents: 'none', // Pour que l'infobulle n'interfère pas avec les événements de la souris
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{ marginBottom: '4px', fontWeight: '600', color: '#fff', fontSize: '13px' }}>
            {hoveredTask.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
            <i className="ri-calendar-line" style={{ marginRight: '4px', color: '#ffc107', fontSize: '11px' }}></i>
            <span style={{ fontSize: '11px' }}>Date: {hoveredTask.deadline ? new Date(hoveredTask.deadline).toLocaleDateString() : 'Non définie'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
            <i className="ri-time-line" style={{ marginRight: '4px', color: '#17a2b8', fontSize: '11px' }}></i>
            <span style={{ fontSize: '11px' }}>Durée: {hoveredTask.estimated_duration || hoveredTask.duration || 'Non définie'} {(hoveredTask.estimated_duration || hoveredTask.duration) === 1 ? 'jour' : 'jours'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <i className="ri-flag-line" style={{ marginRight: '4px', color: '#28a745', fontSize: '11px' }}></i>
            <span style={{ fontSize: '11px' }}>Statut: {hoveredTask.status}</span>
          </div>
        </div>
      )}

      <div className="card custom-card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-0">Mes Tâches</h5>
              {showPrioritized && (
                <small className="text-muted d-block">
                  <i className="ri-ai-generate me-1"></i>
                  Tâches triées par priorité calculée par IA
                  {autoRefresh && <span className="ms-2 text-success"><i className="ri-refresh-line ri-spin"></i> Rafraîchissement auto</span>}
                </small>
              )}
              {!showPrioritized && (
                <small className="text-muted d-block">
                  Tâches triées par statut et date limite
                </small>
              )}
            </div>
            <div className="d-flex gap-2">
              {/* Bouton pour activer/désactiver le rafraîchissement automatique */}
              {showPrioritized && (
                <button
                  className={`btn btn-sm ${autoRefresh ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  title={autoRefresh ? "Désactiver le rafraîchissement auto" : "Activer le rafraîchissement auto"}
                >
                  <i className={`ri-refresh-line ${autoRefresh ? 'ri-spin' : ''}`}></i>
                  {autoRefresh ? ' Auto' : ' Manuel'}
                </button>
              )}

              {/* Bouton pour basculer entre les vues */}
              <button
                className={`btn ${showPrioritized ? 'btn-outline-primary' : 'btn-primary'}`}
                onClick={togglePrioritizedView}
              >
                {showPrioritized ? 'Affichage Normal' : 'Priorisation ML'}
                {showPrioritized && <i className="ri-ai-generate ms-2"></i>}
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!error && (showPrioritized ? prioritizedTasks.length === 0 : tasks.length === 0) && (
            <div className="alert alert-info text-center">
              Aucune tâche trouvée.
            </div>
          )}

          {!error && (
            <div>
              {/* Affichage normal (tableau complet) */}
              {!showPrioritized && (
                <div className="table-responsive">
                  <table className="table table-hover table-striped">
                    <thead>
                      <tr>
                        <th scope="col">Titre</th>
                        <th scope="col">Description</th>
                        <th scope="col">
                          Statut
                          <i className="ri-arrow-up-line ms-1 text-primary" title="Trié par statut"></i>
                        </th>
                        <th scope="col">Priorité</th>
                        <th scope="col">
                          Date limite
                          <i className="ri-arrow-up-line ms-1 text-primary" title="Trié par date limite"></i>
                        </th>
                        <th scope="col">Durée estimée</th>
                        <th scope="col">Projet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task._id || task.task_id}>
                          <td>{task.title}</td>
                          <td>{task.description}</td>
                          <td>
                            <span className={`badge ${task.status === 'Done' ? 'bg-success' : task.status === 'In Progress' ? 'bg-warning' : 'bg-secondary'}`}>
                              {task.status}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${task.priority === 'High' ? 'bg-danger' : task.priority === 'Medium' ? 'bg-warning' : 'bg-success'}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</td>
                          <td>{task.estimated_duration || task.duration || 'N/A'}</td>
                          <td>{task.project?.name || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Affichage ML avec pyramide */}
              {showPrioritized && (
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card custom-card">
                      <div className="card-header">
                        <div className="card-title">Priorité des Tâches</div>
                      </div>
                      <div className="card-body">
                        <div id="pyramid-chart" style={{ height: '700px', width: '100%' }}>
                          {/* Pyramide visuelle créée manuellement */}
                          <div className="pyramid-container" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            marginTop: '40px',
                            marginLeft: '40px',
                            position: 'relative',
                            width: '90%'
                          }}>

                            {/* Titre de la pyramide */}
                            <h5 style={{
                              textAlign: 'left',
                              marginBottom: '15px',
                              color: '#fff',
                              textShadow: '0 0 10px rgba(0,0,0,0.5)',
                              width: '100%',
                              fontSize: '16px',
                              fontWeight: '600',
                              letterSpacing: '0.5px'
                            }}>
                              Priorité des Tâches
                            </h5>

                            {/* Légende en haut */}
                            <div style={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '15px',
                              marginBottom: '25px',
                              backgroundColor: 'rgba(0,0,0,0.15)',
                              padding: '8px 12px',
                              borderRadius: '4px',
                              alignSelf: 'flex-start',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '12px', height: '12px', backgroundColor: '#dc3545', borderRadius: '2px' }}></div>
                                <span style={{ color: '#fff', fontSize: '12px', fontWeight: '500' }}>Priorité élevée (70+)</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '12px', height: '12px', backgroundColor: '#ffc107', borderRadius: '2px' }}></div>
                                <span style={{ color: '#fff', fontSize: '12px', fontWeight: '500' }}>Priorité moyenne (40-70)</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '12px', height: '12px', backgroundColor: '#28a745', borderRadius: '2px' }}></div>
                                <span style={{ color: '#fff', fontSize: '12px', fontWeight: '500' }}>Priorité faible (&lt;40)</span>
                              </div>
                            </div>


                            {prioritizedTasks.slice().sort((a, b) => b.priority_score - a.priority_score).map((task, index) => {
                              // Calculer la largeur en fonction du score et de la position
                              const maxWidth = 90; // Largeur maximale en pourcentage
                              const minWidth = 30; // Largeur minimale en pourcentage
                              const totalTasks = prioritizedTasks.length;
                              const position = index / (totalTasks - 1 || 1); // 0 pour le premier, 1 pour le dernier
                              const width = maxWidth - position * (maxWidth - minWidth);

                              // Déterminer la couleur en fonction du score
                              const color = task.priority_score >= 70 ? '#dc3545' :
                                          task.priority_score >= 40 ? '#ffc107' : '#28a745';

                              return (
                                <div
                                  key={task._id || task.task_id}
                                  className="pyramid-level"
                                  style={{
                                    width: `${width}%`,
                                    backgroundColor: color,
                                    padding: '12px 15px',
                                    marginBottom: '6px',
                                    textAlign: 'center',
                                    color: 'white',
                                    fontWeight: '500',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(5px)';
                                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
                                    e.currentTarget.style.width = `${width + 5}%`;
                                    setHoveredTask(task);
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                                    e.currentTarget.style.width = `${width}%`;
                                    setHoveredTask(null);
                                  }}
                                  onMouseMove={(e) => {
                                    setMousePosition({ x: e.clientX, y: e.clientY });
                                  }}
                                >
                                  <span style={{
                                    flex: 1,
                                    textAlign: 'left',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontSize: index === 0 ? '14px' : index === 1 ? '13px' : '12px',
                                    letterSpacing: '0.3px',
                                    textShadow: '0 1px 1px rgba(0,0,0,0.2)'
                                  }}>
                                    {index === 0 && '🏆 '}
                                    {index === 1 && '🥈 '}
                                    {index === 2 && '🥉 '}
                                    {task.title}
                                  </span>
                                  <span style={{
                                    marginLeft: '10px',
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    fontSize: index === 0 ? '13px' : index === 1 ? '12px' : '11px',
                                    fontWeight: '600',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                  }}>
                                    {Math.round(task.priority_score)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrioritizedTasks;
