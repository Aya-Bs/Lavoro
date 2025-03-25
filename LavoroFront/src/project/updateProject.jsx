import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { FaClipboardList, FaDollarSign, FaCalendarAlt, FaUser, FaTasks, FaClipboardCheck, FaSave, FaArrowLeft } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState({
    name: '',
    description: '',
    budget: 0,
    status: 'Not Started',
    riskLevel: 'Medium',
    teamManager: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/project/getProjectById/${id}`);
        const data = response.data;
        setProject({
          name: data.name,
          description: data.description,
          budget: data.budget,
          status: data.status,
          riskLevel: data.risk_level,
          teamManager: data.teamManager,
          startDate: data.start_date ? new Date(data.start_date).toLocaleDateString('en-CA') : '',
          endDate: data.end_date ? new Date(data.end_date).toLocaleDateString('en-CA') : '',
        });
      } catch (error) {
        console.error('Error fetching project:', error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch project data.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK"
        });
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedStartDate = project.startDate ? new Date(project.startDate).toISOString() : null;
    const formattedEndDate = project.endDate ? new Date(project.endDate).toISOString() : null;

    const updatedProject = {
      name: project.name,
      description: project.description,
      budget: project.budget,
      status: project.status,
      risk_level: project.riskLevel,
      teamManager: project.teamManager,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    };

    try {
      const response = await axios.put(`http://localhost:3000/project/updateProjects/${id}`, updatedProject);

      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Your project has been updated successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK"
        }).then(() => {
          navigate(`/overviewPro/${id}`);
        });
      }
    } catch (error) {
      console.error('Error updating project:', error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue updating your project.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK"
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-gradient-dark text-white py-4">
              <h2 className="h4 mb-0 text-center fw-bold">
                <FaClipboardList className="me-2" />
                Update Project
              </h2>
            </div>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="name"
                        value={project.name}
                        onChange={handleChange}
                        className="form-control rounded-3"
                        id="projectName"
                        placeholder="Project Name"
                        required
                      />
                      <label htmlFor="projectName" className="text-muted">
                        <FaClipboardList className="me-2" />
                        Project Name
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="teamManager"
                        value={project.teamManager}
                        onChange={handleChange}
                        className="form-control rounded-3"
                        id="teamManager"
                        placeholder="Team Manager"
                      />
                      <label htmlFor="teamManager" className="text-muted">
                        <FaUser className="me-2" />
                        Team Manager
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        name="description"
                        value={project.description}
                        onChange={handleChange}
                        className="form-control rounded-3"
                        id="description"
                        placeholder="Description"
                        style={{ height: '120px' }}
                      />
                      <label htmlFor="description" className="text-muted">
                        <FaTasks className="me-2" />
                        Project Description
                      </label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-floating">
                      <input
                        type="number"
                        name="budget"
                        value={project.budget}
                        onChange={handleChange}
                        className="form-control rounded-3"
                        id="budget"
                        placeholder="Budget"
                      />
                      <label htmlFor="budget" className="text-muted">
                        <FaDollarSign className="me-2" />
                        Budget ($)
                      </label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-floating">
                      <select
                        name="status"
                        value={project.status}
                        onChange={handleChange}
                        className="form-control rounded-3"
                        id="status"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Archived">Archived</option>
                      </select>
                      <label htmlFor="status" className="text-muted">
                        <FaClipboardCheck className="me-2" />
                        Status
                      </label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-floating">
                      <select
                        name="riskLevel"
                        value={project.riskLevel}
                        onChange={handleChange}
                        className="form-control rounded-3"
                        id="riskLevel"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <label htmlFor="riskLevel" className="text-muted">
                        <FaClipboardCheck className="me-2" />
                        Risk Level
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="date"
                        name="startDate"
                        value={project.startDate}
                        onChange={handleChange}
                        className="form-control rounded-3"
                        id="startDate"
                        required
                      />
                      <label htmlFor="startDate" className="text-muted">
                        <FaCalendarAlt className="me-2" />
                        Start Date
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="date"
                        name="endDate"
                        value={project.endDate}
                        onChange={handleChange}
                        className="form-control rounded-3"
                        id="endDate"
                        required
                      />
                      <label htmlFor="endDate" className="text-muted">
                        <FaCalendarAlt className="me-2" />
                        End Date
                      </label>
                    </div>
                  </div>

                  <div className="col-12 mt-4 d-flex justify-content-between">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold"
                      style={{
                        transition: 'all 0.3s ease',
                        borderWidth: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: '120px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateX(-3px)';
                        e.target.style.backgroundColor = 'rgba(108, 117, 125, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateX(0)';
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <FaArrowLeft className="me-2" />
                      Back
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill px-4 py-2 fw-bold"
                      style={{
                        background: 'linear-gradient(135deg, #3a7bd5, #00d2ff)',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: '160px',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <FaSave className="me-2" />
                      Update Project
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProject;