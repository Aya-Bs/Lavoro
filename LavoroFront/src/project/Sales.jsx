
import '../../public/assets/libs/flatpickr/flatpickr.min.css'
import '../../public/assets/libs/apexcharts/apexcharts.min.js'
import '../../public/assets/js/sales-dashboard.js'
import '../../public/assets/js/custom.js'

export default function Sales(){
    return(
 
 
<>
        <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
          <div>
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <a href="javascript:void(0);">Dashboards</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Sales
              </li>
            </ol>
            <h1 className="page-title fw-medium fs-18 mb-0">Sales Dashboard</h1>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-text bg-white border">
                  {" "}
                  <i className="ri-calendar-line" />{" "}
                </div>
                <input
                  type="text"
                  className="form-control breadcrumb-input"
                  id="daterange"
                  placeholder="Search By Date Range"
                />
              </div>
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
        </div>
        {/* End::page-header */}
        {/* Start:: row-1 */}
        <div className="row">
          <div className="col-xl-8">
            <div className="row">
              <div className="col-xxl-3 col-xl-6">
                <div className="card custom-card overflow-hidden main-content-card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-2 gap-1 flex-xxl-nowrap flex-wrap">
                      <div>
                        <span className="text-muted d-block mb-1 text-nowrap">
                          Total Products
                        </span>
                        <h4 className="fw-medium mb-0">854</h4>
                      </div>
                      <div className="lh-1">
                        <span className="avatar avatar-md avatar-rounded bg-primary">
                          <i className="ti ti-shopping-cart fs-5" />
                        </span>
                      </div>
                    </div>
                    <div className="text-muted fs-13">
                      Increased By{" "}
                      <span className="text-success">
                        2.56%
                        <i className="ti ti-arrow-narrow-up fs-16" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-6">
                <div className="card custom-card overflow-hidden main-content-card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-2 gap-1 flex-xxl-nowrap flex-wrap">
                      <div>
                        <span className="text-muted d-block mb-1 text-nowrap">
                          Total Users
                        </span>
                        <h4 className="fw-medium mb-0">31,876</h4>
                      </div>
                      <div className="lh-1">
                        <span className="avatar avatar-md avatar-rounded bg-primary1">
                          <i className="ti ti-users fs-5" />
                        </span>
                      </div>
                    </div>
                    <div className="text-muted fs-13">
                      Increased By{" "}
                      <span className="text-success">
                        0.34%
                        <i className="ti ti-arrow-narrow-up fs-16" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-6">
                <div className="card custom-card overflow-hidden main-content-card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-2 gap-1 flex-xxl-nowrap flex-wrap">
                      <div>
                        <span className="text-muted d-block mb-1 text-nowrap">
                          Total Revenue
                        </span>
                        <h4 className="fw-medium mb-0">$34,241</h4>
                      </div>
                      <div className="lh-1">
                        <span className="avatar avatar-md avatar-rounded bg-primary2">
                          <i className="ti ti-currency-dollar fs-5" />
                        </span>
                      </div>
                    </div>
                    <div className="text-muted fs-13">
                      Increased By{" "}
                      <span className="text-success">
                        7.66%
                        <i className="ti ti-arrow-narrow-up fs-16" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-6">
                <div className="card custom-card overflow-hidden main-content-card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-2 gap-1 flex-xxl-nowrap flex-wrap">
                      <div>
                        <span className="text-muted d-block mb-1 text-nowrap">
                          Total Sales
                        </span>
                        <h4 className="fw-medium mb-0">1,76,586</h4>
                      </div>
                      <div className="lh-1">
                        <span className="avatar avatar-md avatar-rounded bg-primary3">
                          <i className="ti ti-chart-bar fs-5" />
                        </span>
                      </div>
                    </div>
                    <div className="text-muted fs-13">
                      Decreased By{" "}
                      <span className="text-danger">
                        0.74%
                        <i className="ti ti-arrow-narrow-down fs-16" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-8 col-xl-6">
                <div className="card custom-card">
                  <div className="card-header justify-content-between">
                    <div className="card-title">Sales Overview</div>
                    <div className="dropdown">
                      <a
                        href="javascript:void(0);"
                        className="btn btn-sm btn-light text-muted dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="true"
                      >
                        {" "}
                        Sort By
                      </a>
                      <ul
                        className="dropdown-menu"
                        role="menu"
                        data-popper-placement="bottom-end"
                      >
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                          >
                            This Week
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                          >
                            Last Week
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                          >
                            This Month
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-body">
                    <div id="sales-overview" />
                  </div>
                </div>
              </div>
              <div className="col-xxl-4 col-xl-6">
                <div className="card custom-card overflow-hidden">
                  <div className="card-header pb-0 justify-content-between">
                    <div className="card-title">Order Statistics</div>
                    <div className="dropdown">
                      <a
                        aria-label="anchor"
                        href="javascript:void(0);"
                        className="btn btn-light btn-icons btn-sm text-muted"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fe fe-more-vertical" />
                      </a>
                      <ul className="dropdown-menu" role="menu">
                        <li className="border-bottom">
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                          >
                            Today
                          </a>
                        </li>
                        <li className="border-bottom">
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                          >
                            This Week
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                          >
                            Last Week
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-body py-4 px-3">
                    <div className="d-flex gap-3 mb-3 flex-wrap">
                      <div className="avatar avatar-md bg-primary-transparent">
                        <i className="ti ti-trending-up fs-5" />
                      </div>
                      <div className="flex-fill d-flex align-items-start justify-content-between flex-wrap">
                        <div>
                          <span className="fs-11 mb-1 d-block fw-medium">
                            TOTAL ORDERS
                          </span>
                          <div className="d-flex align-items-center justify-content-between">
                            <h4 className="mb-0 d-flex align-items-center flex-wrap">
                              3,736
                              <span className="text-success fs-12 ms-2 op-1">
                                <i className="ti ti-trending-up align-middle me-1" />
                                0.57%
                              </span>
                            </h4>
                          </div>
                        </div>
                        <a
                          href="javascript:void(0);"
                          className="text-success fs-12 text-decoration-underline"
                        >
                          Earnings ?
                        </a>
                      </div>
                    </div>
                    <div id="orders" className="my-2" />
                  </div>
                  <div className="card-footer border-top border-block-start-dashed">
                    <div className="d-grid">
                      <button className="btn btn-primary-ghost btn-wave fw-medium waves-effect waves-light table-icon">
                        Complete Statistics
                        <i className="ti ti-arrow-narrow-right ms-2 fs-16 d-inline-block" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="row">
              <div className="col-xl-12">
                <div className="card custom-card main-dashboard-banner overflow-hidden">
                  <div className="card-body p-4">
                    <div className="row justify-content-between">
                      <div className="col-xxl-7 col-xl-5 col-lg-5 col-md-5 col-sm-5">
                        <h4 className="mb-3 fw-medium text-fixed-white">
                          Upgrade to get more
                        </h4>
                        <p className="mb-4 text-fixed-white">
                          Maximize sales insights. Optimize performance. Achieve
                          success with pro.
                        </p>
                        <a
                          href="javascript:void(0);"
                          className="fw-medium text-fixed-white text-decoration-underline"
                        >
                          Upgrade To Pro
                          <i className="ti ti-arrow-narrow-right" />
                        </a>
                      </div>
                      <div className="col-xxl-4 col-xl-7 col-lg-7 col-md-7 col-sm-7 d-sm-block d-none text-end my-auto">
                        <img
                          src="../assets/images/media/media-86.png"
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-12">
                <div className="card custom-card overflow-hidden">
                  <div className="card-header justify-content-between">
                    <div className="card-title">Top Selling Categories</div>
                    <div className="dropdown">
                      <a
                        href="javascript:void(0);"
                        className="btn btn-sm btn-light text-muted dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="true"
                      >
                        {" "}
                        Sort By
                      </a>
                      <ul
                        className="dropdown-menu"
                        role="menu"
                        data-popper-placement="bottom-end"
                      >
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                          >
                            This Week
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                          >
                            Last Week
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="javascript:void(0);"
                          >
                            This Month
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="p-3 pb-0">
                      <div className="progress-stacked progress-sm mb-2 gap-1">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "25%" }}
                          aria-valuenow={25}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                        <div
                          className="progress-bar bg-primary1"
                          role="progressbar"
                          style={{ width: "15%" }}
                          aria-valuenow={15}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                        <div
                          className="progress-bar bg-primary2"
                          role="progressbar"
                          style={{ width: "15%" }}
                          aria-valuenow={25}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                        <div
                          className="progress-bar bg-primary3"
                          role="progressbar"
                          style={{ width: "25%" }}
                          aria-valuenow={35}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                        <div
                          className="progress-bar bg-secondary"
                          role="progressbar"
                          style={{ width: "20%" }}
                          aria-valuenow={35}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div>Overall Sales</div>
                        <div className="h6 mb-0">
                          <span className="text-success me-2 fs-11">
                            2.74%
                            <i className="ti ti-arrow-narrow-up" />
                          </span>
                          1,25,875
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table text-nowrap">
                        <tbody>
                          <tr>
                            <td>
                              <span className="fw-medium top-category-name one">
                                Clothing
                              </span>
                            </td>
                            <td>
                              <span className="fw-medium">31,245</span>
                            </td>
                            <td className="text-center">
                              <span className="text-muted fs-12">
                                25% Gross
                              </span>
                            </td>
                            <td className="text-end">
                              <span className="badge bg-success">
                                0.45% <i className="ti ti-trending-up" />
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span className="fw-medium top-category-name two">
                                Electronics
                              </span>
                            </td>
                            <td>
                              <span className="fw-medium">29,553</span>
                            </td>
                            <td className="text-center">
                              <span className="text-muted fs-12">
                                16% Gross
                              </span>
                            </td>
                            <td className="text-end">
                              <span className="badge bg-warning">
                                0.27% <i className="ti ti-trending-up" />
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span className="fw-medium top-category-name three">
                                Grocery
                              </span>
                            </td>
                            <td>
                              <span className="fw-medium">24,577</span>
                            </td>
                            <td className="text-center">
                              <span className="text-muted fs-12">
                                22% Gross
                              </span>
                            </td>
                            <td className="text-end">
                              <span className="badge bg-secondary">
                                0.63% <i className="ti ti-trending-up" />
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span className="fw-medium top-category-name four">
                                Automobiles
                              </span>
                            </td>
                            <td>
                              <span className="fw-medium">19,278</span>
                            </td>
                            <td className="text-center">
                              <span className="text-muted fs-12">
                                18% Gross
                              </span>
                            </td>
                            <td className="text-end">
                              <span className="badge bg-primary1">
                                1.14% <i className="ti ti-trending-down" />
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="border-bottom-0">
                              <span className="fw-medium top-category-name five">
                                others
                              </span>
                            </td>
                            <td className="border-bottom-0">
                              <span className="fw-medium">15,934</span>
                            </td>
                            <td className="text-center border-bottom-0">
                              <span className="text-muted fs-12">
                                15% Gross
                              </span>
                            </td>
                            <td className="text-end border-bottom-0">
                              <span className="badge bg-primary">
                                3.87% <i className="ti ti-trending-up" />
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End:: row-1 */}
        {/* Start:: row-2 */}
        <div className="row">
          <div className="col-xxl-3 col-xl-6">
            <div className="card custom-card overflow-hidden">
              <div className="card-header justify-content-between">
                <div className="card-title">Latest Transactions</div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-light btn-wave btn-sm text-muted"
                >
                  View All
                  <i className="ti ti-arrow-narrow-right ms-1" />
                </a>
              </div>
              <div className="card-body p-0 pt-1">
                <div className="table-responsive">
                  <table className="table text-nowrap">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="lh-1">
                              <span className="avatar avatar-sm">
                                <img
                                  src="../assets/images/ecommerce/jpg/4.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="fw-medium">SwiftBuds</div>
                          </div>
                        </td>
                        <td>
                          <span className="fw-medium">$39.99</span>
                        </td>
                        <td>
                          <span className="badge bg-primary">Success</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="lh-1">
                              <span className="avatar avatar-sm">
                                <img
                                  src="../assets/images/ecommerce/jpg/6.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="fw-medium">CozyCloud Pillow</div>
                          </div>
                        </td>
                        <td>
                          <span className="fw-medium">$19.95</span>
                        </td>
                        <td>
                          <span className="badge bg-primary1">Pending</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="lh-1">
                              <span className="avatar avatar-sm">
                                <img
                                  src="../assets/images/ecommerce/jpg/3.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="fw-medium">AquaGrip Bottle</div>
                          </div>
                        </td>
                        <td>
                          <span className="fw-medium">$9.99</span>
                        </td>
                        <td>
                          <span className="badge bg-primary2">Failed</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="lh-1">
                              <span className="avatar avatar-sm">
                                <img
                                  src="../assets/images/ecommerce/jpg/1.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="fw-medium">GlowLite Lamp</div>
                          </div>
                        </td>
                        <td>
                          <span className="fw-medium">$24.99</span>
                        </td>
                        <td>
                          <span className="badge bg-primary3">Success</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="lh-1">
                              <span className="avatar avatar-sm">
                                <img
                                  src="../assets/images/ecommerce/jpg/2.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="fw-medium">Bitvitamin</div>
                          </div>
                        </td>
                        <td>
                          <span className="fw-medium">$26.45</span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">Success</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-bottom-0">
                          <div className="d-flex align-items-center gap-2">
                            <div className="lh-1">
                              <span className="avatar avatar-sm">
                                <img
                                  src="../assets/images/ecommerce/jpg/5.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="fw-medium">FitTrack</div>
                          </div>
                        </td>
                        <td className="border-bottom-0">
                          <span className="fw-medium">$49.95</span>
                        </td>
                        <td className="border-bottom-0">
                          <span className="badge bg-warning">Success</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-6">
            <div className="card custom-card">
              <div className="card-header justify-content-between">
                <div className="card-title">Recent Activity</div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-light btn-wave btn-sm text-muted waves-effect waves-light"
                >
                  View All
                </a>
              </div>
              <div className="card-body">
                <ul className="list-unstyled recent-activity-list">
                  <li>
                    <div>
                      <div>
                        <div className="fw-medium fs-14">John Doe</div>
                        <span className="fs-12 activity-time">12 Hrs</span>
                      </div>
                      <span className="d-block text-muted">
                        Updated the product description for{" "}
                        <span className="text-primary fw-medium">Widget X</span>
                        .
                      </span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <div className="fw-medium fs-14">Jane Smith</div>
                        <span className="fs-12 activity-time">4:32pm</span>
                      </div>
                      <span className="d-block text-muted">
                        added a{" "}
                        <span className="fw-medium text-dark">new user</span>{" "}
                        with username{" "}
                        <span className="fw-medium text-primary1">
                          janesmith89.
                        </span>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <div className="fw-medium fs-14">Michael Brown</div>
                        <span className="fs-12 activity-time">11:45am</span>
                      </div>
                      <span className="d-block text-muted">
                        Changed the status of order{" "}
                        <a
                          href="javascript:void(0);"
                          className="fw-medium text-dark text-decoration-underline"
                        >
                          #12345
                        </a>{" "}
                        to{" "}
                        <span className="fw-medium text-primary2">
                          Shipped.
                        </span>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <div className="fw-medium fs-14">David Wilson</div>
                        <span className="fs-12 activity-time">9:27am</span>
                      </div>
                      <span className="d-block text-muted">
                        added{" "}
                        <span className="fw-medium text-primary3">
                          John Smith
                        </span>{" "}
                        to academy group this day.
                      </span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <div className="fw-medium fs-14">Robert Jackson</div>
                        <span className="fs-12 activity-time">8:56pm</span>
                      </div>
                      <span className="d-block text-muted">
                        added a comment to the task{" "}
                        <span className="fw-medium text-secondary">
                          Update website layout.
                        </span>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-6">
            <div className="card custom-card">
              <div className="card-header justify-content-between">
                <div className="card-title">Sales Statistics</div>
                <div className="dropdown">
                  <a
                    href="javascript:void(0);"
                    className="btn btn-sm btn-light text-muted dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="true"
                  >
                    {" "}
                    Sort By
                  </a>
                  <ul
                    className="dropdown-menu"
                    role="menu"
                    data-popper-placement="bottom-end"
                  >
                    <li>
                      <a className="dropdown-item" href="javascript:void(0);">
                        This Week
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="javascript:void(0);">
                        Last Week
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="javascript:void(0);">
                        This Month
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex flex-wrap gap-2 justify-content-between flex-fill pb-3">
                  <div className="py-3 px-4 rounded border border-dashed bg-light">
                    <span>Total Sales</span>
                    <p className="fw-medium fs-14 mb-0">$3.478B</p>
                  </div>
                  <div className="py-3 px-4 rounded border border-dashed bg-light">
                    <span>This Year</span>
                    <p className="text-success fw-medium fs-14 mb-0">
                      4,25,349
                    </p>
                  </div>
                  <div className="py-3 px-4 rounded border border-dashed bg-light">
                    <span>Last Year</span>
                    <p className="text-danger fw-medium fs-14 mb-0">3,41,622</p>
                  </div>
                </div>
                <div id="sales-statistics" />
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-6">
            <div className="card custom-card overflow-hidden">
              <div className="card-header pb-0 justify-content-between">
                <div className="card-title">Overall Statistics</div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-light btn-wave btn-sm text-muted waves-effect waves-light"
                >
                  View All
                </a>
              </div>
              <div className="card-body">
                <ul className="list-group activity-feed">
                  <li className="list-group-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="lh-1">
                        <p className="mb-2 fs-13 text-muted">Total Expenses</p>
                        <h6 className="fw-medium mb-0">
                          $134,032
                          <span className="fs-12 text-success ms-2 fw-normal d-inline-block">
                            0.45%
                            <i className="ti ti-trending-up ms-1" />
                          </span>
                        </h6>
                      </div>
                      <div className="text-end">
                        <div id="line-graph1" />
                        <a href="javascript:void(0);" className="fs-12">
                          <span>See more</span>
                          <span className="table-icon">
                            <i className="ms-1 d-inline-block ri-arrow-right-line" />
                          </span>
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="lh-1">
                        <p className="mb-2 fs-13 text-muted">General Leads</p>
                        <h6 className="fw-medium mb-0">
                          74,354
                          <span className="fs-12 text-danger ms-2 fw-normal d-inline-block">
                            3.84%
                            <i className="ti ti-trending-down ms-1" />
                          </span>
                        </h6>
                      </div>
                      <div className="text-end">
                        <div id="line-graph2" />
                        <a href="javascript:void(0);" className="fs-12">
                          <span>See more</span>
                          <span className="table-icon">
                            <i className="ms-1 d-inline-block ri-arrow-right-line" />
                          </span>
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="lh-1">
                        <p className="mb-2 fs-13 text-muted">Churn Rate</p>
                        <h6 className="fw-medium mb-0">
                          6.02%
                          <span className="fs-12 text-success ms-2 fw-normal d-inline-block">
                            0.72%
                            <i className="ti ti-trending-up ms-1" />
                          </span>
                        </h6>
                      </div>
                      <div className="text-end">
                        <div id="line-graph3" />
                        <a href="javascript:void(0);" className="fs-12">
                          <span>See more</span>
                          <span className="table-icon">
                            <i className="ms-1 d-inline-block ri-arrow-right-line" />
                          </span>
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="lh-1">
                        <p className="mb-2 fs-13 text-muted">New Users</p>
                        <h6 className="fw-medium mb-0">
                          7,893
                          <span className="fs-12 text-success ms-2 fw-normal d-inline-block">
                            11.05%
                            <i className="ti ti-trending-up ms-1" />
                          </span>
                        </h6>
                      </div>
                      <div className="text-end">
                        <div id="line-graph4" />
                        <a href="javascript:void(0);" className="fs-12">
                          <span>See more</span>
                          <span className="table-icon">
                            <i className="ms-1 d-inline-block ri-arrow-right-line" />
                          </span>
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="lh-1">
                        <p className="mb-2 fs-13 text-muted">Returning Users</p>
                        <h6 className="fw-medium mb-0">
                          3,258
                          <span className="fs-12 text-success ms-2 fw-normal d-inline-block">
                            1.69%
                            <i className="ti ti-trending-up ms-1" />
                          </span>
                        </h6>
                      </div>
                      <div className="text-end">
                        <div id="line-graph5" />
                        <a href="javascript:void(0);" className="fs-12">
                          <span>See more</span>
                          <span className="table-icon">
                            <i className="ms-1 d-inline-block ri-arrow-right-line" />
                          </span>
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* End:: row-2 */}
        {/* Start:: row-3 */}
        <div className="row">
          <div className="col-xl-9">
            <div className="card custom-card overflow-hidden">
              <div className="card-header justify-content-between">
                <div className="card-title">Recent Orders</div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-light btn-wave btn-sm text-muted waves-effect waves-light"
                >
                  View All
                </a>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table text-nowrap">
                    <thead>
                      <tr>
                        <th className="text-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxNoLabel1"
                            defaultValue=""
                            aria-label="..."
                          />
                        </th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-center">Amount</th>
                        <th>Status</th>
                        <th>Date Ordered</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxNoLabel02"
                            defaultValue=""
                            aria-label="..."
                            defaultChecked=""
                          />
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="lh-1">
                              <span className="avatar avatar-sm">
                                <img
                                  src="../assets/images/faces/1.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div>
                              <span className="d-block fw-medium">
                                Elena smith
                              </span>
                              <span className="d-block fs-11 text-muted">
                                elenasmith387@gmail.com
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>All-Purpose Cleaner</td>
                        <td className="text-center">3</td>
                        <td className="text-center">$9.99</td>
                        <td>
                          <span className="badge bg-primary-transparent">
                            In Progress
                          </span>
                        </td>
                        <td>03,Sep 2024</td>
                        <td>
                          <div className="btn-list">
                            <button className="btn btn-sm btn-icon btn-success-light">
                              <i className="ri-pencil-line" />
                            </button>
                            <button className="btn btn-sm btn-icon btn-danger-light">
                              <i className="ri-delete-bin-line" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxNoLabel12"
                            defaultValue=""
                            aria-label="..."
                          />
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="lh-1">
                              <span className="avatar avatar-sm">
                                <img
                                  src="../assets/images/faces/12.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div>
                              <span className="d-block fw-medium">
                                Nelson Gold
                              </span>
                              <span className="d-block fs-11 text-muted">
                                noahrussell556@gmail.com
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>Kitchen Knife Set</td>
                        <td className="text-center">4</td>
                        <td className="text-center">$49.99</td>
                        <td>
                          <span className="badge bg-primary1-transparent">
                            Pending
                          </span>
                        </td>
                        <td>26,Jul 2024</td>
                        <td>
                          <div className="btn-list">
                            <button className="btn btn-sm btn-icon btn-success-light">
                              <i className="ri-pencil-line" />
                            </button>
                            <button className="btn btn-sm btn-icon btn-danger-light">
                              <i className="ri-delete-bin-line" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxNoLabel42"
                            defaultValue=""
                            aria-label="..."
                            defaultChecked=""
                          />
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="lh-1">
                              <span className="avatar avatar-sm">
                                <img
                                  src="../assets/images/faces/6.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div>
                              <span className="d-block fw-medium">
                                Grace Mitchell
                              </span>
                              <span className="d-block fs-11 text-muted">
                                gracemitchell79@gmail.com
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>Velvet Throw Blanket</td>
                        <td className="text-center">2</td>
                        <td className="text-center">$29.99</td>
                        <td>
                          <span className="badge bg-primary2-transparent">
                            Success
                          </span>
                        </td>
                        <td>12,May 2024</td>
                        <td>
                          <div className="btn-list">
                            <button className="btn btn-sm btn-icon btn-success-light">
                              <i className="ri-pencil-line" />
                            </button>
                            <button className="btn btn-sm btn-icon btn-danger-light">
                              <i className="ri-delete-bin-line" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxNoLabel32"
                            defaultValue=""
                            aria-label="..."
                            defaultChecked=""
                          />
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="lh-1">
                              <span className="avatar avatar-sm">
                                <img
                                  src="../assets/images/faces/14.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div>
                              <span className="d-block fw-medium">
                                Spencer Robin
                              </span>
                              <span className="d-block fs-11 text-muted">
                                leophillips124@gmail.com
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>Aromatherapy Diffuser</td>
                        <td className="text-center">4</td>
                        <td className="text-center">$19.99</td>
                        <td>
                          <span className="badge bg-primary2-transparent">
                            Success
                          </span>
                        </td>
                        <td>15,Aug 2024</td>
                        <td>
                          <div className="btn-list">
                            <button className="btn btn-sm btn-icon btn-success-light">
                              <i className="ri-pencil-line" />
                            </button>
                            <button className="btn btn-sm btn-icon btn-danger-light">
                              <i className="ri-delete-bin-line" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxNoLabel2"
                            defaultValue=""
                            aria-label="..."
                          />
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="lh-1">
                              <span className="avatar avatar-sm">
                                <img
                                  src="../assets/images/faces/3.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div>
                              <span className="d-block fw-medium">
                                Chloe Lewis
                              </span>
                              <span className="d-block fs-11 text-muted">
                                chloelewis67@gmail.com
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>Insulated Water Bottle</td>
                        <td className="text-center">2</td>
                        <td className="text-center">$14.99</td>
                        <td>
                          <span className="badge bg-primary3-transparent">
                            Pending
                          </span>
                        </td>
                        <td>11,Oct 2024</td>
                        <td>
                          <div className="btn-list">
                            <button className="btn btn-sm btn-icon btn-success-light">
                              <i className="ri-pencil-line" />
                            </button>
                            <button className="btn btn-sm btn-icon btn-danger-light">
                              <i className="ri-delete-bin-line" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="card custom-card">
              <div className="card-header justify-content-between">
                <div className="card-title">Sales By Country</div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-light btn-wave btn-sm text-muted waves-effect waves-light"
                >
                  View All
                </a>
              </div>
              <div className="card-body">
                <ul className="list-unstyled sales-country-list">
                  <li>
                    <div className="d-flex align-items-start gap-3">
                      <div className="lh-1">
                        <span className="avatar avatar-sm p-1 bg-light border">
                          <img
                            src="../assets/images/flags/us_flag.jpg"
                            alt=""
                          />
                        </span>
                      </div>
                      <div className="flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="d-block fw-medium mb-2 lh-1">
                            United States
                          </span>
                          <span className="fs-14 fw-medium d-block lh-1">
                            31,672
                          </span>
                        </div>
                        <div
                          className="progress progress-md p-1"
                          role="progressbar"
                          aria-valuenow={90}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            style={{ width: "90%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex align-items-start gap-3">
                      <div className="lh-1">
                        <span className="avatar avatar-sm p-1 bg-light border">
                          <img
                            src="../assets/images/flags/italy_flag.jpg"
                            alt=""
                          />
                        </span>
                      </div>
                      <div className="flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="d-block fw-medium mb-2 lh-1">
                            Italy
                          </span>
                          <span className="fs-14 fw-medium d-block lh-1">
                            29,557
                          </span>
                        </div>
                        <div
                          className="progress progress-md p-1"
                          role="progressbar"
                          aria-valuenow={85}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="progress-bar bg-primary1 progress-bar-striped progress-bar-animated"
                            style={{ width: "85%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex align-items-start gap-3">
                      <div className="lh-1">
                        <span className="avatar avatar-sm p-1 bg-light border">
                          <img
                            src="../assets/images/flags/spain_flag.jpg"
                            alt=""
                          />
                        </span>
                      </div>
                      <div className="flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="d-block fw-medium mb-2 lh-1">
                            Spain
                          </span>
                          <span className="fs-14 fw-medium d-block lh-1">
                            24,562
                          </span>
                        </div>
                        <div
                          className="progress progress-md p-1"
                          role="progressbar"
                          aria-valuenow={80}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="progress-bar bg-primary2 progress-bar-striped progress-bar-animated"
                            style={{ width: "80%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex align-items-start gap-3">
                      <div className="lh-1">
                        <span className="avatar avatar-sm p-1 bg-light border">
                          <img
                            src="../assets/images/flags/uae_flag.jpg"
                            alt=""
                          />
                        </span>
                      </div>
                      <div className="flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="d-block fw-medium mb-2 lh-1">
                            Uae
                          </span>
                          <span className="fs-14 fw-medium d-block lh-1">
                            21,532
                          </span>
                        </div>
                        <div
                          className="progress progress-md p-1"
                          role="progressbar"
                          aria-valuenow={75}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="progress-bar bg-primary3 progress-bar-striped progress-bar-animated"
                            style={{ width: "75%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex align-items-start gap-3">
                      <div className="lh-1">
                        <span className="avatar avatar-sm p-1 bg-light border">
                          <img
                            src="../assets/images/flags/argentina_flag.jpg"
                            alt=""
                          />
                        </span>
                      </div>
                      <div className="flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="d-block fw-medium mb-2 lh-1">
                            Argentina
                          </span>
                          <span className="fs-14 fw-medium d-block lh-1">
                            18,753
                          </span>
                        </div>
                        <div
                          className="progress progress-md p-1"
                          role="progressbar"
                          aria-valuenow={70}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="progress-bar bg-secondary progress-bar-striped progress-bar-animated"
                            style={{ width: "70%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex align-items-start gap-3">
                      <div className="lh-1">
                        <span className="avatar avatar-sm p-1 bg-light border">
                          <img
                            src="../assets/images/flags/china_flag.jpg"
                            alt=""
                          />
                        </span>
                      </div>
                      <div className="flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="d-block fw-medium mb-2 lh-1">
                            China
                          </span>
                          <span className="fs-14 fw-medium d-block lh-1">
                            12,342
                          </span>
                        </div>
                        <div
                          className="progress progress-md p-1"
                          role="progressbar"
                          aria-valuenow={65}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="progress-bar bg-info progress-bar-striped progress-bar-animated"
                            style={{ width: "65%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex align-items-start gap-3">
                      <div className="lh-1">
                        <span className="avatar avatar-sm p-1 bg-light border">
                          <img
                            src="../assets/images/flags/french_flag.jpg"
                            alt=""
                          />
                        </span>
                      </div>
                      <div className="flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="d-block fw-medium mb-2 lh-1">
                            French
                          </span>
                          <span className="fs-14 fw-medium d-block lh-1">
                            15,533
                          </span>
                        </div>
                        <div
                          className="progress progress-md p-1"
                          role="progressbar"
                          aria-valuenow={60}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="progress-bar bg-warning progress-bar-striped progress-bar-animated"
                            style={{ width: "60%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        </>

    )

}