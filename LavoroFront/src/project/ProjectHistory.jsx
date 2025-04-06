import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get the project ID from the URL

export default function ProjectHistory() {
  const { projectId } = useParams(); // Get the project ID from the URL
  const [history, setHistory] = useState([]);
  const [projectName, setProjectName] = useState(''); // State to store the project name

  useEffect(() => {
    // Fetch the project history using the project ID

    fetch(`http://localhost:3000/project/${projectId}/history`)
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data); // Log the API response
        if (Array.isArray(data)) { // Ensure data is an array
          setHistory(data);
        } else {
          console.error('API did not return an array:', data);
          setHistory([]); // Set history to an empty array if the response is invalid
        }
      })
      .catch(error => console.error('Error fetching project history:', error));

    // Fetch the project details using the project ID

    fetch(`http://localhost:3000/project/${projectId}`)
      .then(response => response.json())
      .then(data => {
        console.log('Project Details:', data); // Log the project details
        setProjectName(data.name); // Set the project name
      })
      .catch(error => console.error('Error fetching project details:', error));
  }, [projectId]);

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


               <li className="breadcrumb-item">
                <a href="/listPro" >
                Projects List
                </a>
              </li>
              <span className="mx-1">→</span>
              <li className="breadcrumb-item active" aria-current="page">
              Project History
              </li>
            </ol>
          </nav>
          <br />
          <h1 className="page-title fw-medium fs-18 mb-0">Project History </h1>
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
      {/* Page Header Close */}
      {/* Start:: row-1 */}
      <div className="row justify-content-center">
        <div className="col-xxl-11">
          <div className="card custom-card border overflow-hidden">
            <div className="card-header">
              <div className="card-title">
                {projectName ? `${projectName} Timeline` : 'Timeline 01'} {/* Display project name if available */}
              </div>
            </div>
            <div className="card-body bg-light bg-opacity-75">
              <div className="timeline container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="timeline-container">
                      {Array.isArray(history) && history.length > 0 ? ( // Check if history is an array and not empty
                        history.map((entry, index) => (
                          <div key={index}>
                            <div className="timeline-end">
                              <span className="p-1 fs-11 bg-primary2 text-fixed-white backdrop-blur text-center border border-primary2 border-opacity-10 rounded-1 lh-1 fw-medium">
                                {new Date(entry.changed_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="timeline-continue">
                              <div className="timeline-right">
                                <div className="timeline-content">
                                  <p className="timeline-date text-muted mb-2">
                                    {new Date(entry.changed_at).toLocaleTimeString()}
                                  </p>
                                  <div className="timeline-box">
                                    <p className="mb-2">
                                      <b>Change Type:</b> {entry.change_type}
                                    </p>
                                    <p className="mb-2">
                                      <b>Old Value:</b> {entry.old_value}
                                    </p>
                                    <p className="mb-2">
                                      <b>New Value:</b> {entry.new_value}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No history available for this project.</p> // Display a message if history is empty or invalid
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}