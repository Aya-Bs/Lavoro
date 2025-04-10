import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const CreateWithAI = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
  
  // Team Manager search state
  const [searchTerm, setSearchTerm] = useState('');
  const [teamManagers, setTeamManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('black');
  
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Initialize date pickers
  useEffect(() => {
    flatpickr("#aiStartDate", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
    });

    flatpickr("#aiEndDate", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
    });
  }, []);

  // Search team managers with debounce
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

  // Check manager availability when selected
  useEffect(() => {
    if (selectedManager) {
      checkTeamManagerProjects(selectedManager._id);
    }
  }, [selectedManager]);

  const searchTeamManagers = async (term) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/getTeamManager?search=${term}`
      );
      setTeamManagers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching team managers:", error);
      setTeamManagers([]);
    }
  };

  const checkTeamManagerProjects = async (managerId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/project/checkTeamManagerProjects/${managerId}`
      );
      setMessage(response.data.message);
      setMessageColor(
        response.data.message.includes("Vous pouvez affecter") 
          ? "#28a745" 
          : "#dc3545"
      );
    } catch (error) {
      console.error("Error checking team manager projects:", error);
      setMessage("Une erreur s'est produite");
      setMessageColor("#dc3545");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedManager(null);
    setMessage("");
  };

  const handleSelectManager = (manager) => {
    setSelectedManager(manager);
    setSearchTerm(`${manager.firstName} ${manager.lastName}`);
    setTeamManagers([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, dateString) => {
    setFormData(prev => ({ ...prev, [name]: dateString }));
  };

  const generateWithAI = async () => {
    if (!formData.name || !formData.description) {
      Swal.fire('Error', 'Please enter project name and description first', 'error');
      return;
    }

    try {
      setAiLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:3000/project/createProjectWithAI',
        {
          name: formData.name,
          description: formData.description,
          client: formData.client,
          manager_id: selectedManager?._id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setFormData(prev => ({
        ...prev,
        budget: response.data.budget,
        start_date: response.data.start_date,
        end_date: response.data.end_date,
        risk_level: response.data.risk_level,
        status: 'Not Started'
      }));

      Swal.fire('Success', 'AI suggestions applied!', 'success');
    } catch (error) {
      console.error('AI generation error:', error);
      Swal.fire('Error', 'Failed to generate AI suggestions', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Your submit logic here
  };

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card custom-card">
          <div className="card-header">
            <div className="card-title">Create Project with AI Assistant</div>
          </div>
          
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row gy-3">
                <div className="col-xl-4">
                  <label className="form-label">Project Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-xl-4">
                  <label className="form-label">Client</label>
                  <input
                    type="text"
                    className="form-control"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                  />
                </div>

                {/* Team Manager Search - Same as in CreateProject */}
                <div className="col-xl-4" style={{ position: "relative" }}>
                  <label className="form-label">Team Manager</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search manager..."
                    value={searchTerm}
                    onChange={handleInputChange}
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

                <div className="col-xl-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>

                <div className="col-xl-12 text-center">
                  <button
                    type="button"
                    className="btn btn-info btn-wave"
                    onClick={generateWithAI}
                    disabled={aiLoading}
                  >
                    {aiLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="ri-magic-line me-1"></i> Generate with AI
                      </>
                    )}
                  </button>
                </div>

                {/* AI-generated fields */}
                <div className="col-xl-4">
                  <label className="form-label">Budget ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-xl-4">
                  <label className="form-label">Start Date</label>
                  <input
                    id="aiStartDate"
                    type="text"
                    className="form-control"
                    name="start_date"
                    value={formData.start_date}
                    onChange={(e) => handleDateChange('start_date', e.target.value)}
                  />
                </div>

                <div className="col-xl-4">
                  <label className="form-label">End Date</label>
                  <input
                    id="aiEndDate"
                    type="text"
                    className="form-control"
                    name="end_date"
                    value={formData.end_date}
                    onChange={(e) => handleDateChange('end_date', e.target.value)}
                  />
                </div>

                <div className="col-xl-6">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="col-xl-6">
                  <label className="form-label">Risk Level</label>
                  <select
                    className="form-control"
                    name="risk_level"
                    value={formData.risk_level}
                    onChange={handleChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="col-xl-12">
                  <label className="form-label">Tags</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Separate with commas"
                  />
                </div>
              </div>

              <div className="card-footer">
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light btn-wave"
                    onClick={() => navigate(-1)}
                  >
                    <i className="ri-arrow-left-line me-1"></i> Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-wave"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWithAI;