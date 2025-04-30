import React, { useEffect, useState } from 'react';
import './Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employees when component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const token = userData?.token;

        const res = await fetch('http://localhost:5000/user', {
          headers: {
            "x-auth-token": token, // Use x-auth-token here
          },
        });

        const data = await res.json();
        if (res.ok) {
          setEmployees(data);
        } else {
          setError(data.message || 'Failed to fetch employees');
        }
      } catch (err) {
        setError('Error fetching employees');
      }
      setLoading(false);
    };

    fetchEmployees();
  }, []);

  if (loading) return <div className="employees-wrapper">Loading employees...</div>;
  if (error) return <div className="employees-wrapper">Error: {error}</div>;

  return (
    <div className="employees-wrapper">
      <div className="employees-page-heading">Employees</div>
      <div className="employees-main-content">
        <div className="employees-grid">
          {employees.map((employee, index) => (
            <div key={index} className="employee-tile">
              <img
                src={employee.profilePic || 'https://via.placeholder.com/100'}
                alt={employee.name}
                className="employee-profile-pic"
              />
              <div className="employee-name">{employee.name}</div>
              <div className="employee-email">{employee.email}</div>
              <div className="employee-skills">Skills: {employee.skills?.join(', ')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Employees;
