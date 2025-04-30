import React, { useState, useEffect } from "react";
import "./Project.css";

const Project = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [editIndex, setEditIndex] = useState(null);
  const [editedProject, setEditedProject] = useState({});
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const userId = userData?.userId;

        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/projects?userId=${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setProjects(data);
        } else {
          console.error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    statusFilter === "all"
      ? true
      : project.status.toLowerCase() === statusFilter
  );

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditedProject({ ...filteredProjects[index] });
  };

  const handleDelete = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setProjects(prev => prev.filter(project => project._id !== projectId));
      } else {
        console.error('Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };
  

  const handleInputChange = (e) => {
    setEditedProject({ ...editedProject, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated Project Data:", editedProject);
    setEditIndex(null);
    // Optionally send updated data to backend
  };

  return (
    <div className="project-wrapper">
      <h1 className="page-heading">
        Projects
        <div className="filter-buttons">
          <button onClick={() => setStatusFilter("all")}>All</button>
          <button onClick={() => setStatusFilter("pending")}>Pending</button>
          <button onClick={() => setStatusFilter("ongoing")}>Ongoing</button>
          <button onClick={() => setStatusFilter("completed")}>
            Completed
          </button>
        </div>
      </h1>

      <div className="project-tiles">
        {filteredProjects.map((project, index) => (
          <div key={index} className="project-tile">
            {editIndex === index ? (
              <>
                <input
                  name="title"
                  value={editedProject.title}
                  onChange={handleInputChange}
                  className="edit-input"
                />
                <textarea
                  name="description"
                  value={editedProject.description}
                  onChange={handleInputChange}
                  className="edit-textarea"
                />
              </>
            ) : (
              <>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
              </>
            )}

            <p className="project-due-date">Due Date: {project.dueDate}</p>
            <p className="project-priority">Priority: {project.priority}</p>
            <p className={`project-status ${project.status.toLowerCase()}`}>
              Status: {project.status}
            </p>

            {project.status.toLowerCase() === "ongoing" && (
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            )}

            <div className="project-actions">
              {editIndex === index ? (
                <button className="action-btn" onClick={handleSave}>
                  Save
                </button>
              ) : (
                <button
                  className="action-btn"
                  onClick={() => handleEditClick(index)}
                >
                  Edit
                </button>
              )}
              <button
                className="action-btn delete"
                onClick={() => handleDelete(project._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Project;
