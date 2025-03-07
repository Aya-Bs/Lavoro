export default function ProList() {
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

    <br />
    <br />
              <li className="breadcrumb-item active" aria-current="page">
              Projects List
              </li>
            </ol>
          </nav>
          <h1 className="page-title fw-medium fs-18 mb-0">Projects List</h1>
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
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div className="d-flex flex-wrap gap-1 project-list-main">
                    <a
                      href="projects-create.html"
                      className="btn btn-primary me-2"
                    >
                      <i className="ri-add-line me-1 fw-medium align-middle" />
                      New Project
                    </a>
                    <select
                      className="form-control"
                      data-trigger=""
                      name="choices-single-default"
                      id="choices-single-default"
                    >
                      <option value="">Sort By</option>
                      <option value="Newest">Newest</option>
                      <option value="Date Added">Date Added</option>
                      <option value="Type">Type</option>
                      <option value="A - Z">A - Z</option>
                    </select>
                  </div>
                  <div className="avatar-list-stacked">
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/1.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/2.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/8.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/12.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/10.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/4.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/5.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-sm avatar-rounded">
                      <img src="../assets/images/faces/13.jpg" alt="img" />
                    </span>
                    <a
                      className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white"
                      href="javascript:void(0);"
                    >
                      +8
                    </a>
                  </div>
                  <div className="d-flex" role="search">
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="Search Project"
                      aria-label="Search"
                    />
                    <button className="btn btn-light" type="submit">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End::row-1 */}
        {/* Start::row-2 */}
        <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card overflow-hidden">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table text-nowrap">
                    <thead>
                      <tr>
                        <th scope="col">Project Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Team</th>
                        <th scope="col">Assigned Date</th>
                        <th scope="col">Due Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <span className="avatar avatar-rounded p-1 bg-info-transparent">
                                <img
                                  src="../assets/images/company-logos/1.png"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-fill">
                              <a
                                href="javascript:void(0);"
                                className="fw-medium fs-14 d-block text-truncate project-list-title"
                              >
                                Development of Enhanced Analytics Platform
                              </a>
                              <span className="text-muted d-block fs-12">
                                Total{" "}
                                <span className="fw-medium text-default">
                                  18/22
                                </span>{" "}
                                tasks completed
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="text-muted mb-0 project-list-description">
                            Build an advanced analytics dashboard integrating
                            real-time data from multiple sources.
                          </p>
                        </td>
                        <td>
                          <div className="avatar-list-stacked">
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/5.jpg"
                                alt="img"
                              />
                            </span>
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/7.jpg"
                                alt="img"
                              />
                            </span>
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/9.jpg"
                                alt="img"
                              />
                            </span>
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/11.jpg"
                                alt="img"
                              />
                            </span>
                            <a
                              className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white"
                              href="javascript:void(0);"
                            >
                              +2
                            </a>
                          </div>
                        </td>
                        <td>15,Jun 2024</td>
                        <td>30,Aug 2024</td>
                        <td>
                          <div>
                            <div
                              className="progress progress-xs progress-animate"
                              role="progressbar"
                              aria-valuenow={65}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-primary"
                                style={{ width: "65%" }}
                              />
                            </div>
                            <div className="mt-1">
                              <span className="text-primary fw-medium">
                                65%
                              </span>{" "}
                              Completed
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-warning-transparent">
                            Medium
                          </span>
                        </td>
                        <td>
                          <div className="dropdown">
                            <a
                              aria-label="anchor"
                              href="javascript:void(0);"
                              className="btn btn-icon btn-sm btn-light"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
<i class="ri-more-2-fill"></i>                            </a>
                            <ul className="dropdown-menu">
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
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <span className="avatar avatar-rounded p-1 bg-warning-transparent">
                                <img
                                  src="../assets/images/company-logos/3.png"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-fill">
                              <a
                                href="javascript:void(0);"
                                className="fw-medium fs-14 d-block text-truncate project-list-title"
                              >
                                E-commerce Platform Optimization
                              </a>
                              <span className="text-muted d-block fs-12">
                                Total{" "}
                                <span className="fw-medium text-default">
                                  10/20
                                </span>{" "}
                                tasks completed
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="text-muted mb-0 project-list-description">
                            Enhance performance and user experience for a
                            high-traffic e-commerce platform.
                          </p>
                        </td>
                        <td>
                          <div className="avatar-list-stacked">
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/4.jpg"
                                alt="img"
                              />
                            </span>
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/6.jpg"
                                alt="img"
                              />
                            </span>
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/12.jpg"
                                alt="img"
                              />
                            </span>
                            <a
                              className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white"
                              href="javascript:void(0);"
                            >
                              +1
                            </a>
                          </div>
                        </td>
                        <td>02,Jul 2024</td>
                        <td>15,Sep 2024</td>
                        <td>
                          <div>
                            <div
                              className="progress progress-xs progress-animate"
                              role="progressbar"
                              aria-valuenow={45}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-primary"
                                style={{ width: "45%" }}
                              />
                            </div>
                            <div className="mt-1">
                              <span className="text-primary fw-medium">
                                45%
                              </span>{" "}
                              Completed
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-danger-transparent">
                            High
                          </span>
                        </td>
                        <td>
                          <div className="dropdown">
                            <a
                              aria-label="anchor"
                              href="javascript:void(0);"
                              className="btn btn-icon btn-sm btn-light"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
