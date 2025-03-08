export default function ProjectOverview(){
    return (
        <>
  {/* include mainhead.html"*/}
  {/* dragula css*/}
  {/* <link rel="stylesheet" href="../assets/libs/dragula/dragula.min.css" /> */}

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

    <br />
    <br />
              <li className="breadcrumb-item active" aria-current="page">
              Projects Overview
              </li>
            </ol>
          </nav>
          <h1 className="page-title fw-medium fs-18 mb-0">Projects Overview</h1>
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
        {/* Start::row-1 */}
        <div className="row">
          <div className="col-xxl-8">
            <div className="card custom-card">
              <div className="card-header justify-content-between">
                <div className="card-title">Project Details</div>
                <div>
                  <a
                    href="/createPro"
                    className="btn btn-sm btn-primary btn-wave"
                  >
                    <i className="ri-add-line align-middle me-1 fw-medium" />
                    Create Project
                  </a>
                  <a
                    href="javascript:void(0);"
                    className="btn btn-sm btn-primary1 btn-wave"
                  >
                    <i className="ri-share-line align-middle fw-medium me-1" />
                    Share
                  </a>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-4 gap-2 flex-wrap">
                  <span className="avatar avatar-lg me-1 bg-primary-gradient">
                    <i className="ri-stack-line fs-24 lh-1" />
                  </span>
                  <div>
                    <h6 className="fw-medium mb-2 task-title">
                      Customer Feedback Dashboard Development
                    </h6>
                    <span className="badge bg-success-transparent">
                      {" "}
                      In progress
                    </span>
                    <span className="text-muted fs-12">
                      <i className="ri-circle-fill text-success mx-2 fs-9" />
                      Last Updated 1 Day Ago
                    </span>
                  </div>
                  <div className="ms-auto align-self-start">
                    <div className="dropdown">
                      <a
                        aria-label="anchor"
                        href="javascript:void(0);"
                        className="btn btn-icon btn-sm btn-primary-light"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fe fe-more-vertical" />
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                          >
                            <i className="ri-eye-line align-middle me-1 d-inline-block" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                          >
                            <i className="ri-edit-line align-middle me-1 d-inline-block" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                          >
                            <i className="ri-delete-bin-line me-1 align-middle d-inline-block" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="fs-15 fw-medium mb-2">
                  Project Description :
                </div>
                <p className="text-muted mb-4">
                  The Customer Feedback Dashboard Development project aims to
                  create a comprehensive dashboard that aggregates and
                  visualizes customer feedback data. This will enable our team
                  to gain actionable insights and improve customer satisfaction.
                </p>
                <div className="d-flex gap-5 mb-4 flex-wrap">
                  <div className="d-flex align-items-center gap-2 me-3">
                    <span className="avatar avatar-md avatar-rounded me-1 bg-primary1-transparent">
                      <i className="ri-calendar-event-line fs-18 lh-1 align-middle" />
                    </span>
                    <div>
                      <div className="fw-medium mb-0 task-title">
                        Start Date
                      </div>
                      <span className="fs-12 text-muted">28 August, 2024</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 me-3">
                    <span className="avatar avatar-md avatar-rounded me-1 bg-primary2-transparent">
                      <i className="ri-time-line fs-18 lh-1 align-middle" />
                    </span>
                    <div>
                      <div className="fw-medium mb-0 task-title">End Date</div>
                      <span className="fs-12 text-muted">30 Oct, 2024</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="avatar avatar-md p-1 avatar-rounded me-1 bg-primary-transparent">
                      <img src="../assets/images/faces/11.jpg" alt="" />
                    </span>
                    <div>
                      <span className="d-block fs-14 fw-medium">
                        Amith Catzem
                      </span>
                      <span className="fs-12 text-muted">Project Manager</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="fs-15 fw-medium mb-2">Key tasks :</div>
                      <ul className="task-details-key-tasks mb-0">
                        <li>
                          Design and implement a user-friendly dashboard
                          interface.
                        </li>
                        <li>
                          Integrate data sources and APIs to fetch customer
                          feedback data.
                        </li>
                        <li>
                          Develop interactive data visualizations for easy
                          interpretation.
                        </li>
                        <li>
                          Implement filters and sorting functionalities for data
                          analysis.
                        </li>
                        <li>
                          Create user authentication and access control
                          features.
                        </li>
                        <li>
                          Perform usability testing and iterate based on
                          feedback.
                        </li>
                      </ul>
                    </div>
                    <div className="col-xl-6">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="fs-15 fw-medium">Sub Tasks :</div>
                        <a
                          href="javascript:void(0);"
                          className="btn btn-primary-light btn-wave btn-sm waves-effect waves-light"
                        >
                          See More
                        </a>
                      </div>
                      <ul className="list-group">
                        <li className="list-group-item">
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <i className="ri-link fs-15 text-secondary lh-1 p-1 bg-secondary-transparent rounded-circle" />
                            </div>
                            <div className="fw-medium">
                              Research latest web development trends.
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item">
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <i className="ri-link fs-15 text-secondary lh-1 p-1 bg-secondary-transparent rounded-circle" />
                            </div>
                            <div className="fw-medium">
                              Create technical specifications document.
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item">
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <i className="ri-link fs-15 text-secondary lh-1 p-1 bg-secondary-transparent rounded-circle" />
                            </div>
                            <div className="fw-medium">
                              Optimize website for mobile responsiveness.
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="fs-15 fw-medium mb-2">Skills :</div>
                <div className="d-flex gap-2 flex-wrap">
                  <span className="badge bg-light text-default border">
                    UI/UX Design
                  </span>
                  <span className="badge bg-light text-default border">
                    Data Integration
                  </span>
                  <span className="badge bg-light text-default border">
                    Data Visualization
                  </span>
                  <span className="badge bg-light text-default border">
                    Front-End Development
                  </span>
                  <span className="badge bg-light text-default border">
                    Authentication Systems
                  </span>
                  <span className="badge bg-light text-default border">
                    Usability Testing
                  </span>
                  <span className="badge bg-light text-default border">
                    Agile Methodology
                  </span>
                  <span className="badge bg-light text-default border">
                    API Development
                  </span>
                </div>
              </div>
              <div className="card-footer">
                <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                  <div className="d-flex gap-3 align-items-center">
                    <span className="fs-12">Assigned To :</span>
                    <div className="avatar-list-stacked">
                      <span
                        className="avatar avatar-sm avatar-rounded"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="tooltip-primary"
                        data-bs-original-title="John"
                      >
                        <img src="../assets/images/faces/2.jpg" alt="img" />
                      </span>
                      <span
                        className="avatar avatar-sm avatar-rounded"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="tooltip-primary"
                        data-bs-original-title="Emily"
                      >
                        <img src="../assets/images/faces/8.jpg" alt="img" />
                      </span>
                      <span
                        className="avatar avatar-sm avatar-rounded"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="tooltip-primary"
                        data-bs-original-title="Liam"
                      >
                        <img src="../assets/images/faces/5.jpg" alt="img" />
                      </span>
                      <span
                        className="avatar avatar-sm avatar-rounded"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="tooltip-primary"
                        data-bs-original-title="Sophia"
                      >
                        <img src="../assets/images/faces/10.jpg" alt="img" />
                      </span>
                      <span
                        className="avatar avatar-sm avatar-rounded"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="tooltip-primary"
                        data-bs-original-title="Charlotte"
                      >
                        <img src="../assets/images/faces/15.jpg" alt="img" />
                      </span>
                    </div>
                  </div>
                  <div className="d-flex gap-3 align-items-center">
                    <span className="fs-12">Status:</span>
                    <span className="d-block">
                      <span className="badge bg-info">On going</span>
                    </span>
                  </div>
                  <div className="d-flex gap-3 align-items-center">
                    <span className="fs-12">Priority:</span>
                    <span className="d-block fs-14 fw-medium">
                      <span className="badge bg-primary3">Medium</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card custom-card overflow-hidden">
              <div className="card-header justify-content-between">
                <div className="card-title">To Do Tasks</div>
                <div className="btn btn-sm btn-primary-light btn-wave">
                  <i className="ri-add-line align-middle me-1 fw-medium" />
                  Add Task
                </div>
              </div>
              <div
                className="card-body p-0 position-relative"
                id="todo-content"
              >
                <div>
                  <div className="table-responsive">
                    <table className="table text-nowrap">
                      <thead>
                        <tr>
                          <th>
                            <input
                              className="form-check-input check-all"
                              type="checkbox"
                              id="all-tasks"
                              defaultValue=""
                              aria-label="..."
                            />
                          </th>
                          <th className="todolist-handle-drag"></th>
                          <th scope="col">Task Title</th>
                          <th scope="col">Status</th>
                          <th scope="col">End Date</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody id="todo-drag">
                        <tr className="todo-box">
                          <td className="task-checkbox">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              aria-label="..."
                              defaultChecked=""
                            />
                          </td>
                          <td>
                            <button className="btn btn-icon btn-sm btn-wave btn-light todo-handle">
                              : :
                            </button>
                          </td>
                          <td>
                            <span className="fw-medium">
                              Implement responsive design
                            </span>
                          </td>
                          <td>
                            <span className="fw-medium text-primary2">
                              <i className="ri-circle-line fw-semibold fs-7 me-2 lh-1 align-middle" />
                              Not Started
                            </span>
                          </td>
                          <td>17-Jan-2024</td>
                          <td className="text-end">
                            <div className="d-flex gap-2">
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-info-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-edit-line" />
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-danger-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-delete-bin-line" />
                              </a>
                            </div>
                          </td>
                        </tr>
                        <tr className="todo-box">
                          <td className="task-checkbox">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              aria-label="..."
                            />
                          </td>
                          <td>
                            <button className="btn btn-icon btn-sm btn-wave btn-light todo-handle">
                              : :
                            </button>
                          </td>
                          <td>
                            <span className="fw-medium">
                              Fix login authentication issue
                            </span>
                          </td>
                          <td>
                            <span className="fw-medium text-success fs-12">
                              <i className="ri-circle-line fw-semibold fs-7 me-2 lh-1 align-middle" />
                              Completed
                            </span>
                          </td>
                          <td>17-Jan-2024</td>
                          <td className="text-end">
                            <div className="d-flex gap-2">
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-info-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-edit-line" />
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-danger-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-delete-bin-line" />
                              </a>
                            </div>
                          </td>
                        </tr>
                        <tr className="todo-box">
                          <td className="task-checkbox">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              aria-label="..."
                            />
                          </td>
                          <td>
                            <button className="btn btn-icon btn-sm btn-wave btn-light todo-handle">
                              : :
                            </button>
                          </td>
                          <td>
                            <span className="fw-medium">
                              Optimize database queries
                            </span>
                          </td>
                          <td>
                            <span className="fw-medium text-primary2">
                              <i className="ri-circle-line fw-semibold fs-7 me-2 lh-1 align-middle" />
                              Not Started
                            </span>
                          </td>
                          <td>18-Feb-2024</td>
                          <td className="text-end">
                            <div className="d-flex gap-2">
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-info-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-edit-line" />
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-danger-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-delete-bin-line" />
                              </a>
                            </div>
                          </td>
                        </tr>
                        <tr className="todo-box">
                          <td className="task-checkbox">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              aria-label="..."
                              defaultChecked=""
                            />
                          </td>
                          <td>
                            <button className="btn btn-icon btn-sm btn-wave btn-light todo-handle">
                              : :
                            </button>
                          </td>
                          <td>
                            <span className="fw-medium">
                              Integrate third-party API
                            </span>
                          </td>
                          <td>
                            <span className="fw-medium text-warning">
                              <i className="ri-circle-line fw-semibold fs-7 me-2 lh-1 align-middle" />
                              Pending
                            </span>
                          </td>
                          <td>19-Feb-2024</td>
                          <td className="text-end">
                            <div className="d-flex gap-2">
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-info-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-edit-line" />
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-danger-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-delete-bin-line" />
                              </a>
                            </div>
                          </td>
                        </tr>
                        <tr className="todo-box">
                          <td className="task-checkbox">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              aria-label="..."
                              defaultChecked=""
                            />
                          </td>
                          <td>
                            <button className="btn btn-icon btn-sm btn-wave btn-light todo-handle">
                              : :
                            </button>
                          </td>
                          <td>
                            <span className="fw-medium">
                              Create user documentation
                            </span>
                          </td>
                          <td>
                            <span className="fw-medium text-primary2">
                              <i className="ri-circle-line fw-semibold fs-7 me-2 lh-1 align-middle" />
                              Not Started
                            </span>
                          </td>
                          <td>21-Feb-2024</td>
                          <td className="text-end">
                            <div className="d-flex gap-2">
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-info-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-edit-line" />
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-danger-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-delete-bin-line" />
                              </a>
                            </div>
                          </td>
                        </tr>
                        <tr className="todo-box">
                          <td className="task-checkbox">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              aria-label="..."
                            />
                          </td>
                          <td>
                            <button className="btn btn-icon btn-sm btn-wave btn-light todo-handle">
                              : :
                            </button>
                          </td>
                          <td>
                            <span className="fw-medium">
                              Deploy to staging environment
                            </span>
                          </td>
                          <td>
                            <span className="fw-medium text-primary">
                              <i className="ri-circle-line fw-semibold fs-7 me-2 lh-1 align-middle" />
                              In Progress
                            </span>
                          </td>
                          <td>24-Feb-2024</td>
                          <td className="text-end">
                            <div className="d-flex gap-2">
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-info-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-edit-line" />
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-danger-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-delete-bin-line" />
                              </a>
                            </div>
                          </td>
                        </tr>
                        <tr className="todo-box">
                          <td className="task-checkbox border-bottom-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              aria-label="..."
                              defaultChecked=""
                            />
                          </td>
                          <td className="border-bottom-0">
                            <button className="btn btn-icon btn-sm btn-wave btn-light todo-handle">
                              : :
                            </button>
                          </td>
                          <td className="border-bottom-0">
                            <span className="fw-medium">
                              Conduct security audit
                            </span>
                          </td>
                          <td className="border-bottom-0">
                            <span className="fw-medium text-primary2">
                              <i className="ri-circle-line fw-semibold fs-7 me-2 lh-1 align-middle" />
                              Not Started
                            </span>
                          </td>
                          <td className="border-bottom-0">27-Feb-2024</td>
                          <td className="text-end border-bottom-0">
                            <div className="d-flex gap-2">
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-info-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-edit-line" />
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="btn btn-icon btn-sm btn-danger-light btn-wave waves-effect waves-light"
                              >
                                <i className="ri-delete-bin-line" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-4">
            <div className="card custom-card justify-content-between">
              <div className="card-header pb-0">
                <div className="card-title">Project Discussions</div>
              </div>
              <div className="card-body">
                <ul className="list-unstyled profile-timeline">
                  <li>
                    <div>
                      <span className="avatar avatar-sm shadow-sm bg-primary avatar-rounded profile-timeline-avatar">
                        A
                      </span>
                      <div className="mb-2 d-flex align-items-start gap-2">
                        <div>
                          <span className="fw-medium">
                            Project Kick-off Meeting
                          </span>
                        </div>
                        <span className="ms-auto bg-light text-muted badge">
                          15,Jun 2024 - 06:20
                        </span>
                      </div>
                      <p className="text-muted mb-0">
                        Discuss project scope, objectives, and timelines.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div>
                      <span className="avatar avatar-sm shadow-sm bg-primary2 avatar-rounded profile-timeline-avatar">
                        B
                      </span>
                      <div className="mb-2 d-flex align-items-start gap-2">
                        <div>
                          <span className="fw-medium">
                            Project Details Page Planning
                          </span>
                        </div>
                        <span className="ms-auto bg-light text-muted badge">
                          20, Jun 2024 - 09:00
                        </span>
                      </div>
                      <p className="text-muted mb-0">
                        Define feature requirements and layout for the project
                        details page.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div>
                      <span className="avatar avatar-sm shadow-sm avatar-rounded profile-timeline-avatar">
                        <img src="../assets/images/faces/12.jpg" alt="" />
                      </span>
                      <div className="text-muted mb-2 d-flex align-items-start gap-2 flex-wrap">
                        <div>
                          <span className="text-default">
                            <b>Brenda Adams</b> shared a document with{" "}
                            <b>you</b>
                          </span>
                          .
                        </div>
                        <span className="ms-auto bg-light text-muted badge">
                          18,Jun 2024 - 09:15
                        </span>
                      </div>
                      <p className="profile-activity-media mb-0">
                        <a href="javascript:void(0);">
                          <img
                            src="../assets/images/media/file-manager/3.png"
                            alt=""
                          />
                        </a>
                        <span className="fs-11 text-muted">728.62KB</span>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div>
                      <span className="avatar avatar-sm shadow-sm bg-primary3 avatar-rounded profile-timeline-avatar">
                        J
                      </span>
                      <div className="text-muted mb-2 d-flex align-items-start gap-2 flex-wrap">
                        <div>
                          <span className="text-default">
                            <b>You</b>
                            shared a post with 4 people{" "}
                            <b>John,Emma,Liam,Sophie</b>
                          </span>
                          .
                        </div>
                        <span className="ms-auto bg-light text-muted badge">
                          30,Jun 2024 - 13:20
                        </span>
                      </div>
                      <p className="profile-activity-media mb-2">
                        <a href="javascript:void(0);">
                          <img
                            src="../assets/images/media/media-21.jpg"
                            alt=""
                          />
                        </a>
                      </p>
                      <div>
                        <div className="avatar-list-stacked">
                          <span className="avatar avatar-xs avatar-rounded">
                            <img src="../assets/images/faces/3.jpg" alt="img" />
                          </span>
                          <span className="avatar avatar-xs avatar-rounded">
                            <img src="../assets/images/faces/9.jpg" alt="img" />
                          </span>
                          <span className="avatar avatar-xs avatar-rounded">
                            <img src="../assets/images/faces/6.jpg" alt="img" />
                          </span>
                          <span className="avatar avatar-xs avatar-rounded">
                            <img
                              src="../assets/images/faces/14.jpg"
                              alt="img"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <span className="avatar avatar-sm shadow-sm avatar-rounded profile-timeline-avatar">
                        <img src="../assets/images/faces/7.jpg" alt="" />
                      </span>
                      <div className="mb-2">
                        <span className="fw-medium">
                          Security and Compliance Audit
                        </span>
                      </div>
                      <p className="text-muted mb-0 fs-12">
                        Ensure the system adheres to security and regulatory
                        requirements.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div>
                      <span className="avatar avatar-sm shadow-sm avatar-rounded profile-timeline-avatar">
                        <img src="../assets/images/media/media-45.jpg" alt="" />
                      </span>
                      <div className="mb-1 d-flex align-items-start gap-2 flex-wrap flex-xxl-nowrap">
                        <div>
                          <b>Lucas</b> Commented on Project{" "}
                          <a
                            className="text-secondary"
                            href="javascript:void(0);"
                          >
                            <u>#System Integration</u>
                          </a>
                          .
                        </div>
                        <span className="ms-auto bg-light text-muted badge">
                          25,Jun 2024 - 10:52
                        </span>
                      </div>
                      <p className="text-muted">
                        Integration progress looks good, keep it up! 👍
                      </p>
                      <p className="profile-activity-media mb-0">
                        <a href="javascript:void(0);">
                          <img
                            src="../assets/images/media/media-28.jpg"
                            alt=""
                          />
                        </a>
                        <a href="javascript:void(0);">
                          <img
                            src="../assets/images/media/media-30.jpg"
                            alt=""
                          />
                        </a>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="card-footer">
                <div className="d-sm-flex align-items-center lh-1">
                  <div className="me-sm-2 mb-2 mb-sm-0 p-1 rounded-circle bg-primary-transparent d-inline-block">
                    <img
                      src="../assets/images/faces/5.jpg"
                      alt=""
                      className="avatar avatar-sm avatar-rounded"
                    />
                  </div>
                  <div className="flex-fill">
                    <div className="input-group flex-nowrap">
                      <input
                        type="text"
                        className="form-control w-sm-50 border shadow-none"
                        placeholder="Share your thoughts"
                        aria-label="Recipient's username with two button addons"
                      />
                      <button
                        className="btn btn-primary-light btn-wave waves-effect waves-light"
                        type="button"
                      >
                        <i className="bi bi-emoji-smile" />
                      </button>
                      <button
                        className="btn btn-primary-light btn-wave waves-effect waves-light"
                        type="button"
                      >
                        <i className="bi bi-paperclip" />
                      </button>
                      <button
                        className="btn btn-primary-light btn-wave waves-effect waves-light"
                        type="button"
                      >
                        <i className="bi bi-camera" />
                      </button>
                      <button
                        className="btn btn-primary btn-wave waves-effect waves-light text-nowrap"
                        type="button"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card custom-card overflow-hidden">
              <div className="card-header justify-content-between">
                <div className="card-title">Project Documents</div>
                <div className="dropdown">
                  <div
                    className="btn btn-light btn-full btn-sm"
                    data-bs-toggle="dropdown"
                  >
                    View All
                    <i className="ti ti-chevron-down ms-1" />
                  </div>
                  <ul className="dropdown-menu" role="menu">
                    <li>
                      <a className="dropdown-item" href="javascript:void(0);">
                        Download
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="javascript:void(0);">
                        Import
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="javascript:void(0);">
                        Export
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <span className="avatar avatar-md avatar-rounded p-2 bg-light lh-1">
                        <img
                          src="../assets/images/media/file-manager/1.png"
                          alt=""
                        />
                      </span>
                      <div className="flex-fill">
                        <a href="javascript:void(0);">
                          <span className="d-block fw-medium">
                            Project Proposal.pdf
                          </span>
                        </a>
                        <span className="d-block text-muted fs-12 fw-normal">
                          1.2MB
                        </span>
                      </div>
                      <div className="btn-list">
                        <button className="btn btn-sm btn-icon btn-info-light btn-wave">
                          <i className="ri-edit-line" />
                        </button>
                        <button className="btn btn-sm btn-icon btn-danger-light btn-wave">
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <span className="avatar avatar-rounded bg-light lh-1">
                        <img
                          src="../assets/images/media/file-manager/3.png"
                          alt=""
                        />
                      </span>
                      <div className="flex-fill">
                        <a href="javascript:void(0);">
                          <span className="d-block fw-medium">
                            Contracts.docx
                          </span>
                        </a>
                        <span className="d-block text-muted fs-12 fw-normal">
                          1.5MB
                        </span>
                      </div>
                      <div className="btn-list">
                        <button className="btn btn-sm btn-icon btn-info-light btn-wave">
                          <i className="ri-edit-line" />
                        </button>
                        <button className="btn btn-sm btn-icon btn-danger-light btn-wave">
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <span className="avatar avatar-md avatar-rounded p-2 bg-light lh-1">
                        <img
                          src="../assets/images/media/file-manager/1.png"
                          alt=""
                        />
                      </span>
                      <div className="flex-fill">
                        <a href="javascript:void(0);">
                          <span className="d-block fw-medium">
                            Meeting Notes.txt
                          </span>
                        </a>
                        <span className="d-block text-muted fs-12 fw-normal">
                          256KB
                        </span>
                      </div>
                      <div className="btn-list">
                        <button className="btn btn-sm btn-icon btn-info-light btn-wave">
                          <i className="ri-edit-line" />
                        </button>
                        <button className="btn btn-sm btn-icon btn-danger-light btn-wave">
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <span className="avatar avatar-rounded bg-light lh-1">
                        <img
                          src="../assets/images/media/file-manager/3.png"
                          alt=""
                        />
                      </span>
                      <div className="flex-fill">
                        <a href="javascript:void(0);">
                          <span className="d-block fw-medium">
                            User Manual.pdf
                          </span>
                        </a>
                        <span className="d-block text-muted fs-12 fw-normal">
                          1.8MB
                        </span>
                      </div>
                      <div className="btn-list">
                        <button className="btn btn-sm btn-icon btn-info-light btn-wave">
                          <i className="ri-edit-line" />
                        </button>
                        <button className="btn btn-sm btn-icon btn-danger-light btn-wave">
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

</>

    );
}