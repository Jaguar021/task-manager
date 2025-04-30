import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import assets from '../../../assets/assets';

const Login = ({ closeWindow }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('userData', JSON.stringify({
        token: data.token,
        userId: data.userId,
        role: data.role,
        username: data.username,
        isLoggedIn: true
      }));
    
      navigate(data.redirectUrl); // Redirect to role-based dashboard
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <img
        src={assets.close}
        alt="Close"
        className="close-icon"
        onClick={closeWindow}
      />
      <form className="inForm" onSubmit={handleSubmit}>
        <input
          id="field"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          id="field"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn" type="submit">Login <img src={assets.login} alt="" /></button>
      </form>
    </div>
  );
};

export default Login;