<i class="ri-more-2-fill"></i>                            </a>
                            <ul className="dropdown-menu">
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
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <span className="avatar avatar-rounded p-1 bg-danger-transparent">
                                <img
                                  src="../assets/images/company-logos/7.png"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-fill">
                              <a
                                href="javascript:void(0);"
                                className="fw-medium fs-14 d-block text-truncate project-list-title"
                              >
                                Data Migration to Cloud
                              </a>
                              <span className="text-muted d-block fs-12">
                                Total{" "}
                                <span className="fw-medium text-default">
                                  5/8
                                </span>{" "}
                                tasks completed
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="text-muted mb-0 project-list-description">
                            Transfer legacy data systems to cloud infrastructure
                            for scalability and accessibility.
                          </p>
                        </td>
                        <td>
                          <div className="avatar-list-stacked">
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/1.jpg"
                                alt="img"
                              />
                            </span>
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/21.jpg"
                                alt="img"
                              />
                            </span>
                            <a
                              className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white"
                              href="javascript:void(0);"
                            >
                              +0
                            </a>
                          </div>
                        </td>
                        <td>15,Oct 2024</td>
                        <td>30,Dec 2024</td>
                        <td>
                          <div>
                            <div
                              className="progress progress-xs progress-animate"
                              role="progressbar"
                              aria-valuenow={62}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-primary"
                                style={{ width: "62%" }}
                              />
                            </div>
                            <div className="mt-1">
                              <span className="text-primary fw-medium">
                                62%
                              </span>{" "}
                              Completed
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-success-transparent">
                            Low
                          </span>
                        </td>
                        <td>
                          <div className="dropdown">
                            <a
                              aria-label="anchor"
                              href="javascript:void(0);"
                              className="btn btn-icon btn-sm btn-light"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
<i class="ri-more-2-fill"></i>                            </a>
                            <ul className="dropdown-menu">
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
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <span className="avatar avatar-rounded p-1 bg-warning-transparent">
                                <img
                                  src="../assets/images/company-logos/8.png"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-fill">
                              <a
                                href="javascript:void(0);"
                                className="fw-medium fs-14 d-block text-truncate project-list-title"
                              >
                                Cybersecurity Audit and Enhancements
                              </a>
                              <span className="text-muted d-block fs-12">
                                Total{" "}
                                <span className="fw-medium text-default">
                                  2/6
                                </span>{" "}
                                tasks completed
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="text-muted mb-0 project-list-description">
                            Conduct a comprehensive audit and implement security
                            measures to protect data and systems.
                          </p>
                        </td>
                        <td>
                          <div className="avatar-list-stacked">
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/12.jpg"
                                alt="img"
                              />
                            </span>
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/11.jpg"
                                alt="img"
                              />
                            </span>
                            <a
                              className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white"
                              href="javascript:void(0);"
                            >
                              +0
                            </a>
                          </div>
                        </td>
                        <td>01,Nov 2024</td>
                        <td>15,Jan 2025</td>
                        <td>
                          <div>
                            <div
                              className="progress progress-xs progress-animate"
                              role="progressbar"
                              aria-valuenow={40}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-primary"
                                style={{ width: "40%" }}
                              />
                            </div>
                            <div className="mt-1">
                              <span className="text-primary fw-medium">
                                40%
                              </span>{" "}
                              Completed
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-danger-transparent">
                            High
                          </span>
                        </td>
                        <td>
                          <div className="dropdown">
                            <a
                              aria-label="anchor"
                              href="javascript:void(0);"
                              className="btn btn-icon btn-sm btn-light"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
<i class="ri-more-2-fill"></i>                            </a>
                            <ul className="dropdown-menu">
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
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <span className="avatar avatar-rounded p-1 bg-info-transparent">
                                <img
                                  src="../assets/images/company-logos/6.png"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-fill">
                              <a
                                href="javascript:void(0);"
                                className="fw-medium fs-14 d-block text-truncate project-list-title"
                              >
                                AI-Powered Customer Support System
                              </a>
                              <span className="text-muted d-block fs-12">
                                Total{" "}
                                <span className="fw-medium text-default">
                                  3/10
                                </span>{" "}
                                tasks completed
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="text-muted mb-0 project-list-description">
                            Implement a machine learning-driven system to
                            automate customer support inquiries.
                          </p>
                        </td>
                        <td>
                          <div className="avatar-list-stacked">
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/5.jpg"
                                alt="img"
                              />
                            </span>
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/12.jpg"
                                alt="img"
                              />
                            </span>
                            <a
                              className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white"
                              href="javascript:void(0);"
                            >
                              +1
                            </a>
                          </div>
                        </td>
                        <td>05,Sep 2024</td>
                        <td>25,Nov 2024</td>
                        <td>
                          <div>
                            <div
                              className="progress progress-xs progress-animate"
                              role="progressbar"
                              aria-valuenow={30}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-primary"
                                style={{ width: "30%" }}
                              />
                            </div>
                            <div className="mt-1">
                              <span className="text-primary fw-medium">
                                30%
                              </span>{" "}
                              Completed
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-warning-transparent">
                            Medium
                          </span>
                        </td>
                        <td>
                          <div className="dropdown">
                            <a
                              aria-label="anchor"
                              href="javascript:void(0);"
                              className="btn btn-icon btn-sm btn-light"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
