import React, { useState } from 'react';
import './Signup.css';
import assets from '../../../assets/assets';

const Signup = ({ closeWindow }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Signup successful!');
        closeWindow(); // Or redirect
      } else {
        alert(`Signup failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="signup-container">
      <img src={assets.close} alt="Close" className="close-icon" onClick={closeWindow} />
      <form className="inForm" onSubmit={handleSubmit}>
        <input
          id="field"
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          id="field"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="client">Client</option>
          <option value="team leader">Team Leader</option>
          <option value="employee">Employee</option>
        </select>
        <button type="submit" className="btn">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
