import React, { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

// Register FilePond plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateSize,
  FilePondPluginFileEncode,
  FilePondPluginImageEdit,
  FilePondPluginFileValidateType,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

export default function UpdateProject() {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [teamManagers, setTeamManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("black");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const pondRef = useRef(null);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    budget: 0,
    client: '',
    start_date: '',
    end_date: '',
    status: 'Not Started',
    risk_level: 'Medium',
    tags: ''
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/project/getProjectById/${id}`);
        const data = response.data;
        setProjectData({
          name: data.name,
          description: data.description,
          budget: data.budget,
          client: data.client,
          start_date: data.start_date ? data.start_date.split('T')[0] : '',
          end_date: data.end_date ? data.end_date.split('T')[0] : '',
          status: data.status,
          risk_level: data.risk_level,
          tags: data.tags
        });
        
        if (data.teamManager) {
          setSelectedManager({
            _id: data.manager_id,
            firstName: data.teamManager.split(' ')[0],
            lastName: data.teamManager.split(' ')[1] || ''
          });
          setSearchTerm(data.teamManager);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch project data.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, dateString) => {
    setProjectData(prev => ({
      ...prev,
      [name]: dateString
    }));
  };

  const validateProject = () => {
    if (!projectData.name.trim()) {
      setMessage({ text: 'Project name is required', color: 'red' });
      return false;
    }

    if (projectData.start_date && projectData.end_date) {
      const start = new Date(projectData.start_date);
      const end = new Date(projectData.end_date);
      if (end < start) {
        setMessage({ text: 'End date cannot be before start date', color: 'red' });
        return false;
      }
    }

    return true;
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!validateProject()) return;

    try {
      setLoading(true);
      
      const dataToSend = {
        ...projectData,
        budget: Number(projectData.budget),
        start_date: projectData.start_date ? new Date(projectData.start_date).toISOString() : null,
        end_date: projectData.end_date ? new Date(projectData.end_date).toISOString() : null,
        ...(selectedManager && { 
          manager_id: selectedManager._id,
          teamManager: `${selectedManager.firstName} ${selectedManager.lastName}`
        })
      };

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:3000/project/updateProjects/${id}`,
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await Swal.fire({
        title: 'Success!',
        text: 'Project updated successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      });

      navigate('/ListPro');
      
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Error updating project',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonctions pour la gestion du Team Manager (identiques à CreateProject)
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedManager(null);
    setMessage("");

    if (value === "") {
      setTeamManagers([]);
    }
  };

  const handleSelectManager = (manager) => {
    setSelectedManager(manager);
    setSearchTerm(`${manager.firstName} ${manager.lastName}`);
    setTeamManagers([]);
  };

  const searchTeamManagers = async (term) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/getTeamManager?search=${term}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setTeamManagers(data);
    } catch (error) {
      console.error("Error fetching team managers:", error);
      setTeamManagers([]);
    }
  };

  const checkTeamManagerProjects = async (managerId) => {
    try {
      const response = await axios.get(`http://localhost:3000/project/checkTeamManagerProjects/${managerId}`);
      setMessage(response.data.message);
      setMessageColor(response.data.message.includes("Vous pouvez affecter") ? "#28a745" : "#dc3545");
    } catch (error) {
      console.error("Error checking team manager projects:", error);
      setMessage("An error occurred");
      setMessageColor("#dc3545");
    }
  };

  // Initialisation des plugins (identique à CreateProject)
  useEffect(() => {
    flatpickr("#startDate", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
    });

    flatpickr("#endDate", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
    });

    const assignedTeamMembers = document.querySelector('#assigned-team-members');
    if (assignedTeamMembers) {
      new Choices(assignedTeamMembers, {
        allowHTML: true,
        removeItemButton: true,
      });
    }

    const choicesTextUniqueValues = document.querySelector('#choices-text-unique-values');
    if (choicesTextUniqueValues) {
      new Choices(choicesTextUniqueValues, {
        allowHTML: true,
        paste: false,
        duplicateItemsAllowed: false,
        editItems: true,
      });
    }
  }, []);

  // Effet pour rechercher les Team Managers
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchTeamManagers(searchTerm);
      } else {
        setTeamManagers([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Effet pour vérifier les projets du Team Manager
  useEffect(() => {
    if (selectedManager) {
      checkTeamManagerProjects(selectedManager._id);
    }
  }, [selectedManager]);

  if (loading) {
    return <div>Loading...</div>;
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
              <li className="breadcrumb-item active" aria-current="page">
                Update Project
              </li>
            </ol>
          </nav>
          <h1 className="page-title fw-medium fs-18 mb-0">Update Project</h1>
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
      <div className="row">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">Update Project</div>
            </div>
            <div className="card-body">
              <div className="row gy-3">
                <div className="col-xl-4">
                  <label htmlFor="input-label" className="form-label">
                    Project Name :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={projectData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-xl-4" style={{ position: "relative" }}>
                  <label htmlFor="input-label11" className="form-label" style={{ color: "var(--text-color)" }}>
                    Team Manager :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label11"
                    placeholder="Team Manager Name"
                    value={searchTerm}
                    onChange={handleInputChange}
                    style={{
                      backgroundColor: "var(--background-color)",
                      color: "var(--text-color)",
                    }}
                  />

                  {searchTerm && teamManagers.length > 0 && (
                    <ul
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "var(--background-color)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "4px",
                        boxShadow: "0 4px 8px rgba(96, 94, 94, 0.57)",
                        zIndex: 1000,
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        color: "var(--text-color)",
                      }}
                    >
                      {teamManagers.map((manager) => (
                        <li
                          key={manager._id}
                          onClick={() => handleSelectManager(manager)}
                          style={{
                            padding: "10px",
                            cursor: "pointer",
                            borderBottom: "1px solid var(--border-color)",
                            transition: "background-color 0.2s",
                            display: "flex",
                            alignItems: "center",
                          }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "var(--hover-background)")}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = "var(--background-color)")}
                        >
                          <img
                            src={`http://localhost:3000${manager.image}` || "https://via.placeholder.com/30"}
                            alt={`${manager.firstName} ${manager.lastName}`}
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                          />
                          <span>
                            {manager.firstName} {manager.lastName}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {selectedManager && (
                    <div>
                      <p style={{ color: messageColor }}>{message}</p>
                    </div>
                  )}
                </div>
                <div className="col-xl-4">
                  <label htmlFor="input-label1" className="form-label">
                    Client / Stakeholder :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="client"
                    value={projectData.client}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-xl-12">
                  <label className="form-label">Project Description :</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={projectData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Start Date :</label>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-text text-muted">
                        <i className="ri-calendar-line" />
                      </div>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="start_date"
                        value={projectData.start_date}
                        onChange={(e) => handleDateChange('start_date', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">End Date :</label>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-text text-muted">
                        <i className="ri-calendar-line" />
                      </div>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="end_date"
                        value={projectData.end_date}
                        onChange={(e) => handleDateChange('end_date', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Status :</label>
                  <select
                    className="form-control"
                    name="status"
                    value={projectData.status}
                    onChange={handleChange}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Priority :</label>
                  <select
                    className="form-control"
                    name="risk_level"
                    value={projectData.risk_level}
                    onChange={handleChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="col-xl-6">
                  <label>Budget</label>
                  <input
                    type="number"
                    className="form-control"
                    name="budget"
                    value={projectData.budget}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Tags</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tags"
                    value={projectData.tags}
                    onChange={handleChange}
                    placeholder="Separated by commas"
                  />
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button 
                className="btn btn-primary-light btn-wave ms-auto float-end" 
                onClick={handleUpdateProject} 
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Project'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}