import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Quill Editor
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

// FilePond
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

// Flatpickr
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import Select from 'react-select';

import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

// Register FilePond plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageEdit,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

export const CreateTask = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [projects, setProjects] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [projectInfo, setProjectInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const [formData, setFormData] = useState({
      title: '',
      description: '',
      project_id: '',
      assigned_to: '',
      status: 'Not Started',
      priority: 'Medium',
      deadline: '',
      start_date: '',
      estimated_duration: '',
      tags: []
    });

    const [tagInput, setTagInput] = useState('');
    const [productFeatures, setProductFeatures] = useState('');

    // Static task counts for team members with varied numbers
    const staticTaskCounts = {
      'member1_id': 2,
      'member2_id': 5,
      'member3_id': 4,
      'member4_id': 1,
      'member5_id': 3
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoadingProjects(true);
            setLoadingMembers(true);
            
            // Fetch projects
            const projectsResponse = await axios.get('http://localhost:3000/project/managed-by-me', {
              withCredentials: true
            });
            
            if (!projectsResponse.data.success) {
              throw new Error(projectsResponse.data.message || 'Failed to fetch projects');
            }
            
            // Fetch team members
            const membersResponse = await axios.get('http://localhost:3000/teamMember/getAllMembers', {
              withCredentials: true
            });
            
            if (!membersResponse.data.success) {
              throw new Error(membersResponse.data.message || 'Failed to fetch team members');
            }
            
            // Transform data to match expected structure
            const formattedMembers = membersResponse.data.data.map(member => ({
              ...member,
              _id: member.id || member._id,
              user_id: member.user_id, // Store user_id from response
              name: member.name || 'Unnamed Member',
              image: member.image || '../assets/images/faces/11.jpg',
              role: member.role || 'Developer',
              taskCount: staticTaskCounts[member.id || member._id] || Math.floor(Math.random() * 6) // Use static count or random if not specified
            }));
            
            setProjects(projectsResponse.data.data);
            setTeamMembers(formattedMembers);
          } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load data');
          } finally {
            setLoadingProjects(false);
            setLoadingMembers(false);
          }
        };
      
        fetchData();
    }, []);

    useEffect(() => {
      if (location.state?.projectId) {
        setFormData(prev => ({
          ...prev,
          project_id: location.state.projectId
        }));
        setProjectInfo({
          id: location.state.projectId,
          name: location.state.projectName || 'Selected Project'
        });
      }
    }, [location]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    useEffect(() => {
      if (formData.assigned_to) {
        const member = teamMembers.find(m => m._id === formData.assigned_to);
        setSelectedMember(member);
      } else {
        setSelectedMember(null);
      }
    }, [formData.assigned_to, teamMembers]);

    const handleTeamMemberChange = (e) => {
      const selectedId = e.target.value;
      const selectedMember = teamMembers.find(m => m._id === selectedId);
      
      if (selectedMember && selectedMember.taskCount >= 5) {
        Swal.fire({
          icon: 'error',
          title: 'Cannot Assign Task',
          text: `${selectedMember.name} already has 5 tasks. Please select another team member.`,
          confirmButtonText: 'OK'
        });
        setFormData(prev => ({
          ...prev,
          assigned_to: ''
        }));
        setSelectedMember(null);
      } else {
        setFormData(prev => ({
          ...prev,
          assigned_to: selectedId
        }));
      }
    };

    const handleProjectChange = (e) => {
      const projectId = e.target.value;
      const selectedProject = projects.find(p => p._id === projectId);
      
      setFormData(prev => ({
        ...prev,
        project_id: projectId
      }));
      
      if (selectedProject) {
        setProjectInfo({
          id: selectedProject._id,
          name: selectedProject.name
        });
      }
    };

    const handleAddTag = () => {
      if (tagInput.trim() !== '' && !formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
        setTagInput('');
      }
    };

    const handleRemoveTag = (tagToRemove) => {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
    };

    const stripHtmlTags = (html) => {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
    
      try {
        const response = await axios.post('http://localhost:3000/tasks/createTask', {
          ...formData,
          description: stripHtmlTags(productFeatures)
        }, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        if (response.data.success) {
          // Create notification for the assigned team member
          if (formData.assigned_to) {
            try {
              const selectedMember = teamMembers.find(m => m._id === formData.assigned_to);
              const userId = selectedMember.user_id; // Use user_id from teamMembers

              const notificationData = {
                userId: userId,
                task: {
                  _id: response.data.data._id,
                  title: formData.title,
                  start_date: new Date(formData.start_date),
                  deadline: new Date(formData.deadline),
                  priority: formData.priority,
                  status: formData.status
                }
              };

              await axios.post('http://localhost:3000/notifications/create', notificationData, {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            } catch (notificationError) {
              console.error('Error creating notification:', notificationError);
              // Don't block task creation if notification fails
            }
          }
    
          navigate("/listTask");
          Swal.fire({
            icon: 'success',
            title: 'Task Created',
            text: 'Task has been created successfully',
            confirmButtonText: 'OK'
          });
        }
      } catch (err) {
        console.error('Task creation error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to create task');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || err.message || 'Failed to create task',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false);
      }
    };

    const projectSelectionSection = (
      <select
        id="project-select"
        className="form-select"
        name="project_id"
        value={formData.project_id}
        onChange={handleProjectChange}
        disabled={loadingProjects}
        required
      >
        <option value="">Select a project</option>
        {projects.map(project => (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        ))}
      </select>
    );

    if (loadingProjects || loadingMembers) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
          <button className="btn btn-sm btn-link" onClick={() => setError('')}>Try again</button>
        </div>
      );
    }

    return (
      <>
        <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
          <div>
            <nav>
              <ol className="breadcrumb mb-1">
                <li className="breadcrumb-item">
                  <a href="javascript:void(0);">Tasks</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Create Task
                </li>
              </ol>
            </nav>
            <h1 className="page-title fw-medium fs-18 mb-0">
              Create Task
            </h1>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="card-body add-products">
                <form onSubmit={handleSubmit}>
                  <div className="row gx-4">
                    <div className="col-xxl-6 col-xl-12 col-lg-12 col-md-6">
                      <div className="card custom-card shadow-none mb-0 border-0">
                        <div className="card-body p-0">
                          <div className="row gy-3">
                            <div className="col-xl-12">
                              <label htmlFor="task-title" className="form-label">Task Name</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                id="task-title" 
                                name="title"
                                placeholder="Enter task name"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            
                            <div className="col-xl-6">
                              <label className="form-label">Priority</label>
                              <select
                                className="form-select"
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                              </select>
                            </div>

                            <div className="col-xl-6">
                              <label htmlFor="estimated-duration" className="form-label">Estimated Duration (days)</label>
                              <input 
                                type="number" 
                                className="form-control" 
                                id="estimated-duration" 
                                name="estimated_duration"
                                placeholder="Enter duration in days"
                                value={formData.estimated_duration}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="col-xl-6">
                              <label htmlFor="start-date" className="form-label">Start Date</label>
                              <Flatpickr
                                id="start-date"
                                className="form-control"
                                placeholder="Choose start date"
                                value={formData.start_date}
                                onChange={(date) => setFormData({...formData, start_date: date[0]})}
                                options={{
                                  dateFormat: 'Y-m-d',
                                }}
                              />
                            </div>

                            <div className="col-xl-6">
                              <label htmlFor="end-date" className="form-label">End Date</label>
                              <Flatpickr
                                id="deadline"
                                className="form-control"
                                placeholder="Choose end date"
                                value={formData.deadline}
                                onChange={(date) => setFormData({...formData, deadline: date[0]})}
                                options={{
                                  dateFormat: 'Y-m-d',
                                }}
                              />
                            </div>

                            <div className="col-xl-6">
                              <label htmlFor="project-select" className="form-label">Project</label>
                              {loadingProjects ? (
                                <div className="d-flex align-items-center">
                                  <div className="spinner-border spinner-border-sm me-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                  <span>Loading projects...</span>
                                </div>
                              ) : error ? (
                                <div className="alert alert-danger">{error}</div>
                              ) : (
                                projectSelectionSection
                              )}
                            </div>

                            <div className="col-xl-6">
                              <label htmlFor="team-member-select" className="form-label">Team Member</label>
                              <select
                                id="team-member-select"
                                className="form-select"
                                name="assigned_to"
                                value={formData.assigned_to}
                                onChange={handleTeamMemberChange}
                                disabled={loadingMembers}
                              >
                                <option value="">Select a team member</option>
                                {teamMembers.map(member => (
                                  <option 
                                    key={member._id} 
                                    value={member._id}
                                    style={member.taskCount >= 5 ? { backgroundColor: '#ffe6e6', color: '#cc0000' } : {}}
                                  >
                                    {member.name || `Member ${member._id}`} {member.taskCount >= 5 ? '(Max Tasks)' : `(${member.taskCount} tasks)`}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {selectedMember && (
                              <div className="col-xl-8 mx-auto">
                                <div className="card-body border-bottom border-blockend-dashed">
                                  <div className="d-flex flex-column align-items-center justify-content-center text-center">
                                    <div className="mb-2">
                                      <span className="avatar avatar-xl avatar-rounded">
                                        {selectedMember.image ? (
                                          <img
                                            src={
                                              selectedMember.image.startsWith('http') || selectedMember.image.startsWith('https')
                                                ? selectedMember.image
                                                : `http://localhost:3000${selectedMember.image}`
                                            }
                                            alt={selectedMember.name} 
                                            className="img-fluid" 
                                            onError={(e) => {
                                              e.target.src = '../assets/images/faces/11.jpg';
                                            }}
                                          />
                                        ) : (
                                          <img 
                                            src="../assets/images/faces/11.jpg" 
                                            alt={selectedMember.name} 
                                            className="img-fluid" 
                                          />
                                        )}
                                      </span>
                                    </div>
                                    <h6 className="fw-semibold mb-2">
                                      {selectedMember.name}
                                    </h6>
                                    <div className="mb-2">
                                      <span className="badge bg-info-transparent fw-xxl">
                                        {selectedMember.role}
                                      </span>
                                    </div>
                                    <div className="mb-2">
                                      <span className="badge bg-secondary-transparent">
                                        Current Tasks: {selectedMember.taskCount}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}                      
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xxl-6 col-xl-12 col-lg-12 col-md-6">
                      <div className="card custom-card shadow-none mb-0 border-0">
                        <div className="card-body p-0">
                          <div className="row gy-3">
                            <div className="col-xl-12">
                              <label className="form-label">Task Description</label>
                              <ReactQuill
                                theme="snow"
                                value={productFeatures}
                                onChange={setProductFeatures}
                                modules={{
                                  toolbar: [
                                    [{ 'header': [1, 2, false] }],
                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                    [{'list': 'ordered'}, {'list': 'bullet'}],
                                    ['link', 'image'],
                                    ['clean']
                                  ]
                                }}
                              />
                            </div>
                            
                            <div className="col-xl-12">
                              <label htmlFor="task-tags" className="form-label">Tags</label>
                              <div className="tag-input-container">
                                <div className="form-control d-flex flex-wrap align-items-center gap-2"
                                  style={{
                                    minHeight: '45px',
                                    height: 'auto',
                                    padding: '0.375rem 0.75rem'
                                  }}
                                >
                                  {formData.tags.map((tag, index) => (
                                    <span
                                      key={index}
                                      className="badge d-flex align-items-center me-1 mb-1"
                                      style={{
                                        padding: '6px 10px',
                                        fontSize: '14px',
                                        fontWeight: 'normal',
                                        backgroundColor: '#3498DB',
                                        color: 'white'
                                      }}
                                    >
                                      {tag}
                                      <i
                                        className="ri-close-line ms-1"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleRemoveTag(tag)}
                                      ></i>
                                    </span>
                                  ))}

                                  <input
                                    type="text"
                                    className="border-0 flex-grow-1"
                                    id="task-tags"
                                    placeholder={formData.tags.length > 0 ? "" : "Type a tag and press Enter"}
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                      }
                                    }}
                                    style={{
                                      outline: 'none',
                                      minWidth: '100px',
                                      width: 'auto',
                                      backgroundColor: 'transparent',
                                      border: 'none',
                                    }}
                                  />
                                </div>
                                <small className="text-muted d-block mt-2">
                                  Type a tag and press Enter to add it
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />

                  <div className="card-footer border-top border-blockstart-dashed d-sm-flex justify-content-end">
                    <button type="submit" className="btn btn-primary mb-2 mb-sm-0" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          Save <i className="ri-check-line ms-2"></i>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};