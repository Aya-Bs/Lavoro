import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ProjectOverview(){
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null); // State for project details
  const [history, setHistory] = useState([]); // State for project history
  const [loading, setLoading] = useState(true); // State for loading status
    const navigate = useNavigate();
  
  // Fetch project details
  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/project/${id}`);
      const data = await response.json();
      if (response.ok) {
        setProject(data); // Set project details
      } else {
        Swal.fire('Error!', data.message || 'Failed to fetch project details.', 'error');
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      Swal.fire('Error!', 'An error occurred while fetching project details.', 'error');
    }
  };

  // Fetch project history
  const fetchProjectHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3000/project/${id}/history`);
      const data = await response.json();
      if (response.ok) {
        setHistory(data); // Set project history
      } else {
        // Swal.fire('Error!', data.message || 'Failed to fetch project history.', 'error');
      }
    } catch (error) {
      console.error('Error fetching project history:', error);
      // Swal.fire('Error!', 'An error occurred while fetching project history.', 'error');
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      await fetchProjectDetails();
      await fetchProjectHistory();
      setLoading(false); // Set loading to false after fetching data
    };

    fetchData();
  }, [id]);

  // Display loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display error if project is not found
  if (!project) {
    return <div>Project not found.</div>;
  }

  const handleEditClick = (projectId) => {
    navigate(`/updateProjects/${projectId}`); // Rediriger vers la page de mise à jour
  };

  const handleDeleteClick = async (projectId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:3000/project/deleteProject/${projectId}`, {
            method: "DELETE",
          });
  
          console.log("Response status:", response.status); // Log le statut de la réponse
  
          if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Gère les réponses non JSON
            console.error("Error response:", errorData);
            throw new Error("Failed to delete project");
          }
  
          Swal.fire("Deleted!", "Your project has been deleted.", "success").then(() => {
            setProject(null); // Met à jour l'état pour indiquer que le projet a été supprimé
            Navigate('/listPro'); // Redirige vers la liste des projets
          });
  
        } catch (error) {
          console.error("Error deleting project:", error);
          Swal.fire("Error!", "There was an issue deleting the project.", "error");
        }
      }
    });
  };

    return (
        <>

        <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
        <div>
          <nav>
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <a href="#" onClick={(e) => e.preventDefault()}>
                Projects
                </a>
              </li>
               <span className="mx-1">→</span>

               <li className="breadcrumb-item">
                <a href="/listPro" >
                  Projects List
                </a>
              </li>
              <span className="mx-1">→</span>

              <li className="breadcrumb-item active" aria-current="page">
              Projects Overview
              </li>
            </ol>
          </nav>
          <br />
          <h1 className="page-title fw-medium fs-18 mb-0">Projects Overview</h1>
        </div>
          
          <div className="btn-list">
            <button className="btn btn-white btn-wave">
              <i className="ri-filter-3-line align-middle me-1 lh-1" /> Filter
            </button>
            <button className="btn btn-primary btn-wave me-0">
              <i className="ri-share-forward-line me-1" /> Share
            </button>
          </div>
        </div>
        {/* Page Header Close */}
        {/* Start::row-1 */}
        <div className="row">
          <div className="col-xl-8">
            <div className="row">
              <div className="col-xxl-3 col-xl-6">
                <div className="card custom-card overflow-hidden main-content-card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-2 gap-1 flex-xxl-nowrap flex-wrap">
                      <div>
                        <span className="text-muted d-block mb-1 text-nowrap">
                          Total Tasks
                        </span>
                        <h4 className="fw-medium mb-0">854</h4>
                      </div>
                      <div className="lh-1">
                        <span className="avatar avatar-md avatar-rounded bg-primary">
                          <i className="ri-shopping-cart-line fs-5" />
                        </span>
                      </div>
                    </div>
                    <div className="text-muted fs-13">
                      Increased By{" "}
                      <span className="text-success">
                        2.56%
                        <i className="ri-arrow-up-line fs-16" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-6">
                <div className="card custom-card overflow-hidden main-content-card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-2 gap-1 flex-xxl-nowrap flex-wrap">
                      <div>
                        <span className="text-muted d-block mb-1 text-nowrap">
                          Budget
                        </span>
                        <h4 className="fw-medium mb-0">50.0 DT</h4>
                      </div>
                      <div className="lh-1">
                        <span className="avatar avatar-md avatar-rounded bg-primary2">
                        <i class="ri-exchange-dollar-line fs-30"></i>                        </span>
                      </div>
                    </div>
                    <div className="text-muted fs-13">
                      Increased By{" "}
                      <span className="text-success">
                        7.66%
                        <i className="ri-arrow-up-line fs-16" />
                      </span>
                    </div>
                  </div>
                </div>
                
              </div>
              <div className="col-xxl-3 col-xl-6">
                <div className="card custom-card overflow-hidden main-content-card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-2 gap-1 flex-xxl-nowrap flex-wrap">
                      <div>
                        <span className="text-muted d-block mb-1 text-nowrap">
                          Estimated Duration
                        </span>
                        <h4 className="fw-medium mb-0">350 Jours</h4>
                      </div>
                      <div className="lh-1">
                        <span className="avatar avatar-md avatar-rounded bg-primary3">
                          <i className="ri-bar-chart-2-line fs-5" />
                        </span>
                      </div>
                    </div>
                    <div className="text-muted fs-13">
                      Decreased By{" "}
                      <span className="text-danger">
                        0.74%
                        <i className="ri-arrow-down-line fs-16" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              </div>
              </div>
              
        <div className="row">
          <div className="col-xxl-8">
            <div className="card custom-card">
              <div className="card-header justify-content-between">
                <div className="card-title">Project Details</div>
                <div>
                <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleEditClick(project._id)}
                              >
                                <i className="ri-pencil-line me-1"></i> Edit
                              </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(project._id)}>
                  <i className="ri-delete-bin-6-line me-1"></i> Delete
                              </button>
                <a href="javascript:void(0);" className="btn btn-sm btn-primary1 btn-wave">
                  <i className="ri-archive-line align-middle fw-medium me-1" />
                  Archieve
                </a>
              </div>

              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-4 gap-2 flex-wrap">
                  <span className="avatar avatar-lg me-1 bg-primary-gradient">
                    <i className="ri-stack-line fs-24 lh-1" />
                  </span>
                  <div>
                    <h6 className="fw-medium mb-2 task-title">
                    {project.name}                    </h6>
                    <span className={`badge ${project.status === 'Completed' ? 'bg-success-transparent' : project.status === 'In Progress' ? 'bg-warning-transparent' : project.status === 'Not Started' ? 'bg-danger-transparent' : 'bg-info-transparent'}`}>
                  {project.status}
                </span>
                    <span className="text-muted fs-12">
                      <i className="ri-circle-fill text-success mx-2 fs-9" />
                      Last Updated : {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                </div>
                <div className="fs-15 fw-medium mb-2">
                  Project Description :
                </div>
                <p className="text-muted mb-4">
                {project.description}
                </p>
                <div className="d-flex gap-5 mb-4 flex-wrap">
                  <div className="d-flex align-items-center gap-2 me-3">
                    <span className="avatar avatar-md avatar-rounded me-1 bg-primary1-transparent">
                      <i className="ri-calendar-event-line fs-18 lh-1 align-middle" />
                    </span>
                    <div>
                      <div className="fw-medium mb-0 task-title">
                        Start Date
                      </div>
                      <span className="fs-12 text-muted">{new Date(project.start_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 me-3">
                    <span className="avatar avatar-md avatar-rounded me-1 bg-primary2-transparent">
                      <i className="ri-time-line fs-18 lh-1 align-middle" />
                    </span>
                    <div>
                      <div className="fw-medium mb-0 task-title">End Date</div>
                      <span className="fs-12 text-muted">{new Date(project.end_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="avatar avatar-md p-1 avatar-rounded me-1 bg-primary-transparent">
                      <img src="../assets/images/faces/11.jpg" alt="" />
                    </span>
                    <div>
                      <span className="d-block fs-14 fw-medium">
                        Amith Catzem
                      </span>
                      <span className="fs-12 text-muted">Project Manager</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="fs-15 fw-medium mb-2">Key tasks :</div>
                      <ul className="task-details-key-tasks mb-0">
                        <li>
                          Design and implement a user-friendly dashboard
                          interface.
                        </li>
                        <li>
                          Integrate data sources and APIs to fetch customer
                          feedback data.
                        </li>
                        <li>
                          Develop interactive data visualizations for easy
                          interpretation.
                        </li>
                        <li>
                          Implement filters and sorting functionalities for data
                          analysis.
                        </li>
                        <li>
                          Create user authentication and access control
                          features.
                        </li>
                        <li>
                          Perform usability testing and iterate based on
                          feedback.
                        </li>
                      </ul>
                    </div>
                    <div className="col-xl-6">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="fs-15 fw-medium">Sub Tasks :</div>
                        <a
                          href="javascript:void(0);"
                          className="btn btn-primary-light btn-wave btn-sm waves-effect waves-light"
                        >
                          See More
                        </a>
                      </div>
                      <ul className="list-group">
                        <li className="list-group-item">
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <i className="ri-link fs-15 text-secondary lh-1 p-1 bg-secondary-transparent rounded-circle" />
                            </div>
                            <div className="fw-medium">
                              Research latest web development trends.
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item">
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <i className="ri-link fs-15 text-secondary lh-1 p-1 bg-secondary-transparent rounded-circle" />
                            </div>
                            <div className="fw-medium">
                              Create technical specifications document.
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item">
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <i className="ri-link fs-15 text-secondary lh-1 p-1 bg-secondary-transparent rounded-circle" />
                            </div>
                            <div className="fw-medium">
                              Optimize website for mobile responsiveness.
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="fs-15 fw-medium mb-2">Skills :</div>
                <div className="d-flex gap-2 flex-wrap">
                  <span className="badge bg-light text-default border">
                    UI/UX Design
                  </span>
                  <span className="badge bg-light text-default border">
                    Data Integration
                  </span>
                  <span className="badge bg-light text-default border">
                    Data Visualization
                  </span>
                  <span className="badge bg-light text-default border">
                    Front-End Development
                  </span>
                  <span className="badge bg-light text-default border">
                    Authentication Systems
                  </span>
                  <span className="badge bg-light text-default border">
                    Usability Testing
                  </span>
                  <span className="badge bg-light text-default border">
                    Agile Methodology
                  </span>
                  <span className="badge bg-light text-default border">
                    API Development
                  </span>
                </div>
              </div>
              
                 
            </div>
            <div className="card custom-card overflow-hidden">
              
            </div>
          </div>
          <div className="col-xxl-4">
  <div className="card custom-card justify-content-between">
    <div className="card-header pb-0">
      <div className="card-title">Project History</div>
    </div>
    <div className="card-body">
      <ul className="list-unstyled profile-timeline">
        {history.length > 0 ? (
          history.map((entry, index) => (
            <li key={index}>
              <div>
                <span className="avatar avatar-sm shadow-sm bg-primary avatar-rounded profile-timeline-avatar">
                  {entry.change_type.charAt(0)} {/* Display the first letter of the change type */}
                </span>
                <div className="mb-2 d-flex align-items-start gap-2">
                  <div>
                    <span className="fw-medium">{entry.change_type}</span>
                  </div>
                  <span className="ms-auto bg-light text-muted badge">
                    {new Date(entry.changed_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-muted mb-0">
                  Changed from <b>{entry.old_value}</b> to <b>{entry.new_value}</b>.
                </p>
              </div>
            </li>
          ))
        ) : (
          <li>
            <div className="text-muted">No history available.</div>
          </li>
        )}
      </ul>
    </div>
              <div className="card-footer">
                <div className="d-sm-flex align-items-center lh-1">
                  <div className="me-sm-2 mb-2 mb-sm-0 p-1 rounded-circle bg-primary-transparent d-inline-block">
                    <img
                      src="../assets/images/faces/5.jpg"
                      alt=""
                      className="avatar avatar-sm avatar-rounded"
                    />
                  </div>
                  <div className="flex-fill">
                    <div className="input-group flex-nowrap">
                      <input
                        type="text"
                        className="form-control w-sm-50 border shadow-none"
                        placeholder="Share your thoughts"
                        aria-label="Recipient's username with two button addons"
                      />
                      <button
                        className="btn btn-primary-light btn-wave waves-effect waves-light"
                        type="button"
                      >
                        <i className="bi bi-emoji-smile" />
                      </button>
                      <button
                        className="btn btn-primary-light btn-wave waves-effect waves-light"
                        type="button"
                      >
                        <i className="bi bi-paperclip" />
                      </button>
                      <button
                        className="btn btn-primary-light btn-wave waves-effect waves-light"
                        type="button"
                      >
                        <i className="bi bi-camera" />
                      </button>
                      <button
                        className="btn btn-primary btn-wave waves-effect waves-light text-nowrap"
                        type="button"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

</>

    );
}