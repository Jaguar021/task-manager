import React, { useEffect, useState } from 'react';
import './TeamLeaders.css';

const TeamLeaders = () => {
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeamLeaders = async () => {
    try {
      const res = await fetch('/api/users/team-leaders');
      const data = await res.json();
      setTeamLeaders(data);
    } catch (error) {
      console.error("Error fetching team leaders:", error);
    }
  };

  const fetchApprovedProjects = async () => {
    try {
      const res = await fetch('/api/projects/approved');
      const data = await res.json();
      setApprovedProjects(data);
    } catch (error) {
      console.error("Error fetching approved projects:", error);
    }
  };

  const assignProject = async (leaderId, projectId) => {
    try {
      const res = await fetch(`/api/projects/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaderId, projectId }),
      });

      if (res.ok) {
        alert("Project assigned successfully!");
        fetchTeamLeaders(); // Refresh list after assignment
      } else {
        console.error("Assignment failed");
      }
    } catch (err) {
      console.error("Error assigning project:", err);
    }
  };

  useEffect(() => {
    Promise.all([fetchTeamLeaders(), fetchApprovedProjects()]).then(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading team leaders...</div>;

  return (
    <div className="team-leaders-container">
      <h2>Team Leaders</h2>
      {teamLeaders.length === 0 ? (
        <p className="no-leaders">No team leaders found.</p>
      ) : (
        teamLeaders.map((leader) => (
          <div className="leader-card" key={leader._id}>
            <h3>{leader.name}</h3>
            <p><strong>Email:</strong> {leader.email}</p>
            <p><strong>Domain:</strong> {leader.domain || 'N/A'}</p>
            <p><strong>Current Project:</strong> {leader.currentProject?.name || 'None'}</p>

            {leader.status === 'available' ? (
              approvedProjects.length === 0 ? (
                <p className="no-projects-msg">No approved projects available for assignment.</p>
              ) : (
                <select
                  className="project-select"
                  onChange={(e) => assignProject(leader._id, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Select a project to assign</option>
                  {approvedProjects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              )
            ) : (
              <p className="busy-msg">Already assigned to a project.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TeamLeaders;
