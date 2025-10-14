import React from "react";
import "./TeamModel.css";

const TeamModel = ({ leader, onClose, onRemove }) => {
  if (!leader) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{leader.name}'s Team</h2>
        <div className="modal-content">
          {leader.employees && leader.employees.length > 0 ? (
            leader.employees.map((emp) => (
              <div key={emp._id} className="employee-row">
                <p>{emp.name}</p>
                <button className="remove-btn" onClick={() => onRemove(leader._id, emp._id)}>❌</button>
              </div>
            ))
          ) : (
            <p>No employees assigned.</p>
          )}
        </div>
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default TeamModel;
