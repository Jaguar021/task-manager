import React, { useState } from "react";
import "./Allprojects.css";

const dummyProjects = [
  {
    title: "Website Revamp",
    description: "Update the corporate website with new branding.",
    priority: "High",
    dueDate: "2025-06-15",
    subtasks: [],
  },
  {
    title: "Mobile App Launch",
    description: "Develop and launch new mobile app for e-commerce.",
    priority: "Medium",
    dueDate: "2025-07-01",
    subtasks: [],
  },
];

const dummyEmployees = [
  { name: "Alice Johnson", skills: ["React", "Node.js"] },
  { name: "Bob Williams", skills: ["UI/UX", "Tailwind CSS"] },
];

const Allprojects = () => {
  const [projects, setProjects] = useState(dummyProjects);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [newSubtask, setNewSubtask] = useState({ title: "", description: "", dueDate: "" });
  const [assigningSubtaskIndex, setAssigningSubtaskIndex] = useState(null);

  const handleShowSubtasks = (index) => {
    setSelectedProjectIndex(index);
    setShowAddSubtask(false);
    setAssigningSubtaskIndex(null);
  };

  const handleAddSubtask = () => {
    const updatedProjects = [...projects];
    updatedProjects[selectedProjectIndex].subtasks.push({ ...newSubtask, assignedTo: null });
    setProjects(updatedProjects);
    setNewSubtask({ title: "", description: "", dueDate: "" });
    setShowAddSubtask(false);
  };

  const handleAssignEmployee = (subtaskIndex, employee) => {
    const updatedProjects = [...projects];
    updatedProjects[selectedProjectIndex].subtasks[subtaskIndex].assignedTo = employee;
    setProjects(updatedProjects);
    setAssigningSubtaskIndex(null);
  };

  return (
    <div className="teamleader-project-wrapper">
      <h1 className="teamleader-page-heading">All Projects</h1>

      <div className="teamleader-main-content">
        {/* Left 60% */}
        <div className="teamleader-projects-section">
          <div className="teamleader-project-grid">
            {projects.map((project, index) => (
              <div className="teamleader-project-tile" key={index}>
                <h3 className="teamleader-project-title">{project.title}</h3>
                <p className="teamleader-project-description">{project.description}</p>
                <p className="teamleader-project-priority">Priority: {project.priority}</p>
                <p className="teamleader-project-due-date">Due Date: {project.dueDate}</p>
                <button
                  className="teamleader-show-subtasks-btn"
                  onClick={() => handleShowSubtasks(index)}
                >
                  Show Subtasks
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 40% */}
        
        <div className="teamleader-subtasks-section">
          {selectedProjectIndex !== null && (
            <>
              <button
                className="teamleader-add-subtask-btn"
                onClick={() => setShowAddSubtask(!showAddSubtask)}
              >
                {showAddSubtask ? "Cancel" : "Add Subtask"}
              </button>

              {showAddSubtask && (
                <div className="teamleader-add-subtask-form">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newSubtask.title}
                    onChange={(e) => setNewSubtask({ ...newSubtask, title: e.target.value })}
                  />
                  <textarea
                    placeholder="Description"
                    value={newSubtask.description}
                    onChange={(e) => setNewSubtask({ ...newSubtask, description: e.target.value })}
                  ></textarea>
                  <input
                    type="date"
                    value={newSubtask.dueDate}
                    onChange={(e) => setNewSubtask({ ...newSubtask, dueDate: e.target.value })}
                  />
                  <button onClick={handleAddSubtask}>Create Subtask</button>
                </div>
              )}

              <div className="teamleader-subtask-grid">
                {projects[selectedProjectIndex].subtasks.map((subtask, idx) => (
                  <div className="teamleader-subtask-tile" key={idx}>
                    <h4>{subtask.title}</h4>
                    <p>{subtask.description}</p>
                    <p>Due: {subtask.dueDate}</p>

                    {subtask.assignedTo ? (
                      <p className="teamleader-assigned-to">Assigned to: {subtask.assignedTo.name}</p>
                    ) : assigningSubtaskIndex === idx ? (
                      <div className="teamleader-employee-dropdown">
                        {dummyEmployees.map((emp, eIndex) => (
                          <div
                            key={eIndex}
                            className="teamleader-dropdown-item"
                            onClick={() => handleAssignEmployee(idx, emp)}
                          >
                            {emp.name} ({emp.skills.join(", ")})
                          </div>
                        ))}
                      </div>
                    ) : (
                      <button
                        className="teamleader-assign-btn"
                        onClick={() => setAssigningSubtaskIndex(idx)}
                      >
                        Assign
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Allprojects;