<i class="ri-more-2-fill"></i>                            </a>
                            <ul className="dropdown-menu">
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
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <span className="avatar avatar-rounded p-1 bg-success-transparent">
                                <img
                                  src="../assets/images/company-logos/4.png"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-fill">
                              <a
                                href="javascript:void(0);"
                                className="fw-medium fs-14 d-block text-truncate project-list-title"
                              >
                                Mobile App Launch
                              </a>
                              <span className="text-muted d-block fs-12">
                                Total{" "}
                                <span className="fw-medium text-default">
                                  5/15
                                </span>{" "}
                                tasks completed
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="text-muted mb-0 project-list-description">
                            Develop and release a new mobile application for iOS
                            and Android platforms.
                          </p>
                        </td>
                        <td>
                          <div className="avatar-list-stacked">
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/13.jpg"
                                alt="img"
                              />
                            </span>
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/14.jpg"
                                alt="img"
                              />
                            </span>
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/15.jpg"
                                alt="img"
                              />
                            </span>
                            <a
                              className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white"
                              href="javascript:void(0);"
                            >
                              +0
                            </a>
                          </div>
                        </td>
                        <td>10,Aug 2024</td>
                        <td>30,Oct 2024</td>
                        <td>
                          <div>
                            <div
                              className="progress progress-xs progress-animate"
                              role="progressbar"
                              aria-valuenow={35}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-primary"
                                style={{ width: "35%" }}
                              />
                            </div>
                            <div className="mt-1">
                              <span className="text-primary fw-medium">
                                35%
                              </span>{" "}
                              Completed
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-info-transparent">
                            Medium
                          </span>
                        </td>
                        <td>
                          <div className="dropdown">
                            <a
                              aria-label="anchor"
                              href="javascript:void(0);"
                              className="btn btn-icon btn-sm btn-light"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
<i class="ri-more-2-fill"></i>                            </a>
                            <ul className="dropdown-menu">
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
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <span className="avatar avatar-rounded p-1 bg-secondary-transparent">
                                <img
                                  src="../assets/images/company-logos/5.png"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-fill">
                              <a
                                href="javascript:void(0);"
                                className="fw-medium fs-14 d-block text-truncate project-list-title"
                              >
                                IT Infrastructure Upgrade
                              </a>
                              <span className="text-muted d-block fs-12">
                                Total{" "}
                                <span className="fw-medium text-default">
                                  2/12
                                </span>{" "}
                                tasks completed
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="text-muted mb-0 project-list-description">
                            Modernize network and server infrastructure to
                            improve reliability and security.
                          </p>
                        </td>
                        <td>
                          <div className="avatar-list-stacked">
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/16.jpg"
                                alt="img"
                              />
                            </span>
                            <span className="avatar avatar-sm avatar-rounded">
                              <img
                                src="../assets/images/faces/11.jpg"
                                alt="img"
                              />
                            </span>
                            <a
                              className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white"
                              href="javascript:void(0);"
                            >
                              +0
                            </a>
                          </div>
                        </td>
                        <td>20,Jul 2024</td>
                        <td>30,Oct 2024</td>
                        <td>
                          <div>
                            <div
                              className="progress progress-xs progress-animate"
                              role="progressbar"
                              aria-valuenow={15}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-primary"
                                style={{ width: "15%" }}
                              />
                            </div>
                            <div className="mt-1">
                              <span className="text-primary fw-medium">
                                15%
                              </span>{" "}
                              Completed
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-success-transparent">
                            Low
                          </span>
                        </td>
                        <td>
                          <div className="dropdown">
                            <a
                              aria-label="anchor"
                              href="javascript:void(0);"
                              className="btn btn-icon btn-sm btn-light"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
<i class="ri-more-2-fill"></i>                            </a>
                            <ul className="dropdown-menu">
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
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End::row-2 */}
        <ul className="pagination justify-content-end">
          <li className="page-item disabled">
            <a className="page-link">Previous</a>
          </li>
          <li className="page-item">
            <a className="page-link" href="javascript:void(0);">
              1
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="javascript:void(0);">
              2
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="javascript:void(0);">
              3
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="javascript:void(0);">
              Next
            </a>
          </li>
        </ul>

</>

    )
    }