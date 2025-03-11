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
import { useNavigate } from "react-router-dom";

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

export default function CreateProject() {
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche
  const [teamManagers, setTeamManagers] = useState([]); // Liste des Team Managers
  const [selectedManager, setSelectedManager] = useState(null); // Team Manager sélectionné
  const [message, setMessage] = useState(""); // Message dynamique
  const [messageColor, setMessageColor] = useState("black"); // Couleur du message
  const [loading, setLoading] = useState(true); // État de chargement
  const [user, setUser] = useState(null); // Informations de l'utilisateur connecté
  const navigate = useNavigate(); // Hook pour la navigation
  const pondRef = useRef(null); // Ref for FilePond instance

  // Fonction pour gérer les changements dans le champ de recherche
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedManager(null); // Réinitialiser la sélection
    setMessage(""); // Réinitialiser le message

    // Si le champ est vide, masquer la liste
    if (value === "") {
      setTeamManagers([]);
    }
  };

  // Fonction pour sélectionner un Team Manager
  const handleSelectManager = (manager) => {
    setSelectedManager(manager);
    setSearchTerm(`${manager.firstName} ${manager.lastName}`); // Mettre à jour le champ de texte avec le nom sélectionné
    setTeamManagers([]); // Masquer la liste déroulante après la sélection
  };

  // Fonction pour rechercher les Team Managers
  const searchTeamManagers = async (term) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/getTeamManager?search=${term}`);
      console.log("API Response:", response.data); // Log pour déboguer
      const data = Array.isArray(response.data) ? response.data : [];
      setTeamManagers(data);
    } catch (error) {
      console.error("Error fetching team managers:", error);
      setTeamManagers([]); // Réinitialiser à un tableau vide en cas d'erreur
    }
  };

  // Fonction pour vérifier si un Team Manager peut être affecté à un projet
  const checkTeamManagerProjects = async (managerId) => {
    try {
      const response = await axios.get(`http://localhost:3000/project/checkTeamManagerProjects/${managerId}`);
      setMessage(response.data.message);

      // Définir la couleur du message en fonction de la disponibilité du Team Manager
      if (response.data.message.includes("Vous pouvez affecter")) {
        setMessageColor("#28a745"); // Message en vert si disponible
      } else {
        setMessageColor("#dc3545"); // Message en rouge si non disponible
      }
    } catch (error) {
      console.error("Error checking team manager projects:", error);
      setMessage("Une erreur s'est produite");
      setMessageColor("#dc3545"); // Message en rouge en cas d'erreur
    }
  };

  // Effet pour initialiser flatpickr, Choices, et Quill
  useEffect(() => {
    // Initialize flatpickr for date pickers
    flatpickr("#startDate", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
    });

    flatpickr("#endDate", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
    });

    // Initialize Choices for multi-select
    const assignedTeamMembers = document.querySelector('#assigned-team-members');
    if (assignedTeamMembers) {
      new Choices(assignedTeamMembers, {
        allowHTML: true,
        removeItemButton: true,
      });
    }

    // Initialize Quill editor
    const toolbarOptions = [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['image', 'video'],
      ['clean']
    ];

    const quill = new Quill('#project-descriptioin-editor', {
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });

    // Initialize Choices for unique values input
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

  // Effet pour récupérer les informations de l'utilisateur
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 secondes de timeout

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.data) {
          setUser(response.data);
        } else {
          navigate("/auth");
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth");
        }
      } finally {
        clearTimeout(timeout); // Annule le timeout si la requête réussit
        setLoading(false);
      }
    };

    fetchUserInfo();

    return () => clearTimeout(timeout); // Nettoie le timeout si le composant est démonté
  }, [navigate]);

  // Effet pour rechercher dynamiquement les Team Managers avec debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchTeamManagers(searchTerm);
      } else {
        setTeamManagers([]); // Réinitialiser la liste si le champ est vide
      }
    }, 300); // Délai de 300 ms

    return () => clearTimeout(delayDebounceFn); // Nettoie le timeout si le composant est démonté ou si searchTerm change
  }, [searchTerm]);

  // Effet pour vérifier les projets du Team Manager sélectionné
  useEffect(() => {
    if (selectedManager) {
      checkTeamManagerProjects(selectedManager._id);
    }
  }, [selectedManager]);

  // Afficher un message de chargement si nécessaire
  if (loading) {
    return <div>Chargement en cours...</div>;
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
                Create Project
              </li>
            </ol>
          </nav>
          <h1 className="page-title fw-medium fs-18 mb-0">Create Project</h1>
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
              <div className="card-title">Create Project</div>
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
                    id="input-label"
                    placeholder="Enter Project Name"
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
                    onChange={handleInputChange} // Utiliser la fonction handleInputChange
                    style={{
                      backgroundColor: "var(--background-color)",
                      color: "var(--text-color)",
                    }}
                  />

                  {/* Liste déroulante des résultats de recherche */}
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

                  {/* Message dynamique */}
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
                    id="input-label1"
                    placeholder="Enter Client Name"
                  />
                </div>
                <div className="col-xl-12">
                  <label className="form-label">Project Description :</label>
                  <div id="project-descriptioin-editor">
                    <p>
                      lorem Contrary to popular belief, Lorem Ipsum is not
                      simply random text. It has roots in a piece of classical
                      Latin literature from 45 BC, making it over 2000 years
                      old. Richard McClintock, a Latin professor at
                      Hampden-Sydney College in Virginia, looked up one of the
                      more obscure Latin words, consectetur, from a Lorem
                      Ipsum passage, and going through the cites of the word
                      in classical literature, discovered the undoubtable
                      source. Lorem Ipsum comes from sections 1.10.32 and
                      1.10.33.
                    </p>
                    <p>
                      <br />
                    </p>
                    <ol>
                      <li className="ql-size-normal">
                        Ensure data security and compliance with relevant
                        regulations.
                      </li>
                      <li className="">
                        Train staff on the enhanced system within two weeks of
                        deployment.
                      </li>
                      <li className="">
                        Implement a scalable solution to accommodate future
                        growth.
                      </li>
                      <li className="">
                        Decrease the time required for inventory audits by
                        50%.
                      </li>
                      <li className="">
                        Achieve a 10% reduction in excess inventory costs.
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Start Date :</label>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-text text-muted">
                        <i className="ri-calendar-line" />
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        id="startDate"
                        placeholder="Choose date and time"
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
                        type="text"
                        className="form-control"
                        id="endDate"
                        placeholder="Choose date and time"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Status :</label>
                  <select
                    className="form-control"
                    data-trigger=""
                    name="choices-single-default1"
                    id="choices-single-default1"
                  >
                    <option value="Inprogress" selected="">
                      Inprogress
                    </option>
                    <option value="On-hold">On-hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Priority :</label>
                  <select
                    className="form-control"
                    data-trigger=""
                    name="choices-single-default"
                    id="choices-single-default"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Assigned To</label>
                  <select
                    className="form-control"
                    name="assigned-team-members"
                    id="assigned-team-members"
                    multiple=""
                  >
                    <option value="Choice 1" selected="">
                      Angelina May
                    </option>
                    <option value="Choice 2">Sarah Ruth</option>
                    <option value="Choice 3">Hercules Jhon</option>
                    <option value="Choice 4">Mayor Kim</option>
                    <option value="Choice 4" selected="">
                      Alexa Biss
                    </option>
                    <option value="Choice 4">Karley Dia</option>
                    <option value="Choice 4">Kim Jong</option>
                    <option value="Choice 4">Darren Sami</option>
                    <option value="Choice 4">Elizabeth</option>
                    <option value="Choice 4">Bear Gills</option>
                    <option value="Choice 4" selected="">
                      Phillip John
                    </option>
                  </select>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Tags</label>
                  <input
                    className="form-control"
                    id="choices-text-unique-values"
                    type="text"
                    defaultValue="Marketing, Sales, Development, Design, Research"
                    placeholder="This is a placeholder"
                  />
                </div>
                <div className="col-xl-12">
                  <label className="form-label">Attachments</label>
                  <FilePond
                    ref={pondRef}
                    allowMultiple={true}
                    maxFiles={6}
                    maxFileSize="3MB"
                    name="filepond"
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                  />
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-primary-light btn-wave ms-auto float-end">
                Create Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}