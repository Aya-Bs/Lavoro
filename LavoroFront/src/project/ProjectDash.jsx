import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PieChart from './PieChart'; // Importez le composant PieChart
import LineChart from './ChartGraphique'; // Importez le composant LineChart


export default function Sales() {
    const [projectsByStatus, setProjectsByStatus] = useState({});
    const [projects, setProjects] = useState([]); // Tous les projets
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // État pour la recherche
    const [sortBy, setSortBy] = useState('start_date'); // État pour le tri

    useEffect(() => {
        // Appeler l'API pour obtenir les projets par statut
        axios.get('http://localhost:3000/project/projetStatus')
            .then(response => {
                setProjectsByStatus(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching projects by status:', err);
                setError('Failed to fetch data');
                setLoading(false);
            });

        // Appeler l'API pour obtenir tous les projets
        axios.get('http://localhost:3000/project/projects')
            .then(response => {
                setProjects(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching projects:', err);
                setError('Failed to fetch projects');
                setLoading(false);
            });
    }, []);

    // Filtrer les projets en fonction de la recherche
    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Trier les projets en fonction de la clé sélectionnée
    const sortedProjects = [...filteredProjects].sort((a, b) => {
        if (sortBy === 'start_date') {
            return new Date(a.start_date) - new Date(b.start_date); // Trier par date
        } else if (sortBy === 'budget') {
            return a.budget - b.budget; // Trier par budget
        } else if (sortBy === 'status') {
            return a.status.localeCompare(b.status); // Trier par statut
        }
        return 0;
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (


        
        <div>
          
            {/* Première section */}
            <div className="card custom-card">
                <div className="card-header justify-content-between">
                    <div className="card-title">Project Statistics</div>
                    <div className="dropdown">
                        <a aria-label="anchor" href="javascript:void(0);" className="btn btn-sm btn-light" data-bs-toggle="dropdown" aria-expanded="false">
                            Last Week <i className="ri-arrow-down-s-line align-middle ms-1 d-inline-block"></i>
                        </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="javascript:void(0);">Today</a></li>
                            <li><a className="dropdown-item" href="javascript:void(0);">Last Week</a></li>
                            <li><a className="dropdown-item" href="javascript:void(0);">Last Month</a></li>
                            <li><a className="dropdown-item" href="javascript:void(0);">Last Year</a></li>
                        </ul>
                    </div>
                </div>
                <div className="card-body">
                    <div className="d-flex gap-5 align-items-center p-3 justify-content-around bg-light mx-2 flex-wrap flex-xl-nowrap">
                        <div className="d-flex gap-3 align-items-center flex-wrap">
                            <div className="avatar avatar-lg flex-shrink-0 bg-primary-transparent avatar-rounded svg-primary shadow-sm border border-primary border-opacity-25">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
                                    {/* Icône SVG */}
                                </svg>
                            </div>
                            <div>
                                <span className="mb-1 d-block">Total Projects</span>
                                <div className="d-flex align-items-end gap-2">
                                    <h4 className="mb-0">{projectsByStatus['Not Started'] || 0}</h4>
                                    <div className="fs-13">
                                        <span className="op-7"> Not Started </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex gap-3 align-items-center flex-wrap">
                            <div className="avatar avatar-lg flex-shrink-0 bg-primary1-transparent avatar-rounded svg-primary1 shadow-sm border border-primary1 border-opacity-25">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
                                    {/* Icône SVG */}
                                </svg>
                            </div>
                            <div>
                                <span className="mb-1 d-block">In Progress</span>
                                <div className="d-flex align-items-end gap-2">
                                    <h4 className="mb-0">{projectsByStatus['In Progress'] || 0}</h4>
                                    <div className="fs-13">
                                        <span className="op-7"> In Progress </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex gap-3 align-items-center flex-wrap">
                            <div className="avatar avatar-lg flex-shrink-0 bg-primary2-transparent avatar-rounded svg-primary2 shadow-sm border border-primary2 border-opacity-25">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
                                    {/* Icône SVG */}
                                </svg>
                            </div>
                            <div>
                                <span className="mb-1 d-block">Completed</span>
                                <div className="d-flex align-items-end gap-2">
                                    <h4 className="mb-0">{projectsByStatus['Completed'] || 0}</h4>
                                    <div className="fs-13">
                                        <span className="op-7"> Completed </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="project-statistics"></div>
                </div>
            </div>

            {/* Deuxième section */}
            <div className="card custom-card">
                <div className="card-header justify-content-between">
                    <div className="card-title">Projects Summary</div>
                    <div className="d-flex flex-wrap">
                        <div className="me-3 my-1">
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                placeholder="Search by Project Name"
                                aria-label="Search by Project Name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} // Mettre à jour la recherche
                            />
                        </div>
                        <div className="dropdown my-1">
                            <a href="javascript:void(0);" className="btn btn-primary btn-sm" data-bs-toggle="dropdown" aria-expanded="false">
                                Sort By <i className="ri-arrow-down-s-line align-middle ms-1 d-inline-block"></i>
                            </a>
                            <ul className="dropdown-menu" role="menu">
                                <li>
                                    <a className="dropdown-item" href="javascript:void(0);" onClick={() => setSortBy('start_date')}>
                                        Start Date
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="javascript:void(0);" onClick={() => setSortBy('budget')}>
                                        Budget
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="javascript:void(0);" onClick={() => setSortBy('status')}>
                                        Status
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover text-nowrap table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col">Project Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Budget</th>
                                    <th scope="col">Start Date</th>
                                    <th scope="col">End Date</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">AI Predicted Completion</th>
                                    <th scope="col">AI Predicted Description</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col">Updated At</th>
                                    <th scope="col">Manager ID</th>
                                    <th scope="col">Team ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedProjects.map((project, index) => (
                                    <tr key={project._id}>
                                        <td>{index + 1}</td>
                                        <td><span className="fw-medium">{project.name}</span></td>
                                        <td>{project.description || 'N/A'}</td>
                                        <td>{project.budget || 0}</td>
                                        <td>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}</td>
                                        <td>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <span className="badge bg-primary-transparent">{project.status}</span>
                                        </td>
                                        <td>{project.ai_predicted_completion ? new Date(project.ai_predicted_completion).toLocaleDateString() : 'N/A'}</td>
                                        <td>{project.ai_predicted_description || 'N/A'}</td>
                                        <td>{new Date(project.created_at).toLocaleDateString()}</td>
                                        <td>{new Date(project.updated_at).toLocaleDateString()}</td>
                                        <td>{typeof project.manager_id === 'object' ? project.manager_id.value : project.manager_id}</td>
                                        <td>{typeof project.team_id === 'object' ? project.team_id.name : project.team_id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            <div className="card custom-card">
                <div className="card-header">
                    <div className="card-title">Nombre de projets par mois</div>
                </div>
                <div className="card-body">
                    <LineChart projects={projects} />
                </div>
            </div>



            <div className="card custom-card">
                <div className="card-header">
                    <div className="card-title"> Répartition des projets par statut</div>
                </div>
                <div className="card-body">
                    <PieChart projects={projects} />
                </div>
            </div> 
        </div>
    );
}