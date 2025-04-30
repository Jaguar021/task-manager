import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    image: '/default-profile.png',
    name: '',
    role: '',
    status: '',
    email: '',
    phone: '',
    address: '',
    skills: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [uploading, setUploading] = useState(false);

  // Fetch employee profile when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const token = userData?.token;

        const res = await fetch('http://localhost:5000/employee', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setProfile({
            image: data.image || '/default-profile.png',
            name: data.name || '',
            role: data.role || '',
            status: data.status || 'Idle',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            skills: data.skills || [],
          });
        } else {
          console.error('Failed to fetch profile:', data.message);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const toggleStatus = () => {
    setProfile(prev => ({
      ...prev,
      status: prev.status === 'Idle' ? 'Working' : 'Idle',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Taskmanager_2'); // Cloudinary preset
    formData.append('folder', 'employees'); // Save in employees folder

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/djxgvyjxk/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setProfile(prev => ({ ...prev, image: data.secure_url }));
    } catch (err) {
      console.error('Image upload failed:', err);
    }

    setUploading(false);
  };

  const handleSaveProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.token;

      const res = await fetch('http://localhost:5000/user/updateEmployee', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "x-auth-token": token,
        },
        body: JSON.stringify(profile),
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
    <div className="profile-container">
      <div className="profile-card">
        <img className="profile-img" src={profile.image} alt="Profile" />
        <div className="profile-info">
          {isEditing ? (
            <>
              <input name="name" value={profile.name} onChange={handleChange} placeholder="Name" />
              <input name="role" value={profile.role} onChange={handleChange} placeholder="Role" />
            </>
          ) : (
            <>
              <h2>{profile.name}</h2>
              <h4>{profile.role}</h4>
            </>
          )}

          <div className="status-toggle">
            <span>Status: </span>
            <button
              className={`status-btn ${profile.status === 'Idle' ? 'idle' : 'working'}`}
              onClick={toggleStatus}
            >
              {profile.status}
            </button>
          </div>

          <div className="contact-info">
            {isEditing ? (
              <>
                <input name="email" value={profile.email} onChange={handleChange} placeholder="Email" />
                <input name="phone" value={profile.phone} onChange={handleChange} placeholder="Phone" />
                <input name="address" value={profile.address} onChange={handleChange} placeholder="Address" />

                <label className="image-upload-label">
                  {uploading ? 'Uploading...' : 'Upload New Image'}
                  <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
              </>
            ) : (
              <>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
                <p><strong>Address:</strong> {profile.address}</p>
              </>
            )}
          </div>

          <button
            className="edit-btn"
            onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="skills-section">
        <h3>Skills</h3>
        <div className="skills-list">
          {profile.skills.map(skill => (
            <div key={skill} className="skill-chip">
              {skill}
              {isEditing && (
                <button className="remove-skill" onClick={() => handleRemoveSkill(skill)}>x</button>
              )}
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="skill-input">
            <input
              type="text"
              placeholder="Add a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button onClick={handleAddSkill}>Add</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
