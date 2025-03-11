import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Swal from "sweetalert2"; // Import SweetAlert2
import "../../public/assets/libs/sweetalert2/sweetalert2.min.css"

export default function ProList() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
<<<<<<< HEAD
    fetch('http://localhost:3000/projects') // Adjust the URL if your API is hosted elsewhere
=======
    fetch('http://localhost:3000/project') // Adjust the URL if your API is hosted elsewhere
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  // Function to handle the "View" button click
  const handleViewClick = (projectId) => {
<<<<<<< HEAD
    navigate(`/HistoryPro/${projectId}`); // Navigate to the history page with the project ID
  };


//   const handleArchiveClick = async (projectId) => {
//   try {
//     console.log(`Archiving project with ID: ${projectId}`); // Log the project ID

//     const response = await fetch(`http://localhost:3000/projects/projects/${projectId}/archive`, {
//       method: 'POST',
//     });

//     console.log('Response status:', response.status); // Log the response status

//     if (!response.ok) {
//       const errorData = await response.json(); // Parse the error response
//       console.error('Error response:', errorData); // Log the error response
//       throw new Error('Failed to archive project');
//     }

//     const data = await response.json();
//     console.log('Project archived:', data); // Log the success response

//     // Optionally, refresh the project list after archiving
//     const updatedProjects = projects.filter(project => project._id !== projectId);
//     setProjects(updatedProjects);
//   } catch (error) {
//     console.error('Error archiving project:', error); // Log the error
//   }
// };
=======
    navigate(`/overviewPro/${projectId}`); // Navigate to the history page with the project ID
  };


>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356

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
<<<<<<< HEAD
    const response = await fetch(`http://localhost:3000/projects/${projectId}/archive`, {
=======
    const response = await fetch(`http://localhost:3000/project/${projectId}/archive`, {
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
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
    });

    // Optionally, refresh the project list after archiving
    const updatedProjects = projects.filter((project) => project._id !== projectId);
    setProjects(updatedProjects);
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

    <br />
    <br />
              <li className="breadcrumb-item active" aria-current="page">
              Projects List
              </li>
            </ol>
          </nav>
          <h1 className="page-title fw-medium fs-18 mb-0">Projects List</h1>
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
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div className="d-flex flex-wrap gap-1 project-list-main">
                    <a
                      href="projects-create.html"
                      className="btn btn-primary me-2"
                    >
                      <i className="ri-add-line me-1 fw-medium align-middle" />
                      New Project
                    </a>
                    <select
                      className="form-control"
                      data-trigger=""
                      name="choices-single-default"
                      id="choices-single-default"
                    >
                      <option value="">Sort By</option>
                      <option value="Newest">Newest</option>
                      <option value="Date Added">Date Added</option>
                      <option value="Type">Type</option>
                      <option value="A - Z">A - Z</option>
                    </select>
                  </div>
                  <div className="avatar-list-stacked">
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/1.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/2.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/8.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/12.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/10.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/4.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/5.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/13.jpg" alt="img" />
                    </span>
                    <a
                      className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white"
                      href="javascript:void(0);"
                    >
                      +8
                    </a>
                  </div>
                  <div className="d-flex" role="search">
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="Search Project"
                      aria-label="Search"
                    />
                    <button className="btn btn-light" type="submit">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End::row-1 */}
        {/* Start::row-2 */}
        <div className="row">
            <div className="col-xl-12">
                <div className="card custom-card overflow-hidden">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table text-nowrap">
                                <thead>
                                    <tr>
                                        <th scope="col">Project Name</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Budget</th>
                                        <th scope="col">Start Date</th>
                                        <th scope="col">End Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="me-2">
                                                        <span className="avatar avatar-rounded p-1 bg-info-transparent">
                                                            <img src="../assets/images/company-logos/1.png" alt="" />
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <a href="javascript:void(0);" className="fw-medium fs-14 d-block text-truncate project-list-title">
                                                            {project.name}
                                                        </a>
                                                        
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="text-muted mb-0 project-list-description">
                                                    {project.description}
                                                </p>
                                            </td>
                                            <td>
                                                <div className="avatar-list-stacked">
                                                {project.budget}
                                                </div>
                                            </td>
                                            <td>{new Date(project.start_date).toLocaleDateString()}</td>
                                            <td>{new Date(project.end_date).toLocaleDateString()}</td>
                                            {/* <td>
                                                <div>
                                                    <div className="progress progress-xs progress-animate" role="progressbar" aria-valuenow={65} aria-valuemin={0} aria-valuemax={100}>
                                                        <div className="progress-bar bg-primary" style={{ width: "65%" }} />
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className="text-primary fw-medium">65%</span>

                                                    </div>
                                                </div>
                                            </td> */}
                                            <td>
                                                <span className="badge bg-warning-transparent"> {project.status}</span>
                                            </td>
                                            <td>
                                                <div className="dropdown">
                                                    <a aria-label="anchor" href="javascript:void(0);" className="btn btn-icon btn-sm btn-light" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className="ri-more-2-fill"></i>
                                                    </a>
                                                    <ul className="dropdown-menu">
                                                        <li>
                                                        <a
                                  className="dropdown-item"
                                  onClick={() => handleViewClick(project._id)} // Pass the project ID to the handler
                                >
                                  <i className="ri-eye-line align-middle me-1 d-inline-block" />View
                                </a>
                                                        </li>
                                                        <li><a
    className="dropdown-item"
    href="javascript:void(0);"
    onClick={() => handleArchiveClick(project._id, project.status)} // Pass project ID and status
  >
    <i className="ri-archive-line align-middle me-1 d-inline-block" />Archive
  </a></li>

                                                        <li><a className="dropdown-item" href="javascript:void(0);"><i className="ri-edit-line align-middle me-1 d-inline-block" />Edit</a></li>
                                                        <li><a className="dropdown-item" href="javascript:void(0);"><i className="ri-delete-bin-line me-1 align-middle d-inline-block" />Delete</a></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* End::row-2 */}
        <ul className="pagination justify-content-end">
          <li className="page-item disabled">
            <a className="page-link">Previous</a>
          </li>
          <li className="page-item">
            <a className="page-link" href="javascript:void(0);">
              1
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="javascript:void(0);">
              2
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="javascript:void(0);">
              3
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="javascript:void(0);">
              Next
            </a>
          </li>
        </ul>

</>

    )
    }