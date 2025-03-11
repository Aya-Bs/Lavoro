import { useState } from "react"

const AdminDashboardTwo = () => {
  const [requests, setRequests] = useState([
    {
      id: "1",
      name: "Socrates Itumay",
      avatar: "/assets/images/faces/2.jpg",
      message: "want's to add you as a friend",
    },
    {
      id: "2",
      name: "Ryan Gercia",
      avatar: "/assets/images/faces/3.jpg",
      message: "want's to add you as a friend",
    },
    {
      id: "3",
      name: "Prax Bhav",
      avatar: "/assets/images/faces/10.jpg",
      message: "want's to add you as a friend",
    },
    {
      id: "4",
      name: "Jackie Chen",
      avatar: "/assets/images/faces/12.jpg",
      message: "want's to add you as a friend",
    },
    {
      id: "5",
      name: "Samantha Sam",
      avatar: "/assets/images/faces/5.jpg",
      message: "want's to add you as a friend",
    },
    {
      id: "6",
      name: "Robert Lewis",
      avatar: "/assets/images/faces/15.jpg",
      message: "want's to add you as a friend",
    },
  ])

  const [employees, setEmployees] = useState([
    {
      id: "1",
      firstName: "Richard",
      lastName: "Dom",
      avatar: "/assets/images/faces/1.jpg",
      email: "richard@example.com",
      role: "Team Leader",
      phoneNumber: "+0987654321"
    },
    {
      id: "2",
      firstName: "Kakashra",
      lastName: "Sri",
      avatar: "/assets/images/faces/2.jpg",
      email: "kakashra@example.com",
      role: "Web Developer",
      phoneNumber: "+0986548761"
    },
    {
      id: "3",
      firstName: "Nikki",
      lastName: "Jey",
      avatar: "/assets/images/faces/3.jpg",
      email: "nikki@example.com",
      role: "Project Manager",
      phoneNumber: "+0986548787"
    },
    {
      id: "4",
      firstName: "Sasukey",
      lastName: "Ahuhi",
      avatar: "/assets/images/faces/4.jpg",
      email: "sasukey@example.com",
      role: "Project Manager",
      phoneNumber: "+0986548788"
    },
    {
      id: "5",
      firstName: "Xiong",
      lastName: "Yu",
      avatar: "/assets/images/faces/5.jpg",
      email: "xiong@example.com",
      role: "UI Developer",
      phoneNumber: "+0986548988"
    },
    {
      id: "6",
      firstName: "Arifa",
      lastName: "Zed",
      avatar: "/assets/images/faces/6.jpg",
      email: "arifa@example.com",
      role: "Team Member",
      phoneNumber: "+0986548985"
    },
    {
      id: "7",
      firstName: "Jennifer",
      lastName: "Tab",
      avatar: "/assets/images/faces/7.jpg",
      email: "jennifer@example.com",
      role: "Project Manager",
      phoneNumber: "+09865489987"
    }
  ])

  const handleAccept = (id) => {
    // Handle accept logic here
    setRequests(requests.filter((request) => request.id !== id))
  }

  const handleReject = (id) => {
    // Handle reject logic here
    setRequests(requests.filter((request) => request.id !== id))
  }

  const handleEditEmployee = (id) => {
    // Handle edit employee logic
    console.log("Edit employee with ID:", id)
  }

  const handleDeleteEmployee = (id) => {
    // Handle delete employee logic
    setEmployees(employees.filter(employee => employee.id !== id))
  }

  return (
    <div className="container-fluid">
      {/* Requests Section */}
      <div className="card custom-card mb-4">
        <div className="card-header justify-content-between">
          <div className="card-title">Requests</div>
          <a href="#" className="btn btn-light btn-sm text-muted">
            View All
          </a>
        </div>
        <div className="card-body">
          <ul className="list-unstyled personal-favourite mb-0">
            {requests.map((request) => (
              <li key={request.id}>
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <span className="avatar avatar-sm">
                      <img src={request.avatar || "/placeholder.svg"} alt={request.name} />
                    </span>
                  </div>
                  <div className="flex-fill text-truncate">
                    <span className="fw-medium d-block mb-0">{request.name}</span>
                    <span className="text-muted d-block fs-12 w-75 text-truncate">{request.message}</span>
                  </div>
                  <div className="btn-list text-nowrap">
                    <button
                      aria-label="button"
                      type="button"
                      className="btn btn-icon btn-sm btn-success-light"
                      onClick={() => handleAccept(request.id)}
                    >
                      <i className="ri-check-line"></i>
                    </button>
                    <button
                      aria-label="button"
                      type="button"
                      className="btn btn-icon btn-sm btn-danger-light me-0"
                      onClick={() => handleReject(request.id)}
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Employee Directory Section */}
      <div className="card custom-card">
        <div className="card-header justify-content-between">
          <div className="card-title">
            Employee Directory
          </div>
          <div className="d-flex flex-wrap">
            <div className="me-3 my-1">
              <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label="search" />
            </div>
            <div className="dropdown my-1">
              <a href="#" className="btn btn-sm btn-primary" data-bs-toggle="dropdown" aria-expanded="false">
                Sort By<i className="ri-arrow-down-s-line align-middle ms-1"></i>
              </a>
              <ul className="dropdown-menu" role="menu">
                <li><a className="dropdown-item" href="#">New</a></li>
                <li><a className="dropdown-item" href="#">Popular</a></li>
                <li><a className="dropdown-item" href="#">Relevant</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover text-nowrap table-bordered">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src={employee.avatar || "/placeholder.svg"} className="avatar avatar-sm me-2" alt={employee.firstName} />
                        <span>{employee.firstName}</span>
                      </div>
                    </td>
                    <td>{employee.lastName}</td>
                    <td>
                      <a href={`mailto:${employee.email}`}>{employee.email}</a>
                    </td>
                    <td>{employee.role}</td>
                    <td>{employee.phoneNumber}</td>
                    <td>
                      <div className="btn-list">
                        <button 
                          type="button"
                          className="btn btn-icon btn-sm btn-primary-light" 
                          onClick={() => handleEditEmployee(employee.id)}
                        >
                          <i className="ri-pencil-line"></i>
                        </button>
                        <button 
                          type="button"
                          className="btn btn-icon btn-sm btn-danger-light ms-2" 
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <i className="ri-delete-bin-7-line"></i>
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
              Showing {employees.length} Entries <i className="bi bi-arrow-right ms-2 fw-medium"></i>
            </div>
            <div className="ms-auto">
              <nav aria-label="Page navigation" className="pagination-style-4">
                <ul className="pagination mb-0">
                  <li className="page-item disabled">
                    <a className="page-link" href="#">
                      Prev
                    </a>
                  </li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
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
    </div>
  )
}

export default AdminDashboardTwo