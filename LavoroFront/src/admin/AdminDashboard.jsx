import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UsersList from './usersList';
<<<<<<< HEAD

function AdminDashboard() {
  const navigate = useNavigate();
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [error, setError] = useState(null);

  // Fetch pending deletion requests
  useEffect(() => {
    const fetchDeleteRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/delete-requests', {
          withCredentials: true,
        });
        setDeleteRequests(response.data);
      } catch (err) {
        setError('Failed to fetch delete requests.');
        console.error('Error fetching delete requests:', err);
      }
    };

    fetchDeleteRequests();
  }, []);

  // Handle delete request action (approve/reject)
  const handleDeleteRequestAction = async (notificationId, action) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/admin/handle-delete-request',
        { notificationId, action },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Update the state to reflect the change
        setDeleteRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== notificationId)
        );
        alert(`Request ${action}d successfully.`);
      }
    } catch (err) {
      console.error('Error handling delete request:', err);
      alert('Failed to handle delete request.');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/users/logout', {}, { withCredentials: true });
      navigate('/auth');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div
      style={{
        height: '100vh', // Full height of the screen
        display: 'flex',
        flexDirection: 'column', // Stack sections vertically
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Scrollable Container for All Content */}
      <div
        style={{
          flex: 1, // Take up remaining space
          overflowY: 'auto', // Enable vertical scrolling
          padding: '20px',
        }}
      >
        <h1>Admin Dashboard</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Pending Deletion Requests Section */}
        <h2>Pending Deletion Requests</h2>
        {deleteRequests.length > 0 ? (
          deleteRequests.map((request) => (
            <div
              key={request._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: '#fff',
              }}
            >
              <div style={{ marginLeft: '10px' }}>
                <p>
                  <strong>User:</strong> {request.triggered_by.firstName} {request.triggered_by.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {request.triggered_by.email}
                </p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <button
                  onClick={() => handleDeleteRequestAction(request._id, 'approve')}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '10px',
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDeleteRequestAction(request._id, 'reject')}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending deletion requests.</p>
        )}

        {/* Users List Section */}
        <h2>Users List</h2>
        <UsersList onViewActivity={(userId) => navigate(`/user-activity/${userId}`)} />
      </div>

      {/* Logout Button (Fixed at the Bottom) */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#fff', // Optional: Add background color
          borderTop: '1px solid #ddd', // Optional: Add a border
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            borderRadius: '20px',
            border: '1px solid #FF4B2B',
            backgroundColor: '#FF4B2B',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 'bold',
            padding: '12px 45px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            transition: 'transform 80ms ease-in',
            cursor: 'pointer',
          }}
          onMouseDown={(e) => (e.target.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Log Out
        </button>
      </div>
=======
import DeleteRequests from './deleteRequests';
function AdminDashboard() {
  const navigate = useNavigate();

  // Handle logout
  
  return (
    <div className="container-fluid">
      <div className="col-xl-12">
        <div className="card custom-card main-dashboard-banner overflow-hidden">
          <div className="card-body p-4">
            <div className="row justify-content-between">
              <div className="col-xxl-7 col-xl-5 col-lg-5 col-md-5 col-sm-5">
                <h4 className="mb-3 fw-medium text-fixed-white">Welcome, Admin!</h4>
                <p className="mb-4 text-fixed-white">Here's an overview of your dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pending Requests Section */}
      <DeleteRequests />

      {/* Users List Section */}
      <UsersList onViewActivity={(userId) => navigate(`/user-activity/${userId}`)} />

      {/* Logout Button */}
      
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
    </div>
  );
}

export default AdminDashboard;