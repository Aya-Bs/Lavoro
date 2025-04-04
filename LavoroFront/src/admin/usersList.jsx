import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UsersList({ onRoleUpdate, onViewActivity }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // For filtered results
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(''); // To track the selected role filter
  const [searchQuery, setSearchQuery] = useState(''); // To track the search query

  // Fetch users and roles on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/dashboard', {
          withCredentials: true, // Include cookies
        });
        setUsers(response.data.users);
        setFilteredUsers(response.data.users); // Initialize filtered users
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
      setFilteredUsers((prevUsers) =>
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

  // Handle sending email to a user
  const handleSendEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  // Handle role filter change
  const handleRoleFilterChange = (roleId) => {
    setSelectedRole(roleId);

    if (roleId === '') {
      // If no role is selected, show all users
      applyFilters(users, searchQuery);
    } else {
      // Filter users by the selected role
      const filtered = users.filter((user) => user.role?._id === roleId);
      applyFilters(filtered, searchQuery);
    }
  };

  // Handle creation date filter change
  const handleCreationDateFilterChange = (filterType) => {
    let sortedUsers = [...users];

    switch (filterType) {
      case 'newest':
        // Sort users by creation date (newest first)
        sortedUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        // Sort users by creation date (oldest first)
        sortedUsers.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        // No sorting (default order)
        sortedUsers = [...users];
        break;
    }

    applyFilters(sortedUsers, searchQuery);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(users, query);
  };

  // Apply filters (role, search query, etc.)
  const applyFilters = (userList, query) => {
    let filtered = userList;

    // Apply role filter
    if (selectedRole) {
      filtered = filtered.filter((user) => user.role?._id === selectedRole);
    }

    // Apply search query filter
    if (query) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(query.toLowerCase()) ||
          user.lastName.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) 
      );
    }

    setFilteredUsers(filtered);
  };

  return (
    <div className="card custom-card">
      <div className="card-header justify-content-between">
        <div className="card-title">Users List</div>
        <div className="d-flex flex-wrap">
          {/* Search Bar */}
          <div className="me-3 my-1">
            <input
              className="form-control form-control-sm"
              type="text"
              placeholder="Search by name, email, or phone"
              aria-label="search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          {/* Sort By Creation Date */}
          <div className="dropdown my-1">
            <a
              href="#"
              className="btn btn-sm btn-primary"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sort By<i className="ri-arrow-down-s-line align-middle ms-1"></i>
            </a>
            <ul className="dropdown-menu" role="menu">
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => handleCreationDateFilterChange('newest')}
                >
                  Newest
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => handleCreationDateFilterChange('oldest')}
                >
                  Oldest
                </a>
              </li>
            </ul>
          </div>
          {/* Filter By Role */}
          <div className="dropdown my-1">
            <a
              href="#"
              className="btn btn-sm btn-primary"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Filter By Role<i className="ri-arrow-down-s-line align-middle ms-1"></i>
            </a>
            <ul className="dropdown-menu" role="menu">
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => handleRoleFilterChange('')}
                >
                  All Roles
                </a>
              </li>
              {roles.map((role) => (
                <li key={role._id}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => handleRoleFilterChange(role._id)}
                  >
                    {role.RoleName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="card-body">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="table-responsive">
          <table className="table table-hover text-nowrap table-bordered">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={user.image || 'https://via.placeholder.com/50'}
                        className="avatar avatar-sm me-2"
                        alt={user.firstName}
                      />
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>{user.phone_number || 'N/A'}</td>
                  <td>
                    <select
                      value={user.role?._id}
                      onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                      className="form-select form-select-sm"
                    >
                      {roles.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.RoleName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="btn-list">
                      {/* View Activity Button */}
                      <button
                        type="button"
                        className="btn btn-icon btn-sm btn-primary-light"
                        onClick={() => onViewActivity(user._id)}
                        title="View Activity"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                      {/* Mail Button */}
                      <button
                        type="button"
                        className="btn btn-icon btn-sm btn-success-light ms-2"
                        onClick={() => handleSendEmail(user.email)}
                        title="Send Email"
                      >
                        <i className="ri-mail-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer">
        <div className="d-flex align-items-center">
          <div>
            Showing {filteredUsers.length} Entries{' '}
            <i className="bi bi-arrow-right ms-2 fw-medium"></i>
          </div>
          <div className="ms-auto">
            <nav aria-label="Page navigation" className="pagination-style-4">
              <ul className="pagination mb-0">
                <li className="page-item disabled">
                  <a className="page-link" href="#">
                    Prev
                  </a>
                </li>
                <li className="page-item active">
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link text-primary" href="#">
                    next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersList;