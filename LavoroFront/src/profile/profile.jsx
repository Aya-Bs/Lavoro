import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users/me", { withCredentials: true });
        if (response.data) {
          setUser(response.data);
        } else {
          navigate("/auth");
        }
      } catch (err) {
        navigate("/auth");
      }
    };

    fetchUserInfo();
  }, [navigate]);


  const handleDeleteAccount = async () => {
    try {
      const response = await axios.post("http://localhost:3000/profiles/request-delete", {}, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
  
      if (response.status === 200) {
        alert("Profile delete request successfully!");
        navigate("/profile");
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert("You already sent a deletion request.");
      } else {
        console.error("Error delete request profile:", err);
        alert("Failed to delete request profile.");
      }
    }
  };


  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ 
        width: "350px", 
        padding: "20px", 
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", 
        borderRadius: "10px", 
        textAlign: "center", 
        fontFamily: "Arial, sans-serif", 
        backgroundColor: "#fff" 
      }}>
        <h1>User Profile</h1>
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

        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone Number:</strong> {user.phone_number}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
          <button 
            onClick={() => navigate("/update-profile")} 
            style={{ width: "100%", padding: "10px", border: "none", backgroundColor: "#007bff", color: "white", borderRadius: "5px", cursor: "pointer" }}
          >
            Update Profile
          </button>
          
          <form  method="POST" onSubmit={(e) => {
            e.preventDefault();
            if (window.confirm("Are you sure you want to request account deletion?")) {
              handleDeleteAccount();
            }
          }}>
            <button type="submit" style={{ width: "100%", padding: "10px", border: "none", backgroundColor: "#dc3545", color: "white", borderRadius: "5px", cursor: "pointer" }}>Delete Request</button>
          </form>
          
          <button 
            onClick={() => navigate("/home")} 
            style={{ width: "100%", padding: "10px", border: "none", backgroundColor: "#6c757d", color: "white", borderRadius: "5px", cursor: "pointer" }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;