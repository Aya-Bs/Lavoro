import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateTeam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    project_id: '',
    description: '',
    tags: [],
    members: [],
    color: '#3755e6' // Default color - primary blue
  });
  const [projectInfo, setProjectInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const fetchManagedProjects = async () => {
    setLoadingProjects(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3000/project/managed-by-me', {
        withCredentials: true
      });
  
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch projects');
      }
  
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching managed projects:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load projects');
      
      // Show more detailed error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Full error details:', {
          config: error.config,
          response: error.response,
          stack: error.stack
        });
      }
    }
    finally {
      setLoadingProjects(false);
    }
  };
  const projectSelectionSection = location.state?.projectId ? (
    <>
      <input
        type="text"
        className="form-control"
        id="project-id"
        value={projectInfo ? projectInfo.name : 'No project selected'}
        disabled
      />
      <input
        type="hidden"
        name="project_id"
        value={formData.project_id}
      />
    </>
  ) : (
    <div className="position-relative">
      <input
        type="text"
        className="form-control"
        id="project-id"
        placeholder="Select a project"
        value={formData.project_id 
          ? projects.find(p => p._id === formData.project_id)?.name || 'Selected Project'
          : 'Select a project'
        }
        onClick={() => setShowProjectsDropdown(!showProjectsDropdown)}
        readOnly
      />
      {showProjectsDropdown && (
        <div 
          className="dropdown-menu w-100 show"
          style={{
            position: 'absolute',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
            width: '100%',
            marginTop: '2px',
            border: '1px solid #dee2e6',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
          }}
        >
          {projects.length > 0 ? (
            projects.map(project => (
              <a
                key={project._id}
                className="dropdown-item"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setFormData(prev => ({
                    ...prev,
                    project_id: project._id
                  }));
                  setProjectInfo({
                    id: project._id,
                    name: project.name
                  });
                  setShowProjectsDropdown(false);
                }}
              >
                {project.name}
              </a>
            ))
          ) : (
            <span className="dropdown-item disabled">No projects found</span>
          )}
        </div>
      )}
    </div>
  );


  // Log when dropdown state changes
  useEffect(() => {
    console.log('Dropdown state changed:', isDropdownOpen ? 'open' : 'closed');
  }, [isDropdownOpen]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);

  // Fetch members from backend
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/getAllDevelopers');
        console.log('API Response:', response.data); // Log the response for debugging

        // Handle different response structures
        let membersData = [];
        if (response.data.success && Array.isArray(response.data.data)) {
          membersData = response.data.data;
        } else if (Array.isArray(response.data)) {
          membersData = response.data;
        } else if (typeof response.data === 'object' && response.data !== null) {
          // Try to find an array in the response
          const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            membersData = possibleArrays[0];
          }
        }

        if (membersData.length > 0) {
          const formattedMembers = membersData.map(dev => ({
            _id: dev._id || dev.id || '',
            firstName: dev.firstName || dev.first_name || '',
            lastName: dev.lastName || dev.last_name || '',
            role: (dev.role && dev.role.RoleName) || dev.role || 'Developer',
            image: dev.image || dev.avatar || null,
            email: dev.email || ''
          }));

          setAllMembers(formattedMembers);
          setFilteredMembers(formattedMembers);
        } else {
          console.warn('No members data found in the response');
          setAllMembers([]);
          setFilteredMembers([]);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        setAllMembers([]);
        setFilteredMembers([]);
      }
    };

    fetchMembers();
  }, []);

  // Filter members based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredMembers(allMembers);
    } else {
      const filtered = allMembers.filter(member => {
        // Make sure firstName and lastName exist before using them
        const fullName = `${member.firstName || ''} ${member.lastName || ''}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
      setFilteredMembers(filtered);
    }
  }, [searchTerm, allMembers]);

  // Initialize dropdown when component mounts
  useEffect(() => {
    if (allMembers.length > 0) {
      console.log('All members loaded:', allMembers.length);
      setFilteredMembers(allMembers);
    }
  }, [allMembers]);

  // Member selection is now handled directly in the click handlers

  useEffect(() => {
    if (location.state && location.state.projectId) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // State for tag input
  const [tagInput, setTagInput] = useState('');

  // Predefined colors from the template - organized in color spectrum order
  const predefinedColors = [
    { name: 'Red', value: '#ea5455' },      // Red (Danger)
    { name: 'Pink', value: '#e83e8c' },     // Pink
    { name: 'Purple', value: '#7367f0' },   // Purple
    { name: 'Primary', value: '#3755e6' },  // Blue (Primary)
    { name: 'Info', value: '#00cfe8' },     // Light Blue (Info)
    { name: 'Success', value: '#28c76f' },  // Green (Success)
    { name: 'Warning', value: '#ff9f43' },  // Yellow/Amber (Warning)
    { name: 'Orange', value: '#fd7e14' },   // Orange
    { name: 'Secondary', value: '#6c757d' }, // Gray (Secondary)
    { name: 'Dark', value: '#4b4b4b' }      // Dark Gray/Black
  ];

  // Handle color change
  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      color: color
    }));
  };

  // Handle adding a tag
  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.project_id) {
      setError('No project selected. Please navigate from a project overview page.');
      setLoading(false);
      return;
    }

    try {
      // Make sure color is included in the submission
      const teamData = {
        ...formData,
        color: formData.color || '#3755e6' // Ensure color is always sent
      };

      console.log('Submitting team data:', teamData);

      const response = await axios.post('http://localhost:3000/teams/createTeam', teamData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.data.success) {
        navigate(`/overviewPro/${formData.project_id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
      console.error('Team creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
        {/* Page Header */}
        <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
          <div>
            <nav>
              <ol className="breadcrumb mb-1">
                <li className="breadcrumb-item"><a href="#" onClick={(e) => e.preventDefault()}>Teams</a></li>
                <li className="breadcrumb-item active" aria-current="page">Create Team</li>
              </ol>
            </nav>
            <h1 className="page-title fw-medium fs-18 mb-0">Create Team</h1>
          </div>
          <div className="btn-list">
            <button className="btn btn-white btn-wave">
              <i className="ri-filter-3-line align-middle me-1 lh-1"></i> Filter
            </button>
          </div>
        </div>
        {/* Page Header Close */}

        {/* Start::row-1 */}
        <div className="row">
          <div className="col-xxl-9 col-xl-8">
            <div className="card custom-card">
              <div className="card-header justify-content-between">
                <div className="card-title">
                  Create New Team
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card-body">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="row gy-4">
                    <div className="col-xl-6">
                      <label htmlFor="team-name" className="form-label">Team Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="team-name"
                        name="name"
                        placeholder="Enter Team Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-xl-6">
  <label htmlFor="project-id" className="form-label">Project</label>
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
  {!formData.project_id && !loadingProjects && !error && (
    <small className="text-danger">
      Please select a project to continue
    </small>
  )}
</div>

                    <div className="col-xl-12 mt-3">
                      <label className="form-label">Team Color</label>
                      <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
                        {predefinedColors.map((color, index) => (
                          <div
                            key={index}
                            className="color-option"
                            title={color.name}
                            onClick={() => handleColorChange(color.value)}
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              backgroundColor: color.value,
                              cursor: 'pointer',
                              border: formData.color === color.value ? '2px solid #000' : '1px solid #dee2e6',
                              transition: 'transform 0.2s',
                              transform: formData.color === color.value ? 'scale(1.2)' : 'scale(1)'
                            }}
                          ></div>
                        ))}

                        <div className="ms-auto d-flex align-items-center">
                          <label className="form-label mb-0 me-2">Custom:</label>
                          <div
                            className="color-preview me-2"
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              backgroundColor: formData.color,
                              border: '1px solid #dee2e6'
                            }}
                          ></div>
                          <input
                            type="color"
                            className="form-control form-control-color"
                            value={formData.color}
                            onChange={(e) => handleColorChange(e.target.value)}
                            title="Choose custom team color"
                            style={{ width: '40px' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-12">
                      <label htmlFor="team-description" className="form-label">Team Description</label>
                      <textarea
                        className="form-control"
                        id="team-description"
                        name="description"
                        rows="4"
                        placeholder="Enter team description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-xl-6">
                      <label htmlFor="team-tags" className="form-label">Tags</label>
                      <div className="tag-input-container">
                        {/* Inline tag input with tags */}
                        <div className="form-control d-flex flex-wrap align-items-center gap-2"
                          style={{
                            minHeight: '45px',
                            height: 'auto',
                            padding: '0.375rem 0.75rem'
                          }}
                        >
                          {/* Display tags inline */}
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="badge d-flex align-items-center me-1 mb-1"
                              style={{
                                padding: '6px 10px',
                                fontSize: '14px',
                                fontWeight: 'normal',
                                backgroundColor: formData.color
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

                          {/* Inline input */}
                          <input
                            type="text"
                            className="border-0 flex-grow-1"
                            id="team-tags"
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
                              width: 'auto'
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
                <div className="card-footer text-end">
                  <button
                    type="submit"
                    className="btn btn-primary btn-wave waves-effect waves-light"
                    disabled={loading || !formData.project_id}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    ) : (
                      <i className="bi bi-plus-circle me-1"></i>
                    )}
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-4">
        <div className="card custom-card">
          <div className="card-header">
            <div className="card-title">Assign Team Members</div>
          </div>
          <div className="card-body">
            <div className="col-xl-12">
              <label className="form-label">Team Member</label>
              <div className="position-relative">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => {
                      // Only show dropdown if we have members
                      if (filteredMembers.length > 0) {
                        setIsDropdownOpen(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding dropdown to allow for click events
                      setTimeout(() => setIsDropdownOpen(false), 300);
                    }}
                    onClick={() => {
                      // Toggle dropdown on click
                      if (filteredMembers.length > 0) {
                        setIsDropdownOpen(prev => !prev);
                      }
                    }}
                    style={{
                      marginBottom: '0',
                      paddingRight: '30px'
                    }}
                  />
                  <i
                    className="ri-arrow-down-s-line"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      if (filteredMembers.length > 0) {
                        console.log('Toggling dropdown, filtered members:', filteredMembers.length);
                        setIsDropdownOpen(prev => !prev);
                      } else {
                        console.log('No filtered members available');
                      }
                    }}
                  ></i>
                </div>
                <div
                  className={`dropdown-menu w-100 ${isDropdownOpen && filteredMembers.length > 0 ? 'show' : ''}`}
                  style={{
                    display: isDropdownOpen && filteredMembers.length > 0 ? 'block' : 'none',
                    position: 'absolute',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    width: '100%',
                    marginTop: '2px',
                    border: '1px solid #dee2e6',
                    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map(member => (
                      <a
                        key={member._id}
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation(); // Prevent event bubbling
                          // Directly update the formData state to avoid needing to click twice
                          setFormData(prev => {
                            // Always add the member (don't toggle)
                            if (!prev.members.includes(member._id)) {
                              return { ...prev, members: [...prev.members, member._id] };
                            }
                            return prev; // No change if already selected
                          });
                          setSearchTerm('');
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          padding: '8px 12px'
                        }}
                      >
                        {member.firstName || ''} {member.lastName || ''}
                      </a>
                    ))
                  ) : (
                    <span className="dropdown-item disabled">No members found</span>
                  )}
                </div>
              </div>
              <select
                className="form-control mt-2"
                data-trigger
                name="member-select"
                onChange={(e) => {
                  if (e.target.value) {
                    // Directly update the formData state
                    setFormData(prev => {
                      const memberId = e.target.value;
                      const newMembers = prev.members.includes(memberId)
                        ? prev.members.filter(id => id !== memberId)
                        : [...prev.members, memberId];
                      return { ...prev, members: newMembers };
                    });
                  }
                }}
                style={{ display: 'none' }} // Hide this but keep it for accessibility
              >
                <option value="">Select a member</option>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.firstName || ''} {member.lastName || ''}
                    </option>
                  ))
                ) : (
                  <option disabled>No members found</option>
                )}
              </select>

              {formData.members.length > 0 && (
                <div className="selected-members mt-4">
                  <label className="form-label">Selected Members</label>
                  <div className="member-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {formData.members.map(memberId => {
                      const member = allMembers.find(m => m._id === memberId);
                      if (!member) return null;

                      return (
                        <div key={member._id} className="d-flex align-items-center justify-content-between mb-2 p-2 border rounded">
                          <div className="d-flex align-items-center">
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={`${member.firstName} ${member.lastName}`}
                                className="avatar avatar-xs rounded-circle me-2"
                                style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                              />
                            ) : (
                              <span className="avatar avatar-xs bg-primary text-white rounded-circle me-2">
                                {(member.firstName || '').charAt(0)}{(member.lastName || '').charAt(0) || 'U'}
                              </span>
                            )}
                            <div>
                              <span>{member.firstName || ''} {member.lastName || ''}</span>
                              <small className="text-muted d-block">{member.role}</small>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              // Directly update the formData state to avoid needing to click twice
                              setFormData(prev => ({
                                ...prev,
                                members: prev.members.filter(id => id !== member._id)
                              }));
                            }}
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <small className="text-muted d-block mt-2">
                    {formData.members.length} member(s) selected
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card custom-card mt-3">
          <div className="card-header">
            <div className="card-title">Project Information</div>
          </div>
          <div className="card-body">
            {projectInfo ? (
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <span className="avatar avatar-sm bg-primary text-white rounded">
                    {projectInfo.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h6 className="mb-0">{projectInfo.name}</h6>
                  <span className="text-muted">Active Project</span>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning" role="alert">
                No project selected
              </div>
            )}
          </div>
        </div>
        </div>
        </div>
        {/*End::row-1 */}
      </div>
  );
};

export default CreateTeam;
