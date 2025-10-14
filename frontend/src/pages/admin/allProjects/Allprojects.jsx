import React, { useState, useEffect } from "react";
import "./Allprojects.css";

const Allprojects = () => {
  const [filter, setFilter] = useState("pending approval");
  const [projects, setProjects] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [assigningIndex, setAssigningIndex] = useState(null);

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/adminProjects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Fetch all team leaders
  useEffect(() => {
    const fetchTeamLeaders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/teamleaders");
        const data = await res.json();
        setTeamLeaders(data);
      } catch (error) {
        console.error("Error fetching team leaders:", error);
      }
    };

    fetchTeamLeaders();
  }, []);

  const updateAdminStatus = async (projectId, updates) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update project");
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleAccept = async (index) => {
    const updated = [...projects];
    const project = updated[index];
    project.admin_status = "unassigned";
    setProjects(updated);
    await updateAdminStatus(project._id, { admin_status: "unassigned" });
  };

  const handleReject = async (index) => {
    const projectId = projects[index]._id;
    try {
      await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "DELETE",
      });
      setProjects(projects.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleAssign = async (index, leader) => {
    const updated = [...projects];
    const project = updated[index];
    project.admin_status = "assigned";
    project.teamLeader = leader;
    setProjects(updated);
    setAssigningIndex(null);

    await updateAdminStatus(project._id, {
      admin_status: "assigned",
      teamLeader: leader,
    });
  };

  const filtered = projects.filter((p) => p.admin_status === filter);

  return (
    <div className="project-wrapper">
      <h1 className="page-heading">
        All Projects
        <div className="filter-buttons">
          <button
            className={filter === "pending approval" ? "active" : ""}
            onClick={() => setFilter("pending approval")}
          >
            Pending Approval
          </button>
          <button
            className={filter === "unassigned" ? "active" : ""}
            onClick={() => setFilter("unassigned")}
          >
            Unassigned
          </button>
          <button
            className={filter === "assigned" ? "active" : ""}
            onClick={() => setFilter("assigned")}
          >
            Assigned
          </button>
        </div>
      </h1>

      <div className="project-tiles">
        {filtered.map((project, index) => (
          <div className="project-tile" key={project._id || index}>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <p className="project-client">
              Client: {project.clientName} ({project.clientEmail})
            </p>
            <p className="project-priority">Priority: {project.priority}</p>
            <p className="project-due-date">Due Date: {project.dueDate}</p>
            <p className="project-status">Project Status: {project.status}</p>

            {filter === "pending approval" && (
              <div className="project-actions">
                <button className="action-btn" onClick={() => handleAccept(index)}>
                  Accept
                </button>
                <button className="action-btn delete" onClick={() => handleReject(index)}>
                  Reject
                </button>
              </div>
            )}

            {filter === "unassigned" && (
              <div className="project-actions">
                {assigningIndex === index ? (
                  <div className="dropdown">
                    {teamLeaders.map((leader, i) => (
                      <div
                        key={i}
                        className="dropdown-item"
                        onClick={() => handleAssign(index, leader)}
                      >
                        {leader.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <button className="action-btn" onClick={() => setAssigningIndex(index)}>
                    Assign To
                  </button>
                )}
              </div>
            )}

            {filter === "assigned" && project.teamLeader && (
              <div className="assigned-section">
                {project.teamLeader.image && (
                  <img
                    src={project.teamLeader.image}
                    alt="team leader"
                    className="profile-pic"
                    title={`${project.teamLeader.name} - ${project.teamLeader.email}`}
                  />
                )}
                <p className="assigned-leader">
                  Assigned to: {project.teamLeader.name}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Allprojects;
