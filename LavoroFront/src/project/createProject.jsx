import React, { useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaRobot, FaDollarSign, FaCalendarAlt, FaUser, FaTasks, FaClipboardList } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

// 🎯 Schéma de validation avec Yup
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

  // 🌟 useForm pour gérer les erreurs et soumissions
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
        reset(); // Réinitialiser le formulaire
        setIsIARemoved(true);
      }
    } catch (error) {
      Swal.fire("Error!", "There was an issue creating the project.", "error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-dark text-white text-center">
          <h2 className="mb-0">Create a New Project</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-dark"><FaClipboardList className="me-2" /> Project Name</label>
                <input {...register("name")} className="form-control border-dark" />
                <p className="text-danger">{errors.name?.message}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-dark"><FaUser className="me-2" /> Team Manager</label>
                <input {...register("teamManager")} className="form-control border-dark" />
                <p className="text-danger">{errors.teamManager?.message}</p>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-dark"><FaTasks className="me-2" /> Description</label>
              <textarea {...register("description")} className="form-control border-dark" rows="3" />
              <p className="text-danger">{errors.description?.message}</p>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label text-dark"><FaDollarSign className="me-2" /> Budget</label>
                <input type="number" {...register("budget")} className="form-control border-dark" />
                <p className="text-danger">{errors.budget?.message}</p>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-dark"><FaClipboardList className="me-2" /> Status</label>
                <select {...register("status")} className="form-control border-dark">
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-dark"><FaClipboardList className="me-2" /> Risk Level</label>
                <select {...register("riskLevel")} className="form-control border-dark">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-dark"><FaCalendarAlt className="me-2" /> Start Date</label>
                <input type="date" {...register("startDate")} className="form-control border-dark" />
                <p className="text-danger">{errors.startDate?.message}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-dark"><FaCalendarAlt className="me-2" /> End Date</label>
                <input type="date" {...register("endDate")} className="form-control border-dark" />
                <p className="text-danger">{errors.endDate?.message}</p>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 text-white">Create Project</button>

            {!isIARemoved && (
              <button
                type="button"
                className="btn btn-outline-secondary w-100 mt-3"
                onClick={() => setIsIARemoved(true)}
              >
                <FaRobot className="me-2" /> Created with IA
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
