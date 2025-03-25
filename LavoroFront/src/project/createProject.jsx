import React, { useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaRobot, FaDollarSign, FaCalendarAlt, FaUser, FaTasks, FaClipboardList } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const schema = yup.object().shape({
  name: yup.string().min(3, "Project name must be at least 3 characters").required("Project name is required"),
  description: yup.string().min(10, "Description must be at least 10 characters").required("Description is required"),
  budget: yup.number().min(0, "Budget must be a positive number").required("Budget is required"),
  teamManager: yup.string().required("Team manager is required"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date()
    .required("End date is required")
    .min(yup.ref("startDate"), "End date cannot be before start date"),
});

const CreateProject = () => {
  const [isIARemoved, setIsIARemoved] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const projectData = {
        ...data,
        start_date: new Date(data.startDate).toISOString(),
        end_date: new Date(data.endDate).toISOString(),
      };

      const response = await axios.post('http://localhost:3000/project/createProject', projectData);

      if (response.status === 201) {
        Swal.fire("Success!", "Project created successfully!", "success");
        reset();
        setIsIARemoved(true);
      }
    } catch (error) {
      Swal.fire("Error!", "There was an issue creating the project.", "error");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-gradient-primary text-white py-4">
              <h2 className="h4 mb-0 text-center fw-bold">
                <FaClipboardList className="me-2" />
                Create a New Project
              </h2>
            </div>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        {...register("name")} 
                        className={`form-control rounded-3 ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Project Name"
                        id="projectName"
                      />
                      <label htmlFor="projectName" className="text-muted">
                        <FaClipboardList className="me-2" />
                        Project Name
                      </label>
                      {errors.name && (
                        <div className="invalid-feedback d-block">
                          {errors.name.message}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        {...register("teamManager")} 
                        className={`form-control rounded-3 ${errors.teamManager ? 'is-invalid' : ''}`}
                        placeholder="Team Manager"
                        id="teamManager"
                      />
                      <label htmlFor="teamManager" className="text-muted">
                        <FaUser className="me-2" />
                        Team Manager
                      </label>
                      {errors.teamManager && (
                        <div className="invalid-feedback d-block">
                          {errors.teamManager.message}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea 
                        {...register("description")} 
                        className={`form-control rounded-3 ${errors.description ? 'is-invalid' : ''}`}
                        placeholder="Description"
                        id="description"
                        style={{ height: '120px' }}
                      />
                      <label htmlFor="description" className="text-muted">
                        <FaTasks className="me-2" />
                        Project Description
                      </label>
                      {errors.description && (
                        <div className="invalid-feedback d-block">
                          {errors.description.message}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input 
                        type="number" 
                        {...register("budget")} 
                        className={`form-control rounded-3 ${errors.budget ? 'is-invalid' : ''}`}
                        placeholder="Budget"
                        id="budget"
                      />
                      <label htmlFor="budget" className="text-muted">
                        <FaDollarSign className="me-2" />
                        Budget ($)
                      </label>
                      {errors.budget && (
                        <div className="invalid-feedback d-block">
                          {errors.budget.message}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-floating">
                      <select 
                        {...register("status")} 
                        className="form-control rounded-3"
                        id="status"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Archived">Archived</option>
                      </select>
                      <label htmlFor="status" className="text-muted">
                        <FaClipboardList className="me-2" />
                        Status
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-floating">
                      <select 
                        {...register("riskLevel")} 
                        className="form-control rounded-3"
                        id="riskLevel"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <label htmlFor="riskLevel" className="text-muted">
                        <FaClipboardList className="me-2" />
                        Risk Level
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        type="date" 
                        {...register("startDate")} 
                        className={`form-control rounded-3 ${errors.startDate ? 'is-invalid' : ''}`}
                        id="startDate"
                      />
                      <label htmlFor="startDate" className="text-muted">
                        <FaCalendarAlt className="me-2" />
                        Start Date
                      </label>
                      {errors.startDate && (
                        <div className="invalid-feedback d-block">
                          {errors.startDate.message}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        type="date" 
                        {...register("endDate")} 
                        className={`form-control rounded-3 ${errors.endDate ? 'is-invalid' : ''}`}
                        id="endDate"
                      />
                      <label htmlFor="endDate" className="text-muted">
                        <FaCalendarAlt className="me-2" />
                        End Date
                      </label>
                      {errors.endDate && (
                        <div className="invalid-feedback d-block">
                          {errors.endDate.message}
                        </div>
                      )}
                    </div>
                  </div>
                  
<div className="col-12 mt-4 d-flex flex-column gap-3">
  <button 
    type="submit" 
    className="btn btn-primary rounded-pill py-3 fw-bold shadow-sm"
    style={{
      background: 'linear-gradient(135deg, #3a7bd5, #00d2ff)',
      border: 'none',
      letterSpacing: '0.5px',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    }}
  >
    <FaClipboardList className="me-2" />
    Create Project
  </button>
  
  {!isIARemoved && (
    <button
      type="button"
      className="btn btn-outline-primary rounded-pill py-3 fw-bold"
      style={{
        letterSpacing: '0.5px',
        transition: 'all 0.3s ease',
        borderWidth: '2px'
      }}
      onClick={() => setIsIARemoved(true)}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.backgroundColor = 'rgba(58, 123, 213, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.backgroundColor = 'transparent';
      }}
    >
      <FaRobot className="me-2" /> 
      Created with AI
    </button>
  )}
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

export default CreateProject;