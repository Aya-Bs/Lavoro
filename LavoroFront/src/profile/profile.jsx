import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UpdateProfile from "./updateProfile";
import ProfileSecurity from "./profileSecurity";




const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState(''); // To store the QR code URL
  const [showQRCode, setShowQRCode] = useState(false); // To toggle QR code display
  const [token, setToken] = useState(''); // To store the user's TOTP code
  const [message, setMessage] = useState(''); // To display messages to the user
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile-about-tab-pane")


  // Fetch user info on component mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 secondes de timeout
  
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
  
        if (response.data) {
          setUser(response.data);
        } else {
          navigate("/signin");
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate("/signin");
        }
      } finally {
        clearTimeout(timeout); // Annule le timeout si la requête réussit
        setLoading(false);
      }
    };
  
    fetchUserInfo();
  
    return () => clearTimeout(timeout); // Nettoie le timeout si le composant est démonté
  }, [navigate]);

  // Handle account deletion request
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:3000/profiles/request-delete",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("Profile delete request successful!");
        navigate("/profile");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        alert("You already sent a deletion request.");
      } else if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem('token');
        navigate("/signin");
      } else {
        console.error("Error deleting profile:", err);
        alert("Failed to delete profile.");
      }
    }
  };

  // Enable 2FA
  const handleEnable2FA = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:3000/profiles/enable-2fa",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setQrCodeUrl(response.data.qrCodeUrl);
      setShowQRCode(true);
    } catch (err) {
      console.error("Error enabling 2FA:", err);
    }
  };

  const handleVerify2FA = async () => {
    try {
      const authToken = localStorage.getItem('token'); // JWT token for authentication
      if (!authToken) {
        throw new Error("No token found");
      }
  
      const userProvidedToken = token; // Use the TOTP code from the input field
      console.log('Sending verify request with TOTP code:', userProvidedToken); // Log the TOTP code
  
      const response = await axios.post(
        "http://localhost:3000/profiles/verify-2fa",
        { token: userProvidedToken }, // Send the TOTP code, not the JWT token
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Use the JWT token for authentication
          },
          withCredentials: true,
        }
      );
  
      console.log('Verify response:', response.data); // Log the response
      setMessage(response.data.message);
    } catch (err) {
      console.error('Error verifying 2FA:', err); // Log the full error
      setMessage(err.response?.data?.error || "Error verifying 2FA");
    }
  };

  // Disable 2FA
  const handleDisable2FA = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:3000/profiles/disable-2fa",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error disabling 2FA");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    
      <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
        <div>
          <nav>
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Pages
                </a>
              </li>
               <span className="mx-1">→</span>

    <br />
    <br />
              <li className="breadcrumb-item active" aria-current="page">
                Profile
              </li>
            </ol>
          </nav>
          <h1 className="page-title fw-medium fs-18 mb-0">Profile</h1>
        </div>
        <div className="btn-list">
          <button className="btn btn-white btn-wave">
            <i className="ri-filter-3-line align-middle me-1 lh-1"></i> Filter
          </button>
          <button className="btn btn-primary btn-wave me-0">
            <i className="ri-share-forward-line me-1"></i> Share
          </button>
        </div>
      <div className="row">
        <div className="col-xl-12">
          <div className="card custom-card profile-card">
            <ProfileBanner />
            <div className="card-body pb-0 position-relative">
              <div className="row profile-content">
                <div className="col-xl-3">
                  <ProfileSidebar user={user}/>
                </div>
                <div className="col-xl-9">
                  <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  

    


)
}

// ProfileBanner Component
const ProfileBanner = () => {
return (
  <div className="profile-banner-img">
    <img src="/assets/images/media/media-3.jpg" className="card-img-top" alt="..." />
  </div>
)
}

// ProfileSidebar Component
const ProfileSidebar = ({user}) => {
return (
  <div className="card custom-card overflow-hidden border">
    <div className="card-body border-bottom border-block-end-dashed">
      <div className="text-center">
        <span className="avatar avatar-xxl avatar-rounded online mb-3">
        {user.image ? (
          <img
            src={`http://localhost:3000${user.image}`}
            alt="Profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "10px"
            }}
          />
        ) : (
          <p>No profile image uploaded.</p>
        )}
        </span>
        <h5 className="fw-semibold mb-1">{user.firstName}</h5>
        <h5 className="fw-semibold mb-1">{user.lastName}</h5>
        <span className="d-block fw-medium text-muted mb-2">{user.role?.RoleName}</span>
        <p className="fs-12 mb-0 text-muted">
          <span className="me-3">
            <i className="ri-building-line me-1 align-middle"></i>Hamburg
          </span>
          <span>
            <i className="ri-map-pin-line me-1 align-middle"></i>Germany
          </span>
        </p>
      </div>
    </div>
    
    <div className="p-3 pb-1 d-flex flex-wrap justify-content-between">
      <div className="fw-medium fs-15 text-primary1">Basic Info :</div>
    </div>
    <div className="card-body border-bottom border-block-end-dashed p-0">
      <ul className="list-group list-group-flush">
        <li className="list-group-item pt-2 border-0">
          <div>
            <span className="fw-medium me-2">Name :</span>
            <span className="text-muted">{user.firstName+" "+user.lastName}</span>
          </div>
        </li>
        <li className="list-group-item pt-2 border-0">
          <div>
            <span className="fw-medium me-2">Role :</span>
            <span className="text-muted">{user.role?.RoleName}</span>
          </div>
        </li>
        <li className="list-group-item pt-2 border-0">
          <div>
            <span className="fw-medium me-2">Email :</span>
            <span className="text-muted">{user.email}</span>
          </div>
        </li>
        <li className="list-group-item pt-2 border-0">
          <div>
            <span className="fw-medium me-2">Phone :</span>
            <span className="text-muted">+216  {user.phone_number}</span>
          </div>
        </li>
        <li className="list-group-item pt-2 border-0">
          <div>
            <span className="fw-medium me-2">Experience :</span>
            <span className="text-muted">10 Years</span>
          </div>
        </li>
        <li className="list-group-item pt-2 border-0">
          <div>
            <span className="fw-medium me-2">Age :</span>
            <span className="text-muted">28</span>
          </div>
        </li>
      </ul>
    </div>
    
    
  </div>
)
}

// ProfileTabs Component
const ProfileTabs = ({ activeTab, setActiveTab, user }) => {
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="card custom-card overflow-hidden border">
      <div className="card-body">
        <ul className="nav nav-tabs tab-style-6 mb-3 p-0" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link w-100 text-start ${activeTab === "profile-about-tab-pane" ? "active" : ""}`}
              id="profile-about-tab"
              onClick={() => handleTabClick("profile-about-tab-pane")}
              type="button"
              role="tab"
              aria-controls="profile-about-tab-pane"
              aria-selected={activeTab === "profile-about-tab-pane"}
            >
              About
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link w-100 text-start ${activeTab === "edit-profile-tab-pane" ? "active" : ""}`}
              id="edit-profile-tab"
              onClick={() => handleTabClick("edit-profile-tab-pane")}
              type="button"
              role="tab"
              aria-controls="edit-profile-tab-pane"
              aria-selected={activeTab === "edit-profile-tab-pane"}
            >
              Edit Profile
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link w-100 text-start ${activeTab === "security-tab-pane" ? "active" : ""}`}
              id="security-tab"
              onClick={() => handleTabClick("security-tab-pane")}
              type="button"
              role="tab"
              aria-controls="security-tab-pane"
              aria-selected={activeTab === "security-tab-pane"}
            >
              Security
            </button>
          </li>
        </ul>
        <div className="tab-content" id="profile-tabs">
          <div
            className={`tab-pane p-0 border-0 ${activeTab === "profile-about-tab-pane" ? "show active" : ""}`}
            id="profile-about-tab-pane"
            role="tabpanel"
            aria-labelledby="profile-about-tab"
            tabIndex={0}
          >
            <AboutTab user={user} />
          </div>
          <div
            className={`tab-pane p-0 border-0 ${activeTab === "edit-profile-tab-pane" ? "show active" : ""}`}
            id="edit-profile-tab-pane"
            role="tabpanel"
            aria-labelledby="edit-profile-tab"
            tabIndex={0}
          >
            {/* <EditProfileTab /> */}
            <UpdateProfile />
          </div>
          <div
            className={`tab-pane p-0 border-0 ${activeTab === "security-tab-pane" ? "show active" : ""}`}
            id="security-tab-pane"
            role="tabpanel"
            aria-labelledby="security-tab"
            tabIndex={0}
          >
            
            <ProfileSecurity user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

// AboutTab Component
const AboutTab = ({user}) => {
return (
  <ul className="list-group list-group-flush border rounded-3">
    <li className="list-group-item p-3">
      <span className="fw-medium fs-15 d-block mb-3">Profile Info :</span>
      <div className="text-muted">
        <p className="mb-3">
          <span className="avatar avatar-sm avatar-rounded text-primary p-1 bg-primary-transparent me-2">
            <i className="ri-mail-line align-middle fs-15"></i>
          </span>
          <span className="fw-medium text-default">Email : </span> {user.email}
        </p>
        <p className="mb-3">
          <span className="avatar avatar-sm avatar-rounded text-primary1 p-1 bg-primary1-transparent me-2">
            <i className="ri-map-pin-line align-middle fs-15"></i>
          </span>
          <span className="fw-medium text-default">Role : </span> {user.role?.RoleName}
        </p>
        <p className="mb-3">
          <span className="avatar avatar-sm avatar-rounded text-primary2 p-1 bg-primary2-transparent me-2">
            <i className="ri-building-line align-middle fs-15"></i>
          </span>
          <span className="fw-medium text-default">Location : </span> City, Country
        </p>
        <p className="mb-0">
          <span className="avatar avatar-sm avatar-rounded text-primary3 p-1 bg-primary3-transparent me-2">
            <i className="ri-phone-line align-middle fs-15"></i>
          </span>
          <span className="fw-medium text-default">Phone : </span> +216 {user.phone_number}
        </p>
      </div>
    </li>
    <li className="list-group-item p-3">
      <span className="fw-medium fs-15 d-block mb-3">Skills :</span>
      <div className="w-75">
        {[
          "Leadership",
          "Project Management",
          "Technical Proficiency",
          "Communication",
          "Team Building",
          "Problem-Solving",
          "Strategic Thinking",
          "Decision Making",
          "Adaptability",
          "Stakeholder Management",
          "Conflict Resolution",
          "Continuous Improvement",
        ].map((skill, index) => (
          <a href="#" onClick={(e) => e.preventDefault()} key={index}>
            <span className="badge bg-light text-muted m-1 border">{skill}</span>
          </a>
        ))}
      </div>
    </li>
    <li className="list-group-item p-3">
      <span className="fw-medium fs-15 d-block mb-3">Social Media :</span>
      <div className="d-flex align-items-center gap-5 flex-wrap">
        <div className="d-flex align-items-center gap-3 me-2 flex-wrap">
          <div>
            <span className="avatar avatar-md bg-primary">
              <i className="ri-github-line fs-16"></i>
            </span>
          </div>
          <div>
            <span className="d-block fw-medium text-primay">Github</span>
            <span className="text-muted fw-medium">github.com/spruko</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3 me-2 flex-wrap">
          <div>
            <span className="avatar avatar-md bg-primary1">
              <i className="ri-twitter-x-line fs-16"></i>
            </span>
          </div>
          <div>
            <span className="d-block fw-medium text-primay1">Twitter</span>
            <span className="text-muted fw-medium">twitter.com/spruko.me</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3 me-2 flex-wrap">
          <div>
            <span className="avatar avatar-md bg-primary2">
              <i className="ri-linkedin-line fs-16"></i>
            </span>
          </div>
          <div>
            <span className="d-block fw-medium text-primay2">Linkedin</span>
            <span className="text-muted fw-medium">linkedin.com/in/spruko</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div>
            <span className="avatar avatar-md bg-primary3">
              <i className="ri-briefcase-line fs-16"></i>
            </span>
          </div>
          <div>
            <span className="d-block fw-medium text-primay3">My Portfolio</span>
            <span className="text-muted fw-medium">spruko.com/</span>
          </div>
        </div>
      </div>
    </li>
  </ul>
)
}




export default Profile;