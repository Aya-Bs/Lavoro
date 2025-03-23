import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ArchiveOverview() {
  const { id } = useParams(); // Get the project ID from the URL
  const [archive, setArchive] = useState(null); // State for archive details
  const [history, setHistory] = useState([]); // State for project history
  const [loading, setLoading] = useState(true); // State for loading status

  // Fetch archive details
  const fetchArchiveDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/project/archived-projects/${id}`);
      const data = await response.json();
      if (response.ok) {
        setArchive(data); // Set archive details
      } else {
        Swal.fire('Error!', data.message || 'Failed to fetch archive details.', 'error');
      }
    } catch (error) {
      console.error('Error fetching archive details:', error);
      Swal.fire('Error!', 'An error occurred while fetching archive details.', 'error');
    }
  };

  // Fetch project history
  const fetchProjectHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3000/project/${id}/history`);
      const data = await response.json();
      if (response.ok) {
        setHistory(data); // Set project history
      } else {
        Swal.fire('Error!', data.message || 'Failed to fetch project history.', 'error');
      }
    } catch (error) {
      console.error('Error fetching project history:', error);
      Swal.fire('Error!', 'An error occurred while fetching project history.', 'error');
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchArchiveDetails(); // Fetch archive details
        await fetchProjectHistory(); // Fetch project history
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Display loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display error if archive is not found
  if (!archive) {
    return <div>Archive not found.</div>;
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
              <li className="breadcrumb-item">
                <a href="/archieve" >
                  Projects Archive
                </a>
              </li>
              <span className="mx-1">→</span>
              <li className="breadcrumb-item active" aria-current="page">
                Archived Project Overview
              </li>
            </ol>
          </nav>
          <br />
          <h1 className="page-title fw-medium fs-18 mb-0">Archived Project Overview</h1>
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

      {/* Project Details */}
      <div className="row">
        <div className="col-xxl-8">
          <div className="card custom-card">
            <div className="card-header justify-content-between">
              <div className="card-title">Archived Project Details</div>
              <div>
                <a href="javascript:void(0);" className="btn btn-sm btn-primary btn-wave">
                  <i className="ri-trash-line align-middle me-1 fw-medium" />
                  Delete
                </a>
                <a href="javascript:void(0);" className="btn btn-sm btn-primary1 btn-wave">
                  <i className="ri-inbox-unarchive-line align-middle fw-medium me-1" />
                  Unarchive
                </a>
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-4 gap-2 flex-wrap">
                <span className="avatar avatar-lg me-1 bg-primary-gradient">
                  <i className="ri-stack-line fs-24 lh-1" />
                </span>
                <div>
                  <h6 className="fw-medium mb-2 task-title">{archive.name}</h6>
                  <span className="badge bg-info-transparent">
                    {archive.status}
                  </span>
                  <span className="text-muted fs-12">
                    <i className="ri-circle-fill text-success mx-2 fs-9" />
                    Last Updated: {new Date(archive.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="fs-15 fw-medium mb-2">Project Description:</div>
              <p className="text-muted mb-4">{archive.description}</p>
              <div className="d-flex gap-5 mb-4 flex-wrap">
                <div className="d-flex align-items-center gap-2 me-3">
                  <span className="avatar avatar-md avatar-rounded me-1 bg-primary1-transparent">
                    <i className="ri-calendar-event-line fs-18 lh-1 align-middle" />
                  </span>
                  <div>
                    <div className="fw-medium mb-0 task-title">Start Date</div>
                    <span className="fs-12 text-muted">{new Date(archive.start_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 me-3">
                  <span className="avatar avatar-md avatar-rounded me-1 bg-primary2-transparent">
                    <i className="ri-time-line fs-18 lh-1 align-middle" />
                  </span>
                  <div>
                    <div className="fw-medium mb-0 task-title">End Date</div>
                    <span className="fs-12 text-muted">{new Date(archive.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project History */}
        <div className="col-xxl-4">
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">Project History</div>
            </div>
            <div className="card-body">
              {history.length > 0 ? (
                <ul className="list-unstyled">
                  {history.map((entry, index) => (
                    <li key={index} className="mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="avatar avatar-sm bg-primary-transparent">
                          <i className="ri-history-line fs-14" />
                        </span>
                        <div>
                          <div className="fw-medium">{entry.change_type}</div>
                          <div className="text-muted fs-12">
                            {new Date(entry.changed_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted">No history available.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}