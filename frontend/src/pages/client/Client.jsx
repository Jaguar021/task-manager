import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Client.css";
import Dashboard from "./dashboard/Dashboard";
import Project from "./projects/Project";
import NewProject from "./newproject/Newproject";
import Profile from "./profile/Profile";
import assets from "../../assets/assets";

const Client = () => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      navigate("/"); // If no token, redirect to login page
    } else {
      // If token exists, fetch user info from backend
      fetchUserInfo(token);
    }
  }, [navigate]);

  const fetchUserInfo = async (token) => {
    const res = await fetch("http://localhost:5000/user", {
      headers: {
        "x-auth-token": token, // Use x-auth-token here
      },
    });

    const data = await res.json();
    if (res.ok && data) {
      setUserInfo(data); // Set user info once fetched
    } else {
      console.log("Failed to fetch user info", data);
      localStorage.removeItem("token");
      navigate("/"); // Remove token and redirect if fetching fails
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login after logout
  };

  if (!userInfo) {
    return <div>Loading...</div>; // Loading state until user info is fetched
  }

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
              src={userInfo.image || assets.avatar_icon}
              alt="User Profile"
              className="profile-pic"
            />
            <button onClick={() => setSelectedOption("Profile")}>
              <img src={assets.edit} alt="Edit" />
            </button>

            <div className="profile-info">
              <h4 className="user-name">{userInfo.name || "Client"}</h4>
              <p className="user-role">{userInfo.role || "Client"}</p>
            </div>
          </div>

          <div className="options">
            <div className="up">
              <button
                className="sidebar-btn"
                onClick={() => setSelectedOption("Dashboard")}
              >
                <img src={assets.dashboard} alt="Dashboard" />
                Dashboard
              </button>
              <button
                className="sidebar-btn"
                onClick={() => setSelectedOption("Project")}
              >
                <img src={assets.project} alt="Projects" />
                Projects
              </button>
              <button
                className="sidebar-btn"
                onClick={() => setSelectedOption("New Project")}
              >
                <img src={assets.plus} alt="New Project" />
                New Project
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
          {selectedOption === "Project" && <Project />}
          {selectedOption === "New Project" && <NewProject />}
          {selectedOption === "Profile" && <Profile />}
        </div>
      </div>
    </div>
  );
};

export default Client;
