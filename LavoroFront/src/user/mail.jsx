import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Mail = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  

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
    } catch (error) {
      console.error('Error fetching email details:', error);
    }
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
                            2,142
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
                            12
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
                          <span className="badge bg-primary3 rounded-pill">
                            6
                          </span>
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
                          <span className="badge bg-warning rounded-pill">
                            05
                          </span>
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
                        {email.from}{' '}
                        <span className="float-end text-muted fw-normal fs-11">
                          {new Date(email.createdAt).toLocaleTimeString()}
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
              {selectedEmail && (
          <div className="mail-recepients border">
            <div className="p-3 border-bottom">
              <h5>{selectedEmail.subject}</h5>
              <p className="text-muted">
                From: {selectedEmail.from} | To: {selectedEmail.to}
              </p>
            </div>
            <div className="p-3">
              <div className="mail-info-body">
                <div dangerouslySetInnerHTML={{ __html: selectedEmail.text.replace(/\n/g, '<br>') }} />
              </div>
              {selectedEmail.relatedProject && (
                <div className="mt-3">
                  <p className="fw-bold">Related Project:</p>
                  <p>{selectedEmail.relatedProject.name}</p>
                </div>
              )}
            </div>
          </div>
        )}              
        </div>
       



















        <div
          className="modal modal-lg fade"
          id="mail-Compose"
          tabIndex={-1}
          aria-labelledby="mail-ComposeLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title" id="mail-ComposeLabel">
                  Compose Mail
                </h6>
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
                      defaultValue="henrymilo2345@gmail.com"
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
                        jay@gmail.com
                      </option>
                      <option value="Choice 2">kia@gmail.com</option>
                      <option value="Choice 3">don@gmail.com</option>
                      <option value="Choice 4">kimo@gmail.com</option>
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
                      <div id="mail-compose-editor" />
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
      
    </>
  )
}
  
export default Mail;