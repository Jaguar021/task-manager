import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Employee.css";
import Dashboard from "./dashboard/Dashboard";
import Task from "./tasks/Task";
import Profile from "./profile/Profile";
import assets from "../../assets/assets";

const Employee = () => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      navigate("/"); // Redirect to login if no token
    } else {
      fetchUserInfo(token);
    }
  }, [navigate]);

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/user", {
        headers: {
          "x-auth-token": token,
        },
      });

      const data = await res.json();
      if (res.ok && data) {
        setUserInfo(data);
      } else {
        console.log("Failed to fetch user info", data);
        localStorage.removeItem("userData");
        navigate("/");
      }
    } catch (error) {
      console.log("Error fetching user info", error);
      localStorage.removeItem("userData");
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

  if (!userInfo) {
    return <div>Loading...</div>;
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
              <h4 className="user-name">{userInfo.name || "Employee"}</h4>
              <p className="user-role">{userInfo.role || "Employee"}</p>
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
                onClick={() => setSelectedOption("Tasks")}
              >
                <img src={assets.project} alt="Tasks" />
                Tasks
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
          {selectedOption === "Tasks" && <Task />}
          {selectedOption === "Profile" && <Profile />}
        </div>
      </div>
    </div>
  );
};

export default Employee;
