import React, { useEffect, useState } from 'react';
import './Pending.css';

const Pending = () => {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingProjects = async () => {
    try {
      const res = await fetch('/api/projects/pending'); // Replace with your actual API endpoint
      const data = await res.json();
      setPendingProjects(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching pending projects:", err);
      setLoading(false);
    }
  };

  const updateProjectStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/projects/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setPendingProjects(prev => prev.filter(project => project._id !== id));
      } else {
        console.error("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating project status:", err);
    }
  };

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  if (loading) return <div className="loading">Loading pending projects...</div>;

  return (
    <div className="pending-projects-container">
      <h2>Pending Projects</h2>
      {pendingProjects.length === 0 ? (
        <p className="no-projects">No pending projects.</p>
      ) : (
        pendingProjects.map(project => (
          <div key={project._id} className="project-card">
            <h3>{project.name}</h3>
            <p><strong>Description:</strong> {project.description}</p>
            <p><strong>Client:</strong> {project.clientName} ({project.clientEmail})</p>
            <div className="action-buttons">
              <button className="approve" onClick={() => updateProjectStatus(project._id, 'approved')}>Approve</button>
              <button className="reject" onClick={() => updateProjectStatus(project._id, 'rejected')}>Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Pending;
