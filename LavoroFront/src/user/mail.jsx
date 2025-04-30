import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Offcanvas } from 'react-bootstrap';

const Mail = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get('http://localhost:3000/project/emails');
      const data = response.data;
      if (Array.isArray(data)) {
        setEmails(data);
      } else {
        console.error('Expected an array but got:', data);
        setEmails([]);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const handleEmailClick = async (emailId) => {
    try {
      const response = await axios.get(`http://localhost:3000/project/emails/${emailId}`);
      setSelectedEmail(response.data);
      setShowOffcanvas(true);
    } catch (error) {
      console.error('Error fetching email details:', error);
    }
  };

  const formatEmailDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-TN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const extractEmailAddress = (emailString) => {
    const matches = emailString.match(/<([^>]+)>/);
    return matches ? matches[1] : emailString;
  };

  const formatEmailText = (text) => {
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-2">
        {paragraph.trim() === '' ? <br /> : paragraph}
      </p>
    ));
  };

  return (
    <>
    
          

    <br />
            <div className="main-mail-container mb-2 gap-2 d-flex">
              <div className="mail-navigation border">
                <div className="d-grid align-items-top p-3 border-bottom border-block-end-dashed">
                  <button
                    className="btn btn-primary d-flex align-items-center justify-content-center"
                    data-bs-toggle="modal"
                    data-bs-target="#mail-Compose"
                  >
                    <i className="ri-add-circle-line fs-16 align-middle me-1" />
                    Compose Mail
                  </button>
                </div>
                <div>
                  <ul className="list-unstyled mail-main-nav" id="mail-main-nav">
                    <li className="px-0 pt-0">
                      <span className="fs-11 text-muted op-7 fw-medium">
                        MAILS
                      </span>
                    </li>
                    <li className="active mail-type">
                      <a href="javascript:void(0);">
                        <div className="d-flex align-items-center">
                          <span className="me-2 lh-1">
                            <i className="ti ti-mail align-middle fs-16" />
                          </span>
                          <span className="flex-fill text-nowrap">All Mails</span>
                          <span className="badge bg-primary1 rounded-pill">
                            {emails.length}
                          </span>
                        </div>
                      </a>
                    </li>
                    <li className="mail-type">
                      <a href="javascript:void(0);">
                        <div className="d-flex align-items-center">
                          <span className="me-2 lh-1">
                            <i className="ti ti-inbox align-middle fs-16" />
                          </span>
                          <span className="flex-fill text-nowrap">Inbox</span>
                          <span className="badge bg-primary2 rounded-pill">
                            {emails.filter(e => !e.isRead).length}
                          </span>
                        </div>
                      </a>
                    </li>
                    <li className="mail-type">
                      <a href="javascript:void(0);">
                        <div className="d-flex align-items-center">
                          <span className="me-2 lh-1">
                            <i className="ti ti-send align-middle fs-16" />
                          </span>
                          <span className="flex-fill text-nowrap">Sent</span>
                        </div>
                      </a>
                    </li>
                    <li className="mail-type">
                      <a href="javascript:void(0);">
                        <div className="d-flex align-items-center">
                          <span className="me-2 lh-1">
                            <i className="ti ti-notes align-middle fs-16" />
                          </span>
                          <span className="flex-fill text-nowrap">Drafts</span>
                        </div>
                      </a>
                    </li>
                    <li className="mail-type">
                      <a href="javascript:void(0);">
                        <div className="d-flex align-items-center">
                          <span className="me-2 lh-1">
                            <i className="ti ti-alert-circle align-middle fs-16" />
                          </span>
                          <span className="flex-fill text-nowrap">Spam</span>
                        </div>
                      </a>
                    </li>
                    <li className="mail-type">
                      <a href="javascript:void(0);">
                        <div className="d-flex align-items-center">
                          <span className="me-2 lh-1">
                            <i className="ti ti-archive align-middle fs-16" />
                          </span>
                          <span className="flex-fill text-nowrap">Archive</span>
                        </div>
                      </a>
                    </li>
                    <li className="mail-type">
                      <a href="javascript:void(0);">
                        <div className="d-flex align-items-center">
                          <span className="me-2 lh-1">
                            <i className="ti ti-bookmark align-middle fs-16" />
                          </span>
                          <span className="flex-fill text-nowrap">Important</span>
                        </div>
                      </a>
                    </li>
                    <li className="mail-type">
                      <a href="javascript:void(0);">
                        <div className="d-flex align-items-center">
                          <span className="me-2 lh-1">
                            <i className="ti ti-trash align-middle fs-16" />
                          </span>
                          <span className="flex-fill text-nowrap">Trash</span>
                        </div>
                      </a>
                    </li>
                    <li className="mail-type">
                      <a href="javascript:void(0);">
                        <div className="d-flex align-items-center">
                          <span className="me-2 lh-1">
                            <i className="ti ti-star align-middle fs-16" />
                          </span>
                          <span className="flex-fill text-nowrap">Starred</span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="total-mails border">
                <div className="p-3 d-flex align-items-center border-bottom border-block-end-dashed flex-wrap gap-2">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control shadow-none"
                      placeholder="Search Email"
                      aria-describedby="button-addon"
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      id="button-addon"
                    >
                      <i className="ri-search-line me-1" /> Search
                    </button>
                  </div>
                </div>
                <div className="px-3 p-2 d-flex align-items-center border-bottom flex-wrap gap-2">
                  <div className="me-3">
                    <input
                      className="form-check-input check-all"
                      type="checkbox"
                      id="checkAll"
                      defaultValue=""
                      aria-label="..."
                    />
                  </div>
                  <div className="flex-fill">
                    <h6 className="fw-medium mb-0">All Mails</h6>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-icon btn-light me-1 d-lg-none d-block total-mails-close btn-sm">
                      <i className="ri-close-line" />
                    </button>
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-primary1-light btn-wave"
                        type="button"
                        aria-expanded="false"
                      >
                        <i className="ri-inbox-archive-line me-1" /> Archive
                      </button>
                      <button
                        className="btn btn-sm btn-primary2-light btn-wave"
                        type="button"
                        aria-expanded="false"
                      >
                        <i className="ri-error-warning-line me-1" /> Spam
                      </button>
                      <button
                        className="btn btn-sm btn-icon btn-primary3-light btn-wave"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <a className="dropdown-item" href="javascript:void(0);">
                            Recent
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="javascript:void(0);">
                            Unread
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="javascript:void(0);">
                            Mark All Read
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="javascript:void(0);">
                            Delete All
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mail-messages" id="mail-messages">
                  <ul className="list-unstyled mb-0 mail-messages-container">
                    {emails.map(email => (
                      <li 
                        key={email._id} 
                        className={selectedEmail?._id === email._id ? 'active' : ''}
                        onClick={() => handleEmailClick(email._id)}
                      >
                        <div className="d-flex align-items-top">
                          <div className="me-3 mt-1">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`checkbox-${email._id}`}
                            />
                          </div>
                          <div className="flex-fill text-truncate">
                            <p className="mb-1 fs-12 fw-medium">
                              {email.from.split('<')[0].trim()}{' '}
                              {!email.isRead && <span className="badge bg-primary rounded-pill">New</span>}
                              <span className="float-end text-muted fw-normal fs-11">
                                {formatEmailDate(email.createdAt)}
                              </span>
                            </p>
                            <div className="mail-msg mb-0">
                              <span className="d-block mb-0 fw-medium text-truncate w-75">
                                {email.subject}
                              </span>
                              <div className="fs-12 text-muted w-75 text-truncate mail-msg-content">
                                {email.text.substring(0, 100)}...
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
          

        {/* Email Details Offcanvas using React-Bootstrap */}
        <Offcanvas 
          show={showOffcanvas} 
          onHide={() => setShowOffcanvas(false)} 
          placement="end"
          className="mail-info-offcanvas"
        >
          <Offcanvas.Body className="p-0">
            {selectedEmail && (
              <div className="mails-information">
                <div className="mail-info-header d-flex flex-wrap gap-2 align-items-center">
                  <span className="avatar avatar-md me-2 avatar-rounded mail-msg-avatar me-1">
                    {selectedEmail.from.charAt(0).toUpperCase()}
                  </span>
                  <div className="flex-fill">
                    <h6 className="mb-0 fw-medium">{selectedEmail.from.split('<')[0].trim()}</h6>
                    <span className="text-muted fs-11">{extractEmailAddress(selectedEmail.from)}</span>
                  </div>
                  <div className="mail-action-icons">
                    <button className="btn btn-icon btn-outline-light border" data-bs-toggle="tooltip" data-bs-placement="top" title="Starred">
                      <i className="ri-star-line"></i>
                    </button>
                    <button className="btn btn-icon btn-outline-light border ms-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Archive">
                      <i className="ri-inbox-archive-line"></i>
                    </button>
                    <button className="btn btn-icon btn-outline-light border ms-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Report spam">
                      <i className="ri-spam-2-line"></i>
                    </button>
                    <button className="btn btn-icon btn-outline-light border ms-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">
                      <i className="ri-delete-bin-line"></i>
                    </button>
                    <button className="btn btn-icon btn-outline-light border ms-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Reply">
                      <i className="ri-reply-line"></i>
                    </button>
                    <button 
                      type="button" 
                      className="btn-close btn btn-sm btn-icon border" 
                      onClick={() => setShowOffcanvas(false)}
                      aria-label="Close"
                    ></button>
                  </div>
                </div>
                
                <div className="mail-info-body p-3" id="mail-info-body">
                  <div className="d-sm-flex d-block align-items-center justify-content-between mb-3">
                    <div>
                      <p className="fs-20 fw-medium mb-0">{selectedEmail.subject}</p>
                    </div>
                    <div className="float-end">
                      <span className="fs-12 text-muted">
                        {formatEmailDate(selectedEmail.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="main-mail-content mb-3">
                    {formatEmailText(selectedEmail.text)}
                    
                    
                  </div>
                  
              
                </div>
                
                <div className="mail-info-footer d-flex flex-wrap gap-2 align-items-center justify-content-between p-3 border-top">
                  <div>
                    <button className="btn btn-icon btn-primary-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Print">
                      <i className="ri-printer-line"></i>
                    </button>
                    <button className="btn btn-icon btn-secondary-light ms-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Mark as read">
                      <i className="ri-mail-open-line"></i>
                    </button>
                    <button className="btn btn-icon btn-success-light ms-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Reload">
                      <i className="ri-refresh-line"></i>
                    </button>
                  </div>
                  <div>
                    <button className="btn btn-secondary">
                      <i className="ri-share-forward-line me-1 d-inline-block align-middle"></i>Forward
                    </button>
                    <button className="btn btn-primary ms-1">
                      <i className="ri-reply-all-line me-1 d-inline-block align-middle"></i>Reply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Offcanvas.Body>
        </Offcanvas>

        {/* Compose Mail Modal */}
        <div className="modal modal-lg fade" id="mail-Compose" tabIndex={-1} aria-labelledby="mail-ComposeLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title" id="mail-ComposeLabel">Compose Mail</h6>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-xl-6 mb-2">
                    <label htmlFor="fromMail" className="form-label">
                      From
                      <sup>
                        <i className="ri-star-s-fill text-success fs-8" />
                      </sup>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="fromMail"
                      defaultValue="user@example.com"
                    />
                  </div>
                  <div className="col-xl-6 mb-2">
                    <label htmlFor="toMail" className="form-label">
                      To
                      <sup>
                        <i className="ri-star-s-fill text-success fs-8" />
                      </sup>
                    </label>
                    <select
                      className="form-control"
                      name="toMail"
                      id="toMail"
                      multiple=""
                    >
                      <option value="Choice 1" selected="">
                        recipient1@example.com
                      </option>
                      <option value="Choice 2">recipient2@example.com</option>
                    </select>
                  </div>
                  <div className="col-xl-6 mb-2">
                    <label
                      htmlFor="mailCC"
                      className="form-label text-dark fw-medium"
                    >
                      Cc
                    </label>
                    <input type="email" className="form-control" id="mailCC" />
                  </div>
                  <div className="col-xl-6 mb-2">
                    <label
                      htmlFor="mailBcc"
                      className="form-label text-dark fw-medium"
                    >
                      Bcc
                    </label>
                    <input type="email" className="form-control" id="mailBcc" />
                  </div>
                  <div className="col-xl-12 mb-2">
                    <label htmlFor="Subject" className="form-label">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Subject"
                      placeholder="Subject"
                    />
                  </div>
                  <div className="col-xl-12">
                    <label className="col-form-label">Content :</label>
                    <div className="mail-compose">
                      <textarea className="form-control" rows="10" placeholder="Write your email content here..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-primary">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mail;