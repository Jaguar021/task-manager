import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [admin, setAdmin] = useState({
    image: '/default-admin.png',
    name: '',
    email: '',
    phone: '',
    department: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch Admin Profile on Mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const token = userData?.token;

        const res = await fetch('http://localhost:5000/admin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setAdmin({
            image: data.image || '/default-admin.png',
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            department: data.department || '',
          });
        } else {
          console.error('Failed to fetch admin profile:', data.message);
        }
      } catch (err) {
        console.error('Error fetching admin profile:', err);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Taskmanager_2');
    formData.append('folder', 'admin');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/djxgvyjxk/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setAdmin((prev) => ({ ...prev, image: data.secure_url }));
    } catch (err) {
      console.error('Image upload failed:', err);
    }

    setUploading(false);
  };

  const handleSaveProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.token;

      const res = await fetch('http://localhost:5000/user/updateAdmin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "x-auth-token": token,
        },
        body: JSON.stringify(admin),
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
      console.error('Error updating admin profile:', err);
    }
  };

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-card">
        <img className="admin-profile-img" src={admin.image} alt="Admin" />
        <div className="admin-profile-info">
          {isEditing ? (
            <>
              <input name="name" value={admin.name} onChange={handleChange} placeholder="Name" />
              <input name="email" value={admin.email} onChange={handleChange} placeholder="Email" />
              <input name="phone" value={admin.phone} onChange={handleChange} placeholder="Phone" />
              <input name="department" value={admin.department} onChange={handleChange} placeholder="Department" />

              <label className="image-upload-label">
                {uploading ? 'Uploading...' : 'Upload New Image'}
                <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </>
          ) : (
            <>
              <h2>{admin.name}</h2>
              <p><strong>Email:</strong> {admin.email}</p>
              <p><strong>Phone:</strong> {admin.phone}</p>
              <p><strong>Department:</strong> {admin.department}</p>
            </>
          )}
          <button className="edit-btn" onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}>
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
