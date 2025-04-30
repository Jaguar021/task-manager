import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Teamleader.css";
import assets from "../../assets/assets";
import Profile from "./profile/Profile";
import Employees from "./employees/Employees";
import Allprojects from "./allProjects/Allprojects";
import Dashboard from "./dashboard/Dashboard";

const Teamleader = () => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");
  const [teamLeader, setTeamLeader] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamLeaderData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const token = userData?.token;

        const res = await fetch("http://localhost:5000/user", {
          headers: {
            "x-auth-token": token, // Use x-auth-token here
          },
        });

        const data = await res.json();
        if (res.ok) {
          setTeamLeader(data);
        } else {
          console.error("Failed to fetch team leader data:", data.message);
        }
      } catch (err) {
        console.error("Error fetching team leader data:", err);
      }
    };

    fetchTeamLeaderData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

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
              src={teamLeader?.image || assets.avatar_icon}
              alt="User Profile"
              className="profile-pic"
            />
            <button onClick={() => setSelectedOption("Profile")}>
              <img src={assets.edit} alt="Edit" />
            </button>

            <div className="profile-info">
              <h4 className="user-name">{teamLeader?.name || "John Doe"}</h4>
              <p className="user-role">{teamLeader?.role || "Team Leader"}</p>
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
                onClick={() => setSelectedOption("All Projects")}
              >
                <img src={assets.project} alt="Projects" />
                All Projects
              </button>
              <button
                className="sidebar-btn"
                onClick={() => setSelectedOption("Employees")}
              >
                <img src={assets.employee} alt="Employees" />
                Employees
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
          {selectedOption === "Employees" && <Employees />}
          {selectedOption === "Profile" && <Profile />}
        </div>
      </div>
    </div>
  );
};

export default Teamleader;
