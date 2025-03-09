import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Sales() {
    const [projectsByStatus, setProjectsByStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Appeler l'API pour obtenir les projets par statut
        axios.get('http://localhost:3000/project/projetStatus') // Remplacez par votre endpoint
            .then(response => {
                setProjectsByStatus(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching projects by status:', err);
                setError('Failed to fetch data');
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div class="card custom-card">
            <div class="card-header justify-content-between">
                <div class="card-title">Project Statistics</div>
                <div class="dropdown">
                    <a aria-label="anchor" href="javascript:void(0);" class="btn btn-sm btn-light" data-bs-toggle="dropdown" aria-expanded="false">
                        Last Week <i class="ri-arrow-down-s-line align-middle ms-1 d-inline-block"></i>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="javascript:void(0);">Today</a></li>
                        <li><a class="dropdown-item" href="javascript:void(0);">Last Week</a></li>
                        <li><a class="dropdown-item" href="javascript:void(0);">Last Month</a></li>
                        <li><a class="dropdown-item" href="javascript:void(0);">Last Year</a></li>
                    </ul>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex gap-5 align-items-center p-3 justify-content-around bg-light mx-2 flex-wrap flex-xl-nowrap">
                    <div class="d-flex gap-3 align-items-center flex-wrap">
                        <div class="avatar avatar-lg flex-shrink-0 bg-primary-transparent avatar-rounded svg-primary shadow-sm border border-primary border-opacity-25">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M184,89.57V84c0-25.08-37.83-44-88-44S8,58.92,8,84v40c0,20.89,26.25,37.49,64,42.46V172c0,25.08,37.83,44,88,44s88-18.92,88-44V132C248,111.3,222.58,94.68,184,89.57ZM232,132c0,13.22-30.79,28-72,28-3.73,0-7.43-.13-11.08-.37C170.49,151.77,184,139,184,124V105.74C213.87,110.19,232,122.27,232,132ZM72,150.25V126.46A183.74,183.74,0,0,0,96,128a183.74,183.74,0,0,0,24-1.54v23.79A163,163,0,0,1,96,152,163,163,0,0,1,72,150.25Zm96-40.32V124c0,8.39-12.41,17.4-32,22.87V123.5C148.91,120.37,159.84,115.71,168,109.93ZM96,56c41.21,0,72,14.78,72,28s-30.79,28-72,28S24,97.22,24,84,54.79,56,96,56ZM24,124V109.93c8.16,5.78,19.09,10.44,32,13.57v23.37C36.41,141.4,24,132.39,24,124Zm64,48v-4.17c2.63.1,5.29.17,8,.17,3.88,0,7.67-.13,11.39-.35A121.92,121.92,0,0,0,120,171.41v23.46C100.41,189.4,88,180.39,88,172Zm48,26.25V174.4a179.48,179.48,0,0,0,24,1.6,183.74,183.74,0,0,0,24-1.54v23.79a165.45,165.45,0,0,1-48,0Zm64-3.38V171.5c12.91-3.13,23.84-7.79,32-13.57V172C232,180.39,219.59,189.4,200,194.87Z"></path></svg>
                        </div>
                        <div>
                            <span class="mb-1 d-block">Total Projects</span> 
                            <div class="d-flex align-items-end gap-2">
                                <h4 class="mb-0">{projectsByStatus['Not Started'] || 0}</h4> 
                                <div class="fs-13"> 
                                    <span class="op-7"> Not Started </span>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-3 align-items-center flex-wrap">
                        <div class="avatar avatar-lg flex-shrink-0 bg-primary1-transparent avatar-rounded svg-primary1 shadow-sm border border-primary1 border-opacity-25">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z"></path></svg>
                        </div>
                        <div>
                            <span class="mb-1 d-block">In Progress</span> 
                            <div class="d-flex align-items-end gap-2">
                                <h4 class="mb-0">{projectsByStatus['In Progress'] || 0}</h4> 
                                <div class="fs-13"> 
                                    <span class="op-7"> In Progress </span>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-3 align-items-center flex-wrap">
                        <div class="avatar avatar-lg flex-shrink-0 bg-primary2-transparent avatar-rounded svg-primary2 shadow-sm border border-primary2 border-opacity-25">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z"></path></svg>
                        </div>
                        <div>
                            <span class="mb-1 d-block">Completed</span> 
                            <div class="d-flex align-items-end gap-2">
                                <h4 class="mb-0">{projectsByStatus['Completed'] || 0}</h4> 
                                <div class="fs-13"> 
                                    <span class="op-7"> Completed </span>  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="project-statistics"></div>
            </div>
        </div>
        
    );
}