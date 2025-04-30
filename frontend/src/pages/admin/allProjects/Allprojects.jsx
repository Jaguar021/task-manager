import React, { useState } from "react";
import "./Allprojects.css";

const teamLeaders = [
  { name: "John Doe", email: "john@company.com", image: "/images/john.jpg" },
  { name: "Jane Smith", email: "jane@company.com", image: "/images/jane.jpg" },
];

const initialProjects = [
  {
    clientName: "Acme Inc.",
    clientEmail: "client@acme.com",
    title: "Redesign Website",
    description: "Complete overhaul of the company website.",
    priority: "High",
    dueDate: "2025-05-20",
    status: "pending approval",
  },
  {
    clientName: "Beta Corp.",
    clientEmail: "contact@beta.com",
    title: "Marketing Automation",
    description: "Build tools for automating campaigns.",
    priority: "Medium",
    dueDate: "2025-06-10",
    status: "accepted",
  },
];

const Allprojects = () => {
  const [filter, setFilter] = useState("pending approval");
  const [projects, setProjects] = useState(initialProjects);
  const [assigningIndex, setAssigningIndex] = useState(null);

  const handleAccept = (index) => {
    const updated = [...projects];
    updated[index].status = "accepted";
    setProjects(updated);
  };

  const handleReject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
  };

  const handleAssign = (index, leader) => {
    const updated = [...projects];
    updated[index].status = "assigned";
    updated[index].teamLeader = leader;
    setAssigningIndex(null);
    setProjects(updated);
  };

  const filtered = projects.filter((p) =>
    filter === "unassigned"
      ? p.status === "accepted"
      : filter === "assigned"
      ? p.status === "assigned"
      : p.status === "pending approval"
  );

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
          <div className="project-tile" key={index}>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <p className="project-client">
              Client: {project.clientName} ({project.clientEmail})
            </p>
            <p className="project-priority">Priority: {project.priority}</p>
            <p className="project-due-date">Due Date: {project.dueDate}</p>

            {filter === "pending approval" && (
              <div className="project-actions">
                <button
                  className="action-btn"
                  onClick={() => handleAccept(index)}
                >
                  Accept
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleReject(index)}
                >
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
                  <button
                    className="action-btn"
                    onClick={() => setAssigningIndex(index)}
                  >
                    Assign To
                  </button>
                )}
              </div>
            )}

            {filter === "assigned" && project.teamLeader && (
              <div className="assigned-section">
                <img
                  src={project.teamLeader.image}
                  alt="team leader"
                  className="profile-pic"
                  title={`${project.teamLeader.name} - ${project.teamLeader.email}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Allprojects;
