import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { FaClipboardList, FaDollarSign, FaCalendarAlt, FaUser, FaTasks, FaClipboardCheck } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateProject = () => {
  const { id } = useParams(); // Récupérer l'ID du projet depuis l'URL
  const navigate = useNavigate(); // Remplacer useHistory par useNavigate

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

  // Charger les données du projet à mettre à jour
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
          navigate(`/overviewPro/${id}`); // Redirection après confirmation
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

  

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-dark text-white text-center">
          <h2 className="mb-0">Update Project</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-dark"><FaClipboardList className="me-2" /> Project Name</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => setProject({ ...project, name: e.target.value })}
                  className="form-control border-dark"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-dark"><FaUser className="me-2" /> Team Manager</label>
                <input
                  type="text"
                  value={project.teamManager}
                  onChange={(e) => setProject({ ...project, teamManager: e.target.value })}
                  className="form-control border-dark"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-dark"><FaTasks className="me-2" /> Description</label>
              <textarea
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                className="form-control border-dark"
                rows="3"
              />
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label text-dark"><FaDollarSign className="me-2" /> Budget</label>
                <input
                  type="number"
                  value={project.budget}
                  onChange={(e) => setProject({ ...project, budget: e.target.value })}
                  className="form-control border-dark"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-dark"><FaClipboardCheck className="me-2" /> Status</label>
                <select
                  value={project.status}
                  onChange={(e) => setProject({ ...project, status: e.target.value })}
                  className="form-control border-dark"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-dark"><FaClipboardCheck className="me-2" /> Risk Level</label>
                <select
                  value={project.riskLevel}
                  onChange={(e) => setProject({ ...project, riskLevel: e.target.value })}
                  className="form-control border-dark"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-dark"><FaCalendarAlt className="me-2" /> Start Date</label>
                <input
                  type="date"
                  value={project.startDate}
                  onChange={(e) => setProject({ ...project, startDate: e.target.value })}
                  className="form-control border-dark"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-dark"><FaCalendarAlt className="me-2" /> End Date</label>
                <input
                  type="date"
                  value={project.endDate}
                  onChange={(e) => setProject({ ...project, endDate: e.target.value })}
                  className="form-control border-dark"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 text-white">Update Project</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProject;
