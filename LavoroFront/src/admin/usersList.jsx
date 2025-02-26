import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UsersList({ onRoleUpdate, onViewActivity }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);

  // Fetch users and roles on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/dashboard', {
          withCredentials: true, // Include cookies
        });
        setUsers(response.data.users);
        setRoles(response.data.roles);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Error fetching admin dashboard data:', err);
      }
    };

    fetchData();
  }, []);

  // Handle role update for a user
  const handleRoleUpdate = async (userId, roleId) => {
    try {
      await axios.post(
        `http://localhost:3000/admin/update-role/${userId}`,
        { role: roleId },
        { withCredentials: true }
      );

      // Update the local state to reflect the role change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: roles.find((role) => role._id === roleId) } : user
        )
      );

      alert('Role updated successfully!');
    } catch (err) {
      setError('Failed to update role. Please try again.');
      console.error('Error updating role:', err);
    }
  };

  return (
    <div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((user) => (
          <li
            key={user._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              padding: '10px',
            }}
          >
            <img
              src={user.image || 'https://via.placeholder.com/50'}
              alt="Avatar"
              style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
            />
            <div style={{ flex: 1 }}>
              <p>
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role?.RoleName}
              </p>
            </div>
            <div>
              <select
                value={user.role?._id}
                onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                style={{
                  padding: '5px',
                  marginRight: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                }}
              >
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.RoleName}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleRoleUpdate(user._id, user.role?._id)}
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
                Update Role
              </button>
              <button
                onClick={() => onViewActivity(user._id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                View Activity
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;