import React, { useState } from "react";
import "./Team.css";

const teamData = [
  {
    name: "Alpha Team",
    leader: "John Doe",
    pending: 2,
    ongoing: 3,
    completed: 5,
    members: [
      { name: "Alice", image: "/images/alice.jpg" },
      { name: "Bob", image: "/images/bob.jpg" },
      { name: "Charlie", image: "/images/charlie.jpg" },
      { name: "David", image: "/images/david.jpg" },
      { name: "Ella", image: "/images/ella.jpg" },
      { name: "Frank", image: "/images/frank.jpg" },
    ],
  },
];

const teamLeaders = [
  {
    name: "John Doe",
    email: "john@company.com",
    phone: "123-456-7890",
    team: "Alpha Team",
    image: "/images/john.jpg",
  },
];

const employees = [
  {
    name: "Alice",
    email: "alice@company.com",
    phone: "222-333-4444",
    team: "Alpha Team",
    leader: "John Doe",
    image: "/images/alice.jpg",
  },
];

const Team = () => {
  const [section, setSection] = useState("teams");
  const [visibleTeamIndex, setVisibleTeamIndex] = useState(null);

  const toggleMembers = (index) => {
    setVisibleTeamIndex(visibleTeamIndex === index ? null : index);
  };

  return (
    <div className="project-wrapper">
      <h1 className="page-heading">
        Team Management
        <div className="filter-buttons">
          <button
            className={section === "teams" ? "active" : ""}
            onClick={() => setSection("teams")}
          >
            Teams
          </button>
          <button
            className={section === "leaders" ? "active" : ""}
            onClick={() => setSection("leaders")}
          >
            Team Leaders
          </button>
          <button
            className={section === "employees" ? "active" : ""}
            onClick={() => setSection("employees")}
          >
            Employees
          </button>
        </div>
      </h1>

      <div className="project-tiles">
        {section === "teams" &&
          teamData.map((team, index) => (
            <div className="project-tile" key={index}>
              <h3 className="project-title">{team.name}</h3>
              <p className="project-description">
                Team Leader: <strong>{team.leader}</strong>
              </p>
              <div className="status-bubbles">
                <span className="pending">{team.pending} Pending</span>
                <span className="ongoing">{team.ongoing} Ongoing</span>
                <span className="completed">{team.completed} Completed</span>
              </div>

              <div
                className="member-previews"
                onClick={() => toggleMembers(index)}
              >
                {team.members.slice(0, 5).map((member, i) => (
                  <img
                    key={i}
                    className="profile-pic"
                    src={member.image}
                    title={member.name}
                  />
                ))}
                {team.members.length > 5 && (
                  <span className="more-members">
                    +{team.members.length - 5}
                  </span>
                )}
              </div>
              {visibleTeamIndex === index && (
                <div className="member-list">
                  {team.members.map((m, i) => (
                    <p key={i}>{m.name}</p>
                  ))}
                </div>
              )}
            </div>
          ))}

        {section === "leaders" &&
          teamLeaders.map((leader, index) => (
            <div className="project-tile" key={index}>
              <img
                className="profile-pic large"
                src={leader.image}
                alt="leader"
              />
              <h3 className="project-title">{leader.name}</h3>
              <p>Email: {leader.email}</p>
              <p>Phone: {leader.phone}</p>
              <p>Team: {leader.team}</p>
            </div>
          ))}

        {section === "employees" &&
          employees.map((emp, index) => (
            <div className="project-tile" key={index}>
              <img
                className="profile-pic large"
                src={emp.image}
                alt="employee"
              />
              <h3 className="project-title">{emp.name}</h3>
              <p>Email: {emp.email}</p>
              <p>Phone: {emp.phone}</p>
              <p>Team: {emp.team}</p>
              <p>Team Leader: {emp.leader}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Team;
