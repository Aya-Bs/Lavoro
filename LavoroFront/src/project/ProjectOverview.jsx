import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import Swal from 'sweetalert2';
import axios from 'axios';

export default function ProjectOverview(){
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null); // State for project details
  const [history, setHistory] = useState([]); // State for project history
  const [loading, setLoading] = useState(true); // State for loading status
  const [manager, setManager] = useState(null); // State for manager details
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage] = useState(7); // Number of items per page
  const navigate = useNavigate(); // Initialize the navigate function
  const [projectDuration, setProjectDuration] = useState(0);


  // Calculate the index of the first and last item on the current page
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentHistory = history.slice(indexOfFirstItem, indexOfLastItem);


// Calculate the total number of pages
const totalPages = Math.ceil(history.length / itemsPerPage);

// Handle page change
const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};


const handleArchiveClick = async (projectId, projectStatus) => {
  try {
    // Check if the project status is "In Progress"
    if (projectStatus === "In Progress") {
      Swal.fire({
        title: "Cannot Archive Project",
        text: "The project is still in progress and cannot be archived.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return; // Exit the function
    }

    // Proceed with archiving if the status is "Completed" or "Not Started"
    const response = await fetch(`http://localhost:3000/project/${projectId}/archive`, {
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json(); // Parse the error response
      console.error("Error response:", errorData); // Log the error response
      throw new Error("Failed to archive project");
    }

    const data = await response.json();
    console.log("Project archived:", data); // Log the success response

    // Show success alert
    Swal.fire({
      title: "Project Archived",
      text: "The project has been archived successfully.",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
  }).then((result) => {
    if (result.isConfirmed) {
      // Redirect to the archive page after the user clicks "OK"
      navigate('/listPro'); // Replace '/archive' with your actual archive page route
    }
  });

  } catch (error) {
    console.error("Error archiving project:", error); // Log the error
    Swal.fire({
      title: "Error",
      text: "An error occurred while archiving the project.",
      icon: "error",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  }
};

const handleEditClick = (projectId) => {
  navigate(`/updateProjects/${projectId}`);
};

const handleDelete = async (projectId) => {
  // Use SweetAlert2 for confirmation
  if (project.status === "In Progress") {
    return Swal.fire({
      title: "Action Not Allowed",
      text: "Projects that are in progress cannot be deleted.",
      icon: "warning",
    });
  }
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      // Call the backend API to delete the project
      const response = await fetch(`http://localhost:3000/project//deleteProject/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Show success message
        Swal.fire({
          title: "Deleted!",
          text: "The project has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to the projects list page after the user clicks "OK"
            navigate('/listPro'); // Replace '/listPro' with your actual projects list page route
          }
        });
      } else {
        const errorData = await response.json();
        Swal.fire("Error!", errorData.message || "Failed to delete the project.", "error");
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      Swal.fire("Error!", "An error occurred while deleting the project.", "error");
    }
  }
};

  // Fetch project details
  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/project/${id}`);
      
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON');
      }
  
      const data = await response.json();
      if (response.ok) {
        setProject(data); // Set project details
  
        // Manager details are already included in the response
        if (data.manager_id) {
          console.log('Manager Data:', data.manager_id); // Log the manager object
          setManager(data.manager_id); // Set manager details
        }
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

    
        const fetchActuelDuration = async () => {
          try {
            const response = await axios.get("http://localhost:3000/project/calculateDuration");
            setProjectDuration(response.data.count);
          } catch (error) {
            console.error("Erreur lors de la récupération du nombre de projets :", error);
          }
        };
    
        fetchActuelDuration();


  }, [id]);

  // Display loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display error if project is not found
  if (!project) {
    return <div>Project not found.</div>;
  }

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
        <div className="col-xxl-3 col-xl-6">
                <div className="card custom-card overflow-hidden main-content-card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-2 gap-1 flex-xxl-nowrap flex-wrap">
                      <div>
                        <span className="text-muted d-block mb-1 text-nowrap">
                          Actuel Duration
                        </span>
                        <h4 className="fw-medium mb-0">{projectDuration}</h4>
                      </div>
                      <div className="lh-1">
                        <span className="avatar avatar-md avatar-rounded bg-primary3">
                          <i className="ri-bar-chart-2-line fs-5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        {/* Page Header Close */}
        {/* Start::row-1 */}
        <div className="row">
          <div className="col-xxl-8">
            <div className="card custom-card">
              <div className="card-header justify-content-between">
                <div className="card-title">Project Details</div>
                <div className="d-flex gap-1">
                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleEditClick(project._id)}
                                >
                                  <i className="ri-pencil-line me-1"></i> Edit
                                </button>
  <a
    className="btn btn-sm btn-primary btn-wave"
    onClick={() => handleDelete(project._id)}
  >
    {/* <i className="ri-delete-bin-line align-middle me-1 fw-medium" /> */}
    Delete
  </a>

  <a
    href="javascript:void(0);"
    className="btn btn-sm btn-primary1 btn-wave"
    onClick={() => handleArchiveClick(project._id, project.status)}
  >
    {/* <i className="ri-archive-line align-middle fw-medium me-1" /> */}
    Archive
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
                  <div className="d-flex align-items-center gap-2 me-3">
                    <span className="avatar avatar-md avatar-rounded me-1 bg-primary1-transparent">
                      <i className="ri-money-dollar-circle-line fs-18 lh-1 align-middle" />
                    </span>
                    <div>
                      <div className="fw-medium mb-0 task-title">
                        Budget                      
                      </div>
                      <span className="fs-12 text-muted">{project.budget} </span>
                    </div>
                  </div>


    
     <div className="d-flex align-items-center gap-2 me-3">
                    <span className="avatar avatar-md avatar-rounded me-1 bg-primary2-transparent">
                      <i className="ri-user-3-line fs-18 lh-1 align-middle" />

                    </span>
                      
  <div>
    <span className="d-block fs-14 fw-medium">
    Project Manager
    </span>
    <span className="fs-12 text-muted">
    {manager && manager.firstName && manager.lastName
        ? `${manager.firstName} ${manager.lastName}`
        : 'Manager not assigned'}
       </span>
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
                        <div className="fs-15 fw-medium">Risks :</div>
                        <a
                          href="javascript:void(0);"
                          className="btn btn-primary-light btn-wave btn-sm waves-effect waves-light"
                        >
                          {project.risk_level}
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
                <div className="fs-15 fw-medium mb-2">Tags :</div>
                <div className="d-flex gap-2 flex-wrap">
                {project.tags.split(',').map((tag, index) => (
              <span key={index} className="badge bg-light text-default border">
                {tag.trim()}
              </span>
            ))}       
                  
                  
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
        {currentHistory.length > 0 ? (
          currentHistory.map((entry, index) => (
            <li key={index}>
              <div>
                <span className="avatar avatar-sm shadow-sm bg-primary avatar-rounded profile-timeline-avatar">
                  {entry.change_type.charAt(0)}
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
                {entry.change_type === 'Project Created' ? (
                  <p className="text-muted mb-0">
                     <b>{entry.new_value}</b>
                  </p>
                ) : (
                  <p className="text-muted mb-0">
                    Changed from <b>{entry.old_value}</b> to <b>{entry.new_value}</b>.
                  </p>
                )}
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
  <div className="d-flex justify-content-center align-items-center w-100">
    <div className="d-flex align-items-center gap-2">
      <button
        className="btn btn-primary-light btn-wave waves-effect waves-light"
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="ri-arrow-left-s-line"></i>
      </button>
      <span className="btn-primary-light mx-2">
        {currentPage} / {totalPages}
      </span>
      <button
        className="btn btn-primary-light btn-wave waves-effect waves-light"
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="ri-arrow-right-s-line"></i>
      </button>
    </div>
  </div>
</div>
  </div>
</div>
 </div>
</>

    );
}