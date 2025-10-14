import React, { useState, useEffect } from "react";
import "./Team.css";
import TeamModal from "./TeamModel/TeamModel";
import AddEmployeeModal from "./TeamModel/AddEmployeeModal";

const Team = () => {
  const [section, setSection] = useState("leaders");
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [unassignedEmployees, setUnassignedEmployees] = useState([]);
  const [activeLeader, setActiveLeader] = useState(null); // For Team modal
  const [assignModalLeader, setAssignModalLeader] = useState(null); // For Add modal

  // Fetch team leaders
  useEffect(() => {
    const fetchTeamLeaders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/teamleaders/team-leaders");
        const data = await response.json();
        setTeamLeaders(data);
      } catch (error) {
        console.error("Error fetching team leaders:", error);
      }
    };
    fetchTeamLeaders();
  }, []);

  // Fetch unassigned employees
  useEffect(() => {
    const fetchUnassignedEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/teamleaders/unassigned");
        const data = await response.json();
        setUnassignedEmployees(data);
      } catch (error) {
        console.error("Error fetching unassigned employees:", error);
      }
    };
    fetchUnassignedEmployees();
  }, []);

  // Assign employee to team leader
  const assignEmployee = async (leaderId, employeeId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/teamleaders/${leaderId}/assign/${employeeId}`,
        { method: "PUT" }
      );
      const data = await res.json();

      if (res.ok) {
        // Remove from unassigned
        setUnassignedEmployees(prev => prev.filter(emp => emp._id !== employeeId));

        // Add to leader
        setTeamLeaders(prev =>
          prev.map(leader =>
            leader._id === leaderId
              ? { ...leader, employees: [...leader.employees, data.updatedEmployee] }
              : leader
          )
        );
      }
    } catch (err) {
      console.error("Error assigning employee:", err);
    }
  };

  // Remove employee from team leader
  const handleRemove = async (leaderId, employeeId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/teamleaders/${leaderId}/remove/${employeeId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (res.ok) {
        // Update leader's employee list
        setTeamLeaders(prev =>
          prev.map(leader =>
            leader._id === leaderId
              ? {
                  ...leader,
                  employees: leader.employees.filter(emp => emp._id !== employeeId)
                }
              : leader
          )
        );

        // Add to unassigned
        setUnassignedEmployees(prev => [...prev, data.updatedEmployee]);
      }
    } catch (err) {
      console.error("Error removing employee from team:", err);
    }
  };

  return (
    <div className="project-wrapper">
      <h1 className="page-heading">
        Team Management
        <div className="filter-buttons">
          <button
            className={section === "leaders" ? "active" : ""}
            onClick={() => setSection("leaders")}
          >
            Team Leaders
          </button>
          <button
            className={section === "employees" ? "active" : ""}
            onClick={() => setSection("employees")}
          >
            Employees
          </button>
        </div>
      </h1>

      <div className="project-tiles">
        {section === "leaders" && (
          <>
            {teamLeaders.map((leader) => (
              <div className="project-tile" key={leader._id}>
                <h3 className="project-title">{leader.name}</h3>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button onClick={() => setActiveLeader(leader)}>Team</button>
                  <button onClick={() => setAssignModalLeader(leader)}>Add</button>
                </div>
              </div>
            ))}
          </>
        )}

        {section === "employees" &&
          teamLeaders.flatMap((leader) =>
            leader.employees.map((emp) => (
              <div className="project-tile" key={emp._id}>
                <img
                  className="profile-pic large"
                  src={emp.image || "/default-profile.png"}
                  alt="employee"
                />
                <h3 className="project-title">{emp.name}</h3>
                <p>Email: {emp.email || "N/A"}</p>
                <p>Phone: {emp.phone || "N/A"}</p>
                <p>Team Leader: {leader.name}</p>
              </div>
            ))
          )}
      </div>

      {/* Modal for viewing assigned employees */}
      {activeLeader && (
        <TeamModal
          leader={activeLeader}
          onClose={() => setActiveLeader(null)}
          onRemove={handleRemove}
        />
      )}

      {/* Modal for assigning employees */}
      {assignModalLeader && (
        <AddEmployeeModal
          leader={assignModalLeader}
          unassignedEmployees={unassignedEmployees}
          onAssign={assignEmployee}
          onClose={() => setAssignModalLeader(null)}
        />
      )}
    </div>
  );
};

export default Team;
