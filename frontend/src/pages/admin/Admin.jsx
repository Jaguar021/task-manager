import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import assets from "../../assets/assets";
import Profile from "./profile/Profile";
import Team from "./team/Team";
import Allprojects from "./allProjects/Allprojects";
import TeamLeaders from "./teamleaders/TeamLeaders";
import Dashboard from "./dashboard/Dashboard";

const Admin = () => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");
  const [adminProfile, setAdminProfile] = useState({
    image: assets.avatar_icon,
    name: 'Loading...',
    role: 'Admin',
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const token = userData?.token;

        const res = await fetch("http://localhost:5000/user", {
          headers: {
            "x-auth-token": token, // Use x-auth-token here
          },
        });

        const data = await res.json();
        if (res.ok) {
          setAdminProfile({
            image: data.image || assets.avatar_icon,
            name: data.name || 'Admin',
            role: 'Admin',
          });
        } else {
          console.error('Failed to fetch admin sidebar profile:', data.message);
        }
      } catch (err) {
        console.error('Error fetching admin sidebar profile:', err);
      }
    };

    fetchAdminInfo();
  }, []);

  return (
    <div className="layout">
      {/* Top Bar */}
      <div className="topbar">
        <h2 className="logo">Task Manager</h2>
      </div>

      <div className="container">
        {/* Sidebar */}
        <nav className="sidebar">
          {/* Profile Tile */}
          <div className="profile-tile">
            <img
              src={adminProfile.image}
              alt="User Profile"
              className="profile-pic"
            />
            <button onClick={() => setSelectedOption("Profile")}>
              <img src={assets.edit} alt="Edit" />
            </button>

            <div className="profile-info">
              <h4 className="user-name">{adminProfile.name}</h4>
              <p className="user-role">{adminProfile.role}</p>
            </div>
          </div>

          <div className="options">
            <div className="up">
              <button className="sidebar-btn" onClick={() => setSelectedOption("Dashboard")}>
                <img src={assets.dashboard} alt="Dashboard" />
                Dashboard
              </button>
              <button className="sidebar-btn" onClick={() => setSelectedOption("All Projects")}>
                <img src={assets.project} alt="Projects" />
                All Projects
              </button>
              <button className="sidebar-btn" onClick={() => setSelectedOption("Team")}>
                <img src={assets.employee} alt="New Project" />
                Team/Members
              </button>
              <button className="sidebar-btn" onClick={handleLogout}>
                <img src={assets.logout} alt="Logout" />
                Logout
              </button>
              <button className="sidebar-btn">
                <img src={assets.setting} alt="Settings" />
                Settings
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="main">
          {selectedOption === "Dashboard" && <Dashboard />}
          {selectedOption === "All Projects" && <Allprojects />}
          {selectedOption === "Team" && <Team />}
          {selectedOption === "Profile" && <Profile />}
        </div>
      </div>
    </div>
  );
};

export default Admin;
