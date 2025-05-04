
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const TaskDetail = () => {

  const [assigneePage, setAssigneePage] = useState(0);
  const assigneesPerPage = 4;

  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/tasks/task/${taskId}`);
        setTask(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!task) return <div>Task not found</div>;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Not Started':
        return <span className="badge bg-warning-transparent">Not Started</span>;
      case 'In Progress':
        return <span className="badge bg-info-transparent">In Progress</span>;
      case 'Completed':
        return <span className="badge bg-success-transparent">Completed</span>;
      default:
        return <span className="badge bg-secondary-transparent">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Low':
        return <span className="badge bg-success-transparent">Low</span>;
      case 'Medium':
        return <span className="badge bg-warning-transparent">Medium</span>;
      case 'High':
        return <span className="badge bg-danger-transparent">High</span>;
      default:
        return <span className="badge bg-secondary-transparent">{priority}</span>;
    }
  };

  const totalAssigneePages = task.assigned_to ? Math.ceil(task.assigned_to.length / assigneesPerPage) : 0;

  const handlePrevPage = () => {
    setAssigneePage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setAssigneePage((prev) => Math.min(prev + 1, totalAssigneePages - 1));
  };

  const paginatedAssignees = task.assigned_to
    ? task.assigned_to.slice(assigneePage * assigneesPerPage, (assigneePage + 1) * assigneesPerPage)
    : [];

    return (
    <>
 
       
 <br />
      <div className="row">
        <div className="col-xxl-9">
          <div className="card custom-card">
            <div className="card-body product-checkout">
              <ul
                className="nav nav-tabs tab-style-8 scaleX d-sm-flex d-block justify-content-around border border-dashed border-bottom-0 bg-light rounded-top"
                id="myTab1"
                role="tablist"
              >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link p-3 active"
                      id="order-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#order-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="order-tab"
                      aria-selected="true"
                    >
                      <i className="ri-list-check-3 me-2 align-middle" />
                      Details
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link p-3"
                      id="confirmed-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#confirm-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="confirmed-tab"
                      aria-selected="false"
                    >
                      <i className="ri-user-3-line me-2 align-middle" />
                      Assignees 
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link p-3"
                      id="shipped-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#shipped-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="shipped-tab"
                      aria-selected="false"
                    >
                      <i className="ri-star-line me-2 align-middle" />
                      Rate
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link p-3"
                      id="delivered-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#delivery-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="delivered-tab"
                      aria-selected="false"
                    >
                      <i className="ri-checkbox-circle-line me-2 align-middle" />
                      Progress
                    </button>
                  </li>
                  </ul>
              <div
                className="tab-content border border-dashed"
                id="myTabContent"
              >
                <div
                  className="tab-pane fade show active border-0 p-0"
                  id="order-tab-pane"
                  role="tabpanel"
                  aria-labelledby="order-tab-pane"
                  tabIndex={0}
                >
                  <div className="p-3">
                    <div className="tab-content" id="profile-tabs">
                      <div
                        className="tab-pane show active p-0 border-0"
                        id="profile-about-tab-pane"
                        role="tabpanel"
                        aria-labelledby="profile-about-tab"
                        tabIndex={0}
                      >
                        <ul className="list-group list-group-flush border rounded-3">
                          <li className="list-group-item p-3">
                            <span className="fw-medium fs-15 d-block mb-3">
                              <span className="me-1">✨</span>
                              {task.title} : {getStatusBadge(task.status)}
                            </span>
                            <p className="text-muted mb-2">
                              {task.description || 'No description provided'}
                            </p>
                          </li>
                          <li className="list-group-item p-3">
                            <div className="text-muted">
                              <p className="mb-3">
                                <span className="avatar avatar-sm avatar-rounded text-primary p-1 bg-primary-transparent me-2">
                                  <i className="ri-mail-line align-middle fs-15" />
                                </span>
                                <span className="fw-medium text-default">Start Date : </span>{" "}
                                {task.start_date ? new Date(task.start_date).toLocaleDateString() : 'Not set'}
                              </p>
                              <p className="mb-3">
                                <span className="avatar avatar-sm avatar-rounded text-primary1 p-1 bg-primary1-transparent me-2">
                                  <i className="ri-map-pin-line align-middle fs-15" />
                                </span>
                                <span className="fw-medium text-default">End Date : </span>{" "}
                                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Not set'}
                              </p>
                              <p className="mb-3">
                                <span className="avatar avatar-sm avatar-rounded text-primary2 p-1 bg-primary2-transparent me-2">
                                  <i className="ri-building-line align-middle fs-15" />
                                </span>
                                <span className="fw-medium text-default">Estimated Duration : </span>{" "}
                                {task.estimated_duration ? `${task.estimated_duration} days` : 'Not estimated'}
                              </p>
                              <p className="mb-0">
                                <span className="avatar avatar-sm avatar-rounded text-primary3 p-1 bg-primary3-transparent me-2">
                                  <i className="ri-phone-line align-middle fs-15" />
                                </span>
                                <span className="fw-medium text-default">Priority : </span>{" "}
                                {getPriorityBadge(task.priority)}
                              </p>
                            </div>
                          </li>
                          {task.tags && task.tags.length > 0 && (
                            <li className="list-group-item p-3">
                              <span className="fw-medium fs-15 d-block mb-3">Tags :</span>
                              <div className="w-75">
                                {task.tags.map((tag, index) => (
                                  <span key={index} className="badge bg-light text-muted m-1 border">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade border-0 p-0"
                  id="confirm-tab-pane"
                  role="tabpanel"
                  aria-labelledby="confirm-tab-pane"
                  tabIndex={0}
                >
                  <br />
                  <div className="card custom-card" >
                  
                    <div className="card-body pb-0">
                      <div className="swiper testimonialSwiper2">
                        <div className="swiper-wrapper">
                          {paginatedAssignees.length > 0 ? (
                            <div className="swiper-slide">
                              <div className="row" >
                                {paginatedAssignees.map((member, index) => (
                                  <div key={index} className="col-md-6 mb-1">
                                    <div className="card custom-card overflow-hidden"  style={{ backgroundColor: 'rgb(90, 103, 216, 0.1)' }}>
                                      <div className="p-3 text-center align-items-center justify-content-start gap-2 border-bottom border-block-end-dashed bg-secondary-transparent">
                                        {member.user_id?.image ? (
                                            <img
                                            src={
                                                member.user_id?.image && (member.user_id?.image.startsWith('http') || member.user_id?.image.startsWith('https'))
                                                ? member.user_id?.image
                                                : member.user_id?.image
                                                  ? `http://localhost:3000${member.user_id?.image}`
                                                  : '../assets/images/faces/11.jpg'
                                            }
                                            alt={`${member.user_id?.firstName || ''} ${member.user_id?.lastName || ''}`.trim() || 'User'}
                                            className="mb-1 mx-auto text-center avatar avatar-xl rounded-circle shadow-sm" 
                                            onError={(e) => {
                                              e.target.src = '../assets/images/faces/11.jpg';
                                              e.target.alt = 'Default avatar';
                                            }}
                                            style={{
                                              objectFit: 'cover' // Ensures the image fills the square
                                            }}
                                          />
                                        
                                        ) : (
                                          <div className="mb-2 mx-auto text-center avatar avatar-xl rounded-circle shadow-sm bg-primary d-flex align-items-center justify-content-center">
                                            <span className="text-white fs-18">
                                              {member.user_id?.firstName?.charAt(0)}{member.user_id?.lastName?.charAt(0)}
                                            </span>
                                          </div>
                                        )}
                                        <div className="flex-grow-1">
                                          <p className="mb-0 fw-semibold h6">
                                            {member.user_id?.firstName} {member.user_id?.lastName}
                                          </p>
                                          <span className="fw-normal text-muted fs-12">
                                            {member.role || 'Team Member'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center p-4">
                              <p>No assignees for this task</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {totalAssigneePages > 1 && (
                        <div className="d-flex justify-content-center align-items-center mt-0 gap-3">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={handlePrevPage}
                            disabled={assigneePage === 0}
                            aria-label="Previous assignees page"
                          >
                            &#8592;
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={handleNextPage}
                            disabled={assigneePage === totalAssigneePages - 1}
                            aria-label="Next assignees page"
                          >
                            &#8594;
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                    className="tab-pane fade border-0 p-0"
                    id="shipped-tab-pane"
                    role="tabpanel"
                    aria-labelledby="shipped-tab-pane"
                    tabIndex={0}
                  >
                    <div className="p-3">
                      <p className="mb-1 fw-semibold text-muted op-5 fs-20">
                        03
                      </p>
                      <div className="row">
                        <div className="col-xl-12">
                          <div className="fs-15 fw-semibold d-sm-flex d-block align-items-center justify-content-between mb-3">
                            <div>Payment Details :</div>
                          </div>
                          <div
                            className="mb-3 d-sm-flex d-block gap-3"
                            role="group"
                            aria-label="Basic radio toggle button group"
                          >
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Paymentoptions"
                                id="Paymentoptions3"
                                defaultValue="Paymentoptions3"
                                defaultChecked="checked"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Paymentoptions3"
                              >
                                Credit/Debit Card
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Paymentoptions"
                                id="Paymentoptions1"
                                defaultValue="Paymentoptions1"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Paymentoptions1"
                              >
                                C.O.D (Cash on delivery)
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Paymentoptions"
                                id="Paymentoptions2"
                                defaultValue="Paymentoptions2"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Paymentoptions2"
                              >
                                UPI Payment
                              </label>
                            </div>
                          </div>
                          <div className="row gy-3 mb-3">
                            <div className="col-xl-12">
                              <label
                                htmlFor="payment-card-number"
                                className="form-label"
                              >
                                Card Number
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="payment-card-number"
                                placeholder="Card Number"
                                defaultValue="1245 - 5447 - 8934 - XXXX"
                              />
                            </div>
                            <div className="col-xl-12">
                              <label
                                htmlFor="payment-card-name"
                                className="form-label"
                              >
                                Name On Card
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="payment-card-name"
                                placeholder="Name On Card"
                                defaultValue="JSON TAYLOR"
                              />
                            </div>
                            <div className="col-xl-4">
                              <label
                                htmlFor="payment-cardexpiry-date"
                                className="form-label"
                              >
                                Expiration Date
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="payment-cardexpiry-date"
                                placeholder="MM/YY"
                                defaultValue="08/2024"
                              />
                            </div>
                            <div className="col-xl-4">
                              <label
                                htmlFor="payment-cvv"
                                className="form-label"
                              >
                                CVV
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="payment-cvv"
                                placeholder="XXX"
                                defaultValue={341}
                              />
                            </div>
                            <div className="col-xl-4">
                              <label
                                htmlFor="payment-security"
                                className="form-label"
                              >
                                O.T.P
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="payment-security"
                                placeholder="XXXXXX"
                                defaultValue={183467}
                              />
                              <label
                                htmlFor="payment-security"
                                className="form-label mt-1 mb-0 text-danger fs-11"
                              >
                                <sup>
                                  <i className="ri-star-s-fill" />
                                </sup>
                                Do not share O.T.P with anyone
                              </label>
                            </div>
                            <div className="col-xl-12">
                              <div className="form-check">
                                <input
                                  className="form-check-input form-checked-success"
                                  type="checkbox"
                                  defaultValue=""
                                  id="payment-card-save"
                                  defaultChecked=""
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="payment-card-save"
                                >
                                  Save this card
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="fs-15 fw-semibold d-sm-flex d-block align-items-center justify-content-between mb-3">
                            <div>Saved Cards :</div>
                          </div>
                          <div className="row gy-3">
                            <div className="col-xl-6">
                              <div className="form-check payment-card-container mb-0">
                                <input
                                  id="payment-card1"
                                  name="payment-cards"
                                  type="radio"
                                  className="form-check-input"
                                  defaultChecked=""
                                />
                                <div className="form-check-label">
                                  <div className="d-sm-flex d-block align-items-center justify-content-between">
                                    <div className="me-2 lh-1">
                                      <span className="avatar avatar-md">
                                        <img
                                          src="../assets/images/ecommerce/png/26.png"
                                          alt=""
                                        />
                                      </span>
                                    </div>
                                    <div className="saved-card-details">
                                      <p className="mb-0 fw-semibold">
                                        XXXX - XXXX - XXXX - 7646
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6">
                              <div className="form-check payment-card-container mb-0">
                                <input
                                  id="payment-card2"
                                  name="payment-cards"
                                  type="radio"
                                  className="form-check-input"
                                />
                                <div className="form-check-label">
                                  <div className="d-sm-flex d-block align-items-center justify-content-between">
                                    <div className="me-2 lh-1">
                                      <span className="avatar avatar-md">
                                        <img
                                          src="../assets/images/ecommerce/png/27.png"
                                          alt=""
                                        />
                                      </span>
                                    </div>
                                    <div className="saved-card-details">
                                      <p className="mb-0 fw-semibold">
                                        XXXX - XXXX - XXXX - 9556
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-top border-block-start-dashed d-sm-flex justify-content-between">
                      <button
                        className="btn btn-primary-light"
                        id="back-personal-trigger"
                      >
                        <i className="ri-user-3-line me-2 align-middle d-inline-block" />
                        Back To Personal Info
                      </button>
                      <button
                        className="btn btn-primary1-light mt-sm-0 mt-2"
                        id="continue-payment-trigger"
                      >
                        Continue Payment
                        <i className="bi bi-credit-card-2-front align-middle ms-2 d-inline-block" />
                      </button>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade border-0 p-0"
                    id="delivery-tab-pane"
                    role="tabpanel"
                    aria-labelledby="delivery-tab-pane"
                    tabIndex={0}
                  >
                    <div className="p-3 checkout-payment-success my-3">
                      <div className="mb-4">
                        <h5 className="text-success fw-semibold">
                          Payment Successful...
                        </h5>
                      </div>
                      <div className="mb-4">
                        <img
                          src="../assets/images/ecommerce/png/24.png"
                          alt=""
                        />
                      </div>
                      <div className="mb-4">
                        <p className="mb-1 fs-14">
                          You can track your order with Order Id{" "}
                          <b>SPK#1FR</b> from{" "}
                          <a
                            className="link-primary1"
                            href="javascript:void(0);"
                          >
                            <u>Track Order</u>
                          </a>
                        </p>
                        <p className="text-muted">
                          Thankyou for shopping with us.
                        </p>
                      </div>
                      <a href="products.html" className="btn btn-primary">
                        Continue Shopping
                        <i className="bi bi-cart ms-2" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-3">
  <div className="card custom-card">

    <div className="card-header">
      <div className="card-title me-1"> {task.project_id.name}</div>
    </div>
    <div className="card-body p-0">
      {task.project_id ? (
        <>
          <ul className="list-group mb-0 border-0 rounded-0">
            <li className="list-group-item p-3 border-top-0">
              <div className="d-flex align-items-center flex-wrap gap-2">
                {task.project_id.ProjectManager_id?.image ? (
                  <img
                    src={
                      task.project_id.ProjectManager_id.image.startsWith('http') || 
                      task.project_id.ProjectManager_id.image.startsWith('https')
                        ? task.project_id.ProjectManager_id.image
                        : `http://localhost:3000${task.project_id.ProjectManager_id.image}`
                    }
                    alt={`${task.project_id.ProjectManager_id.firstName} ${task.project_id.ProjectManager_id.lastName}`}
                    className="avatar avatar-lg bg-light rounded-circle"
                    onError={(e) => {
                      e.target.src = '../assets/images/faces/11.jpg';
                    }}
                  />
                ) : (
                  <div className="avatar avatar-lg bg-primary rounded-circle d-flex align-items-center justify-content-center">
                    <span className="text-white fs-18">
                      {task.project_id.ProjectManager_id?.firstName?.charAt(0)}
                      {task.project_id.ProjectManager_id?.lastName?.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-fill">
                  <p className="mb-0 fw-semibold">Project Manager</p>
                  <p className="mb-0 text-muted fs-12">
                    {task.project_id.ProjectManager_id?.firstName} {task.project_id.ProjectManager_id?.lastName}
                  </p>
                </div>
              </div>
            </li>

            <li className="list-group-item p-3 border-top-0">
              <div className="d-flex align-items-center flex-wrap gap-2">
                {task.project_id.manager_id?.image ? (
                  <img
                    src={
                      task.project_id.manager_id.image.startsWith('http') || 
                      task.project_id.manager_id.image.startsWith('https')
                        ? task.project_id.manager_id.image
                        : `http://localhost:3000${task.project_id.manager_id.image}`
                    }
                    alt={`${task.project_id.manager_id.firstName} ${task.project_id.manager_id.lastName}`}
                    className="avatar avatar-lg bg-light rounded-circle"
                    onError={(e) => {
                      e.target.src = '../assets/images/faces/11.jpg';
                    }}
                  />
                ) : (
                  <div className="avatar avatar-lg bg-primary rounded-circle d-flex align-items-center justify-content-center">
                    <span className="text-white fs-18">
                      {task.project_id.manager_id?.firstName?.charAt(0)}
                      {task.project_id.manager_id?.lastName?.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-fill">
                  <p className="mb-0 fw-semibold">Team Manager</p>
                  <p className="mb-0 text-muted fs-12">
                   {task.project_id.manager_id?.firstName} {task.project_id.manager_id?.lastName}
                  </p>
                </div>
              </div>
            </li>
            <li className="list-group-item p-3 border-bottom border-block-end-dashed">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted">Status:</span>
                <span>{getStatusBadge(task.project_id.status)}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted">Priority:</span>
                <span>{getPriorityBadge(task.project_id.priority)}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted">Risk Level:</span>
                <span className="badge bg-light text-muted border">{task.project_id.risk_level || 'N/A'}</span>
              </div>
            </li>
          </ul>
          <div className="p-3 border-bottom border-block-end-dashed">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted">Start Date:</span>
              <span className="fw-semibold">
                {task.project_id.start_date ? new Date(task.project_id.start_date).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted">End Date:</span>
              <span className="fw-semibold">
                {task.project_id.end_date ? new Date(task.project_id.end_date).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted">Budget:</span>
              <span className="fw-semibold">
                {task.project_id.budget ? `${task.project_id.budget.toLocaleString()} TND` : 'N/A'}
              </span>
            </div>
          </div>
          <div className="p-3">
            
            <div className="d-flex align-items-center justify-content-between mt-3">
              <span className="fw-semibold">Tasks in Project:</span>
              <span className="badge bg-primary rounded-pill">
                {task.project_id.tasks?.length || 0}
              </span>
            </div>
            
          </div>
        </>
      ) : (
        <div className="p-3 text-center">
          <p className="text-muted">No project associated with this task</p>
        </div>
      )}
    </div>
  </div>
</div>
        </div>
   
    </>
  );

}