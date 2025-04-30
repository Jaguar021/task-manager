import React, { useState } from 'react';
import './Profile.css';

const initialLeader = {
  image: '/default-leader.png',
  name: 'Alice Leader',
  email: 'alice.leader@company.com',
  phone: '+1 987 654 321',
  teamName: 'Frontend Avengers',
};

const Profile = () => {
  const [leader, setLeader] = useState(initialLeader);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeader((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Taskmanager_2'); // Replace with your actual upload preset
    formData.append('folder', 'team-leaders'); // Folder in Cloudinary

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/djxgvyjxk/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setLeader(prev => ({ ...prev, image: data.secure_url }));
    } catch (err) {
      console.error('Image upload failed:', err);
    }

    setUploading(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.token;

      const res = await fetch('http://localhost:5000/user/updateTeamLeader', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "x-auth-token": token,
        },
        body: JSON.stringify(leader),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false);
      } else {
        alert('Failed to update profile');
        console.error(data);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className="leader-profile-container">
      <div className="leader-profile-card">
        <img className="leader-profile-img" src={leader.image} alt="Team Leader" />
        <div className="leader-profile-info">
          {isEditing ? (
            <>
              <input name="name" value={leader.name} onChange={handleChange} />
              <input name="email" value={leader.email} onChange={handleChange} />
              <input name="phone" value={leader.phone} onChange={handleChange} />
              <input name="teamName" value={leader.teamName} onChange={handleChange} />

              <label className="image-upload-label">
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>

              <button className="save-btn" onClick={handleSaveProfile}>
                Save
              </button>
            </>
          ) : (
            <>
              <h2>{leader.name}</h2>
              <p><strong>Email:</strong> {leader.email}</p>
              <p><strong>Phone:</strong> {leader.phone}</p>
              <p><strong>Team Name:</strong> {leader.teamName}</p>

              <button className="edit-btn" onClick={handleEditToggle}>
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
