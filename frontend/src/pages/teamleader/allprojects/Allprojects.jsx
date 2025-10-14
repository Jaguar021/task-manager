import React, { useEffect, useState } from "react";
import "./AllProjects.css";

const dummyEmployees = [
  { name: "Alice Johnson", skills: ["React", "Node.js"] },
  { name: "Bob Williams", skills: ["UI/UX", "Tailwind CSS"] },
];

const Allprojects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !userData.userId || !userData.token) {
      console.error("User not authenticated.");
      return;
    }

    const token = userData.token;

    const fetchProjects = async () => {
      try {
        const leaderRes = await fetch(`http://localhost:5000/api/teamleader/by-user/${userData.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!leaderRes.ok) throw new Error("Failed to fetch TeamLeader");

        const leaderData = await leaderRes.json();
        const teamLeaderId = leaderData._id;

        const res = await fetch(`http://localhost:5000/api/projects/team-leader/${teamLeaderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) throw new Error("Failed to fetch projects");

        const data = await res.json();
        const projectsWithSubtasks = data.map(project => ({
          ...project,
          subtasks: []
        }));
        setProjects(projectsWithSubtasks);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  const getPriorityClass = (priority) => {
    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    if (priority === "Low") return "priority-low";
    return "";
  };

  return (
    <div className="teamleader-project-wrapper">
      <h1 className="teamleader-page-heading">All Projects</h1>

      <div className="teamleader-main-content">
        <div className="teamleader-projects-section">
          <div className="teamleader-project-grid">
            {projects.map((project, index) => (
              <div
                className="teamleader-project-tile"
                key={index}
                onClick={() => setSelectedProjectIndex(index)}
              >
                <h3 className="teamleader-project-title">{project.title}</h3>
                <p className="teamleader-project-description">{project.description}</p>
                <p className={`teamleader-project-priority ${getPriorityClass(project.priority)}`}>
                  Priority: {project.priority}
                </p>
                <p className="teamleader-project-due-date">
                  Due Date: {project.dueDate?.slice(0, 10)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allprojects;
