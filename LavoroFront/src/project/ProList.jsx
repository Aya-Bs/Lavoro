import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import "../../public/assets/libs/sweetalert2/sweetalert2.min.css";

export default function ProList() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fonction pour récupérer les projets
  const fetchProjects = async (searchTerm = '') => {
    try {
      let url = 'http://localhost:3000/project';
      if (searchTerm) {
        url = `http://localhost:3000/project/getProjectByName?search=${searchTerm}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects(); // Charger les projets au premier rendu
  }, []);

  const handleViewClick = (projectId) => {
    navigate(`/overviewPro/${projectId}`);
  };

  const handleEditClick = (projectId) => {
    navigate(`/updateProjects/${projectId}`); // Rediriger vers la page de mise à jour
  };

  const handleArchiveClick = async (projectId, projectStatus) => {
    try {
      if (projectStatus === "In Progress") {
        Swal.fire({
          title: "Cannot Archive Project",
          text: "The project is still in progress and cannot be archived.",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
        return;
      }

      const response = await fetch(`http://localhost:3000/project/${projectId}/archive`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to archive project");
      }

      Swal.fire({
        title: "Project Archived",
        text: "The project has been archived successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });

      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error("Error archiving project:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while archiving the project.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    fetchProjects(e.target.value);
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
  
          if (!response.ok) {
            throw new Error("Failed to delete project");
          }
  
          Swal.fire("Deleted!", "Your project has been deleted.", "success");
  
          // Mettre à jour la liste après suppression
          setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
  
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
                <a href="#" onClick={(e) => e.preventDefault()}>Projects</a>
              </li>
              <span className="mx-1">→</span>
              <li className="breadcrumb-item active" aria-current="page">
                Projects List
              </li>
            </ol>
          </nav>
          <h1 className="page-title fw-medium fs-18 mb-0">Projects List</h1>
        </div>
      </div>

      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher un projet..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="btn btn-primary me-2" onClick={() => fetchProjects(searchTerm)}>
          <i className="ri-search-line me-1"></i> Rechercher
        </button>
      </div>

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
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <tr key={project._id}>
                          <td>{project.name}</td>
                          <td>{project.description}</td>
                          <td>{project.budget}</td>
                          <td>{new Date(project.start_date).toLocaleDateString()}</td>
                          <td>{new Date(project.end_date).toLocaleDateString()}</td>
                          <td>
                            <span className="badge bg-warning-transparent">{project.status}</span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleViewClick(project._id)}
                              >
                                <i className="ri-eye-line me-1"></i> View
                              </button>
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => handleArchiveClick(project._id, project.status)}
                              >
                                <i className="ri-archive-line me-1"></i> Archive
                              </button>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleEditClick(project._id)}
                              >
                                <i className="ri-pencil-line me-1"></i> Edit
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(project._id)}>
                                    <i className="ri-delete-bin-6-line me-1"></i> Delete
                              </button>

                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">Aucun projet trouvé</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
