import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import "../../public/assets/libs/sweetalert2/sweetalert2.min.css";

export default function ProList() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  const fetchProjects = useCallback(async (searchQuery = '') => {
    setLoading(true);
    setError(null);
    try {
      let url = 'http://localhost:3000/project';
      if (searchQuery.trim()) {
        url = `http://localhost:3000/project/getProjectByName?search=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
      Swal.fire({
        title: "Error",
        text: "Failed to load projects. Please try again later.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        const filtered = projects.filter(project =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProjects(filtered);
      } else {
        setFilteredProjects(projects);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, projects]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setFilteredProjects(sortedProjects);
  };

  const handleViewClick = (projectId) => {
    navigate(`/overviewPro/${projectId}`);
  };

  const handleEditClick = (projectId) => {
    navigate(`/updateProjects/${projectId}`);
  };

  const handleArchiveClick = async (projectId, projectStatus) => {
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

    try {
      const response = await fetch(`http://localhost:3000/project/${projectId}/archive`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to archive project");

      Swal.fire({
        title: "Project Archived",
        text: "The project has been archived successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });

      setProjects(prev => prev.filter(p => p._id !== projectId));
      setFilteredProjects(prev => prev.filter(p => p._id !== projectId));
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
  
          if (!response.ok) throw new Error("Failed to delete project");
  
          Swal.fire("Deleted!", "Your project has been deleted.", "success");
  
          setProjects(prev => prev.filter(p => p._id !== projectId));
          setFilteredProjects(prev => prev.filter(p => p._id !== projectId));
  
        } catch (error) {
          console.error("Error deleting project:", error);
          Swal.fire("Error!", "There was an issue deleting the project.", "error");
        }
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="page-header">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-2">
                <li className="breadcrumb-item">
                  <a href="#" onClick={(e) => e.preventDefault()}>Projects</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Projects List
                </li>
              </ol>
            </nav>
            <h1 className="page-title">Projects List</h1>
          </div>
          <div className="btn-list">
            <button 
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => navigate('/addProject')}
            >
              <i className="ri-add-line"></i> Add New Project
            </button>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Project Management</div>
              <div className="card-options">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                  />
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => fetchProjects(searchTerm)}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    ) : (
                      <i className="ri-search-line"></i>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card-body">
              {loading && projects.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading projects...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-bordered table-striped">
                    <thead className="table-light">
                      <tr>
                        <th 
                          onClick={() => handleSort('name')}
                          className="cursor-pointer"
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            Name
                            {sortConfig.key === 'name' && (
                              <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                            )}
                          </div>
                        </th>
                        <th>Description</th>
                        <th 
                          onClick={() => handleSort('budget')}
                          className="cursor-pointer text-end"
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            Budget
                            {sortConfig.key === 'budget' && (
                              <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                            )}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('start_date')}
                          className="cursor-pointer"
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            Start Date
                            {sortConfig.key === 'start_date' && (
                              <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                            )}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('end_date')}
                          className="cursor-pointer"
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            End Date
                            {sortConfig.key === 'end_date' && (
                              <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                            )}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('status')}
                          className="cursor-pointer"
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            Status
                            {sortConfig.key === 'status' && (
                              <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                            )}
                          </div>
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                          <tr key={project._id}>
                            <td className="fw-semibold">{project.name}</td>
                            <td>
                              <div className="text-truncate" style={{maxWidth: '200px'}} title={project.description}>
                                {project.description || '-'}
                              </div>
                            </td>
                            <td className="text-end">{project.budget ? `${project.budget.toLocaleString()} DT` : '-'}</td>
                            <td>{project.start_date ? new Date(project.start_date).toLocaleDateString() : '-'}</td>
                            <td>{project.end_date ? new Date(project.end_date).toLocaleDateString() : '-'}</td>
                            <td>
                              <span className={`badge ${
                                project.status === 'Completed' ? 'bg-success' :
                                project.status === 'In Progress' ? 'bg-warning' :
                                project.status === 'Not Started' ? 'bg-danger' : 'bg-info'
                              }`}>
                                {project.status}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <button
                                  className="btn btn-sm btn-icon btn-info"
                                  onClick={() => handleViewClick(project._id)}
                                  title="View"
                                >
                                  <i className="ri-eye-line"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-icon btn-warning"
                                  onClick={() => handleEditClick(project._id)}
                                  title="Edit"
                                >
                                  <i className="ri-pencil-line"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-icon btn-secondary"
                                  onClick={() => handleArchiveClick(project._id, project.status)}
                                  disabled={project.status === "In Progress"}
                                  title={project.status === "In Progress" ? "Cannot archive in-progress projects" : "Archive"}
                                >
                                  <i className="ri-archive-line"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-icon btn-danger" 
                                  onClick={() => handleDeleteClick(project._id)}
                                  title="Delete"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-4">
                            <div className="d-flex flex-column align-items-center">
                              <i className="ri-search-line fs-3 text-muted mb-2"></i>
                              {searchTerm ? (
                                <>
                                  <h5>No projects found</h5>
                                  <p className="text-muted">No projects match your search criteria</p>
                                </>
                              ) : (
                                <>
                                  <h5>No projects available</h5>
                                  <p className="text-muted">Click "Add New Project" to get started</p>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {filteredProjects.length > 0 && (
              <div className="card-footer d-flex justify-content-between align-items-center">
                <div className="text-muted">
                  Showing <span className="fw-bold">{filteredProjects.length}</span> projects
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary" disabled>
                    <i className="ri-arrow-left-line"></i> Previous
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" disabled>
                    Next <i className="ri-arrow-right-line"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}