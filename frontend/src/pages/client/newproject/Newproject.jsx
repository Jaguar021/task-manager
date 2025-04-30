import React, { useState } from 'react';
import './NewProject.css';

const NewProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const userId = userData?.userId;

      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }

      // Step 1: Fetch client data
      const clientResponse = await fetch(`http://localhost:5000/client/${userId}`);
      const clientData = await clientResponse.json();

      if (!clientResponse.ok) {
        console.error('Failed to fetch client data');
        return;
      }

      const { clientName, clientEmail } = clientData;

      // Step 2: Complete form data with client info and userId
      const completeFormData = {
        ...formData,
        clientName,
        clientEmail,
        user: userId,           // Add userId to send as "user"
        status: 'Pending',      // Set default status explicitly
        progress: 0             // Optional, if not already set by backend
      };

      // Step 3: Submit project to backend
      const projectResponse = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(completeFormData)
      });

      if (projectResponse.ok) {
        console.log('Project created successfully!');
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          priority: ''
        });
      } else {
        const errorData = await projectResponse.json();
        console.error('Failed to create project:', errorData.message || errorData);
      }

    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  return (
    <div className="new-project-wrapper">
      <h3 className="page-heading">New Project</h3>
      <div className="new-project-container">
        <form className="new-project-form" onSubmit={handleSubmit}>
          <label>
            Title of Project:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </label>

          <label>
            Due Date:
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Project Priority:
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <button type="submit">Submit Project</button>
        </form>
      </div>
    </div>
  );
};

export default NewProject;
