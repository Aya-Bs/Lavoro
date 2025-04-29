import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateTeam = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: [],
    members: [],
    color: '#3755e6',
    status: 'Active'
  });
  const [projectInfo, setProjectInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Predefined colors
  const predefinedColors = [
    { name: 'Red', value: '#ea5455' },
    { name: 'Pink', value: '#e83e8c' },
    { name: 'Purple', value: '#7367f0' },
    { name: 'Primary', value: '#3755e6' },
    { name: 'Info', value: '#00cfe8' },
    { name: 'Success', value: '#28c76f' },
    { name: 'Warning', value: '#ff9f43' },
    { name: 'Orange', value: '#fd7e14' },
    { name: 'Secondary', value: '#6c757d' },
    { name: 'Dark', value: '#4b4b4b' }
  ];

  // Fetch team data and members
  useEffect(() => {
    const fetchTeamAndMembers = async () => {
      try {
        setLoading(true);
        
        // Fetch team data
        const teamResponse = await axios.get(`http://localhost:3000/teams/teamDetails/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (teamResponse.data.success) {
          const team = teamResponse.data.data;
          setFormData({
            name: team.name,
            description: team.description || '',
            tags: team.tags || [],
            members: team.members.map(m => m._id),
            color: team.color || '#3755e6',
            status: team.status || 'Active'
          });
          setProjectInfo({
            id: team.project_id._id,
            name: team.project_id.name
          });
        }

        // Fetch all members
        const membersResponse = await axios.get('http://localhost:3000/users/getAllDevelopers');
        const formattedMembers = membersResponse.data.data.map(dev => ({
          _id: dev._id,
          firstName: dev.firstName,
          lastName: dev.lastName,
          role: dev.role?.RoleName || 'Developer',
          image: dev.image,
          email: dev.email
        }));

        setAllMembers(formattedMembers);
        setFilteredMembers(formattedMembers);
      } catch (error) {
        setError('Failed to load team data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamAndMembers();
  }, [id]);

  // Filter members based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredMembers(allMembers);
    } else {
      const filtered = allMembers.filter(member => {
        const fullName = `${member.firstName || ''} ${member.lastName || ''}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
      setFilteredMembers(filtered);
    }
  }, [searchTerm, allMembers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      color: color
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.put(
        `http://localhost:3000/teams/updateTeam/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        navigate(`/teams/teamDetails/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update team');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="alert alert-danger mx-3">
        <i className="ri-error-warning-line me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
        <div>
          <nav>
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/teams'); }}>
                  Teams
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Edit Team
              </li>
            </ol>
          </nav>
          <h1 className="page-title fw-medium fs-18 mb-0">Edit Team: {formData.name}</h1>
        </div>
      </div>

      {/* Main Form */}
      <div className="row">
        <div className="col-xxl-9 col-xl-8">
          <div className="card custom-card">
            <div className="card-header justify-content-between">
              <div className="card-title">
                Edit Team Details
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
                    <label htmlFor="team-name" className="form-label">Team Name*</label>
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
                    <input
                      type="text"
                      className="form-control"
                      id="project-id"
                      value={projectInfo?.name || 'Loading...'}
                      readOnly
                    />
                  </div>

                  <div className="col-xl-6">
                    <label htmlFor="team-status" className="form-label">Status*</label>
                    <select
                      className="form-control"
                      id="team-status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Archived">Archived</option>
                    </select>
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
                            transform: formData.color === color.value ? 'scale(1.2)' : 'scale(1)'
                          }}
                        ></div>
                      ))}
                      <div className="ms-auto d-flex align-items-center">
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
                    <label htmlFor="team-description" className="form-label">Description</label>
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
                    <div className="form-control d-flex flex-wrap align-items-center gap-2"
                      style={{ minHeight: '45px', padding: '0.375rem 0.75rem' }}
                    >
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="badge d-flex align-items-center me-1 mb-1"
                          style={{ 
                            padding: '6px 10px',
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
                      <input
                        type="text"
                        className="border-0 flex-grow-1"
                        id="team-tags"
                        placeholder={formData.tags.length ? "" : "Type a tag and press Enter"}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer text-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={() => navigate(`/teams/${id}`)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                  ) : (
                    <i className="ri-save-line me-1"></i>
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-xxl-3 col-xl-4">
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">Team Members</div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Add Members</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  />
                  <div className={`dropdown-menu w-100 ${isDropdownOpen ? 'show' : ''}`}>
                    {filteredMembers.map(member => (
                      <a
                        key={member._id}
                        className="dropdown-item d-flex align-items-center"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!formData.members.includes(member._id)) {
                            setFormData(prev => ({
                              ...prev,
                              members: [...prev.members, member._id]
                            }));
                          }
                          setSearchTerm('');
                          setIsDropdownOpen(false);
                        }}
                      >
                        <img
                          src={member.image || '/assets/images/faces/1.jpg'}
                          alt={member.firstName}
                          className="avatar avatar-xs rounded-circle me-2"
                        />
                        {member.firstName} {member.lastName}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="selected-members">
                <label className="form-label">Current Members ({formData.members.length})</label>
                <div className="member-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {formData.members.map(memberId => {
                    const member = allMembers.find(m => m._id === memberId);
                    if (!member) return null;

                    return (
                      <div key={member._id} className="d-flex align-items-center justify-content-between mb-2 p-2 border rounded">
                        <div className="d-flex align-items-center">
                          <img
                            src={member.image || '/assets/images/faces/1.jpg'}
                            alt={member.firstName}
                            className="avatar avatar-xs rounded-circle me-2"
                          />
                          <div>
                            <div>{member.firstName} {member.lastName}</div>
                            <small className="text-muted">{member.role}</small>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => {
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
                  <div className="avatar avatar-sm bg-primary text-white rounded me-2">
                    {projectInfo.name.charAt(0)}
                  </div>
                  <div>
                    <h6 className="mb-0">{projectInfo.name}</h6>
                    <small className="text-muted">Project ID: {projectInfo.id}</small>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning mb-0">No project information</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTeam;