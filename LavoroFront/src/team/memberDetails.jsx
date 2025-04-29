import React, { useState, useEffect } from 'react';
import RelatedProfiles from './relatedProfiles';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const MemberDetails = () => {
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Initialisation ajoutée
    const { id } = useParams();

    //const staticId = "67ffe958abcdc7b19d4edb98"; // ID statique


    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000);

        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await axios.get("http://localhost:3000/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                if (!response.data) {
                    navigate("/signin");
                }
            } catch (err) {
                console.error("Error fetching user info:", err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate("/signin");
                }
            } finally {
                clearTimeout(timeout);
                setLoading(false);
            }
        };

        fetchUserInfo();
        return () => clearTimeout(timeout);
    }, [navigate]);

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:3000/teamMember/getTeamMember/${id}`, 
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );
                setMember(response.data.data);
                setLoading(true);
            } catch (error) {
                console.error('Error fetching member:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMember();
    }, [id]);
    
    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (!member) {
        return <div className="text-center py-4">Member not found</div>;
    }
    return (
        <div className="container-fluid">
            {/* Page Header */}
            <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
                <div>
                    <nav>
                        <ol className="breadcrumb mb-1">
                            <li className="breadcrumb-item"><a href="#!">Apps</a></li>
                            <li className="breadcrumb-item"><a href="#!">Jobs</a></li>
                            <li className="breadcrumb-item active">Candidate Details</li>
                        </ol>
                    </nav>
                    <h1 className="page-title fw-medium fs-18 mb-0">Candidate Details</h1>
                </div>
                <div className="btn-list">
                    <button className="btn btn-white btn-wave">
                        <i className="ri-filter-3-line align-middle me-1"></i> Filter
                    </button>
                    <button className="btn btn-primary btn-wave">
                        <i className="ri-share-forward-line me-1"></i> Share
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="row">
                <div className="col-xxl-8">
                    {/* Profile Card */}
                    <div className="card custom-card job-candidate-details">
                        <div className="candidate-bg-shape primary"></div>
                        <div className="card-body pt-5">
                            <div className="mb-3 lh-1 mt-4">
                                <span className="avatar avatar-xxl avatar-rounded">
                                    <img src={member.image.startsWith('http') ? 
                                        member.image : 
                                        `http://localhost:3000${member.image}`}
                                        alt={member.name} className="rounded-circle img-fluid shadow" />
                                </span>
                            </div>
                            <div className="d-flex gap-2 flex-wrap mb-3">
                                <div className="flex-fill">
                                    <h6 className="mb-1 fw-semibold">
                                        <a href="#!">{member.name} <i className="ri-check-line text-success fs-16" title="Verified candidate"></i></a>
                                    </h6>
                                    <p className="mb-0 text-muted">{member.role}</p>
                                    <div className="d-flex flex-wrap gap-2 align-items-center fs-12 text-muted">
                                        <p className="mb-0">Ratings: </p>
                                        <div className="min-w-fit-content ms-2">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < 4 ? "text-warning" : "text-muted"}>
                                                    <i className={i < 4 ? "ri-star-fill" : "ri-star-half-fill"}></i>
                                                </span>
                                            ))}
                                        </div>
                                        <a href="#!" className="ms-1 min-w-fit-content text-muted">
                                            <span>(245)</span>
                                            <span>Ratings</span>
                                        </a>
                                    </div>
                                    <div className="d-flex fs-14 mt-3 gap-2 flex-wrap">
                                        <div className="me-3">
                                            <p className="mb-1"><i className="ri-map-pin-line me-2 text-muted"></i>{member.location}</p>
                                            <p className="mb-0"><i className="ri-briefcase-line me-2 text-muted"></i>{member.experience} Experience</p>
                                        </div>
                                        <div className="me-3">
                                            <p className="mb-1"><i className="ri-currency-line me-2 text-muted"></i>Annual Pay: <span className="fw-medium">{member.salary}</span></p>
                                            <p className="mb-0"><i className="ri-graduation-cap-line me-2 text-muted"></i>{member.education}</p>
                                        </div>
                                        <div>
                                            <p className="mb-1"><i className="ri-mail-line me-2 text-muted"></i>Mail: <span className="fw-medium">{member.email}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-list ms-auto">
                                    <button className="btn btn-primary rounded-pill btn-wave">
                                        <i className="ri-download-cloud-line me-1"></i> Download CV
                                    </button>
                                    <button className="btn btn-primary1-light rounded-pill btn-wave">
                                        <i className="ri-heart-line lh-1 align-middle"></i> Add to wishlist
                                    </button>
                                    <button className="btn btn-icon btn-secondary-light rounded-pill btn-wave">
                                        <i className="ri-share-line fs-18 lh-1 align-middle"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex gap-3 align-items-center flex-wrap">
                                <h6 className="mb-0">Availability:</h6>
                                <div className="popular-tags d-flex gap-2 flex-wrap">
                                    <span className="badge rounded-pill fs-11 bg-info-transparent">
                                        <i className="ri-remote-control-line me-1"></i>workType
                                    </span>
                                    <span className="badge rounded-pill fs-11 bg-danger-transparent">
                                        <i className="ri-time-line me-1"></i>Immediate Joinee
                                    </span>
                                </div>
                                <a href="#!" className="ms-auto text-secondary px-2 py-1 rounded-pill fs-12 bg-secondary-transparent">
                                    <i className="ri-chat-1-line me-1"></i> Message Now
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="row">
                        <div className="col-xl-6">
                            <div className="card custom-card">
                                <div className="card-header">
                                    <div className="card-title">Skills</div>
                                </div>
                                <div className="card-body">
                                    <div className="popular-tags d-flex gap-2 flex-wrap">
                                        {member.skills.slice(0, 5).map(skill => (
                                            <span key={skill.id} className="badge rounded-pill bg-primary-transparent">
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="card custom-card">
                                <div className="card-header">
                                    <div className="card-title">Languages</div>
                                </div>
                                <div className="card-body">
                                    <p className="mb-0 fs-14">
                                        <span className="fw-medium me-2">Known: </span>
                                        {/* {member.languages.join(', ')} */}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="card custom-card">
                        <div className="card-header">
                            <div className="card-title">Candidate Profile Information</div>
                        </div>
                        <div className="card-body p-0 candidate-edu-timeline">
                            <div className="p-3 border-bottom">
                                <h5 className="fw-medium fs-17 d-flex align-items-center gap-2">
                                    <span className="avatar avatar-rounded bg-primary avatar-sm">
                                        <i className="ri-briefcase-4-line fs-13"></i>
                                    </span>
                                    Career Objective:
                                </h5>
                                <div className="ms-4 ps-3">
                                    <p className="op-9">Passionate {member.role} with a performance score of {member.performance_score}. <br />Completed {member.completed_tasks_count} tasks successfully.</p>
                                </div>
                            </div>
                            
                            {/* Education */}
                            <div className="p-3 border-bottom">
                                <h5 className="fw-medium fs-17 d-flex align-items-center gap-2">
                                    <span className="avatar avatar-rounded bg-primary avatar-sm">
                                        <i className="ri-graduation-cap-line fs-13"></i>
                                    </span>
                                    Education:
                                </h5>
                                <div className="ms-4 ps-3">
                                    <p className="fw-medium fs-14 mb-0">{member.education}</p>
                                    <p className="mb-3 text-muted">Dwayne University (2020 - 2024)</p>
                                </div>
                            </div>
                            
                            {/* Experience */}
                            <div className="p-3">
                                <h5 className="fw-medium fs-17 d-flex align-items-center gap-2">
                                    <span className="avatar avatar-rounded bg-primary avatar-sm">
                                        <i className="ri-briefcase-line fs-13"></i>
                                    </span>
                                    Experience:
                                </h5>
                                <div className="ms-4 ps-3">
                                    <p className="fw-medium fs-14 mb-0">{member.role} at InnovateZ Solutions</p>
                                    <p className="mb-2 text-muted">2019 - Present</p>
                                    <ul className="list-group border-0 list-bullets">
                                        <li className="border-0 py-1">Designed user interfaces for web applications</li>
                                        <li className="border-0 py-1">Collaborated with development teams</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="col-xxl-4">
                    {/* Tools Used */}
                    <div className="card custom-card overflow-hidden">
                        <div className="card-header">
                            <div className="card-title">Tools Used</div>
                        </div>
                        <div className="card-body d-flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5, 6].map(tool => (
                                <span key={tool} className="avatar avatar-rounded bg-primary-transparent border p-2">
                                    <img src={`../assets/images/company-logos/${tool}.png`} alt={`Tool ${tool}`} />
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Related Profiles */}
                    <RelatedProfiles teamId={member.teamId} currentMemberId={id} />


                    {/* Personal Information */}
                    <div className="card custom-card overflow-hidden">
                        <div className="card-header">
                            <div className="card-title">Personal Information</div>
                        </div>
                        <div className="card-body p-0">
                            <table className="table table-responsive">
                                <tbody>
                                    <tr>
                                        <td className="w-50 fw-medium">Full Name</td>
                                        <td>{member.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="w-50 fw-medium">Email</td>
                                        <td>{member.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="w-50 fw-medium">Phone</td>
                                        <td>{member.phone}</td>
                                    </tr>
                                    <tr>
                                        <td className="w-50 fw-medium">Location</td>
                                        <td>{member.location}</td>
                                    </tr>
                                    <tr>
                                        <td className="w-50 fw-medium">Experience</td>
                                        <td>{member.experience}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDetails;