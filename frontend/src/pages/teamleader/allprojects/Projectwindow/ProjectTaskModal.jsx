import React from "react";
import "./ProjectTaskModal.css";

const ProjectTaskModal = ({
  assignedEmployees = [],
  onClose,
  onAddClick,
  onEmployeeClick,
}) => {
  return (
    <div className="task-modal-overlay">
      <div className="task-modal-window">
        <button className="task-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="task-modal-content">
          {/* Left panel */}
          <div className="task-modal-sidebar">
            <button className="task-modal-add-btn" onClick={onAddClick}>
              ADD
            </button>

            <div className="task-modal-employee-list">
              {assignedEmployees.length > 0 ? (
                assignedEmployees.map((emp, index) => (
                  <div
                    key={index}
                    className="task-modal-employee-item"
                    onClick={() => onEmployeeClick(emp)}
                  >
                    {emp.name}
                  </div>
                ))
              ) : (
                <div className="task-modal-placeholder">Add Employees</div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="task-modal-details">
            <h2 className="task-modal-detail-heading">Task Detail</h2>
            <p className="task-modal-detail-text">This is test Task details</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTaskModal;
