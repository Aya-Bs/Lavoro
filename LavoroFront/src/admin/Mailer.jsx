import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Mailer = ({ show, handleClose, adminEmail }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/all-users');
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        Swal.fire('Error', 'Failed to load recipients', 'error');
      }
    };

    if (show) {
      fetchUsers();
    }
  }, [show]);

  const handleUserSelect = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedUsers(selected);
  };

  const handleSelectAll = () => {
    setSelectedUsers(users.map(user => user.email));
  };

  const handleSendMail = async () => {
    if (!selectedUsers.length) {
      Swal.fire('Error', 'Please select at least one recipient', 'error');
      return;
    }

    if (!subject.trim()) {
      Swal.fire('Error', 'Please enter a subject', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/admin/send', {
        to: selectedUsers,
        subject,
        content
      });

      if (response.data.success) {
        Swal.fire('Success', `Email sent to ${response.data.count} recipients`, 'success');
        handleClose();
      }
    } catch (error) {
      console.error('Error sending email:', error);
      const errorMsg = error.response?.data?.message || 'Failed to send email';
      Swal.fire('Error', errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Compose Mail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-xl-6 mb-3">
            <label htmlFor="fromMail" className="form-label">
              From<sup><i className="ri-star-s-fill text-success fs-8"></i></sup>
            </label>
            <input 
              type="email" 
              className="form-control" 
              id="fromMail" 
              value={adminEmail} 
              readOnly 
            />
          </div>
          <div className="col-xl-6 mb-3">
            <label htmlFor="toMail" className="form-label">
              To<sup><i className="ri-star-s-fill text-success fs-8"></i></sup>
            </label>
            <div className="d-flex gap-2 mb-2">
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={handleSelectAll}
              >
                Select All
              </button>
            </div>
            <select 
              className="form-control" 
              id="toMail" 
              multiple
              size="4"
              onChange={handleUserSelect}
              value={selectedUsers}
            >
              {users.map(user => (
                <option key={user._id} value={user.email}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div className="col-xl-12 mb-3">
            <label htmlFor="subject" className="form-label">
              Subject
            </label>
            <input 
              type="text" 
              className="form-control" 
              id="subject" 
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="col-xl-12">
            <label className="form-label">Content:</label>
            <div className="mail-compose">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent}
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
                  ]
                }}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSendMail}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Mailer;