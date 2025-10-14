// components/AddEmployeeModal.jsx
import React from "react";
import "./TeamModel.css"; // reuse the same styling

const AddEmployeeModal = ({ leader, unassignedEmployees, onAssign, onClose }) => {
  if (!leader) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Assign to {leader.name}</h2>
        <div className="modal-content">
          {unassignedEmployees.length > 0 ? (
            unassignedEmployees.map(emp => (
              <div key={emp._id} className="employee-row">
                <p>{emp.name}</p>
                <button onClick={() => onAssign(leader._id, emp._id)}>➕</button>
              </div>
            ))
          ) : (
            <p>No unassigned employees available.</p>
          )}
        </div>
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
