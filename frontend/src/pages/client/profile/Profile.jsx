import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    image: '/default-client.png',
    name: '',
    role: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch profile when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const token = userData?.token;

        const res = await fetch('http://localhost:5000/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setProfile({
            image: data.image || '/default-client.png',
            name: data.name || '',
            role: data.role || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Taskmanager_2'); // Cloudinary preset
    formData.append('folder', 'clients');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/djxgvyjxk/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setProfile((prev) => ({ ...prev, image: data.secure_url }));
    } catch (err) {
      console.error('Image upload failed:', err);
    }

    setUploading(false);
  };

  const handleSaveProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.token;

      const res = await fetch('http://localhost:5000/user/updateClient', {
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
    <div className="client-profile-container">
      <div className="client-profile-card">
        <img className="client-profile-img" src={profile.image} alt="Client" />
        <div className="client-profile-info">
          {isEditing ? (
            <>
              <input name="name" value={profile.name} onChange={handleChange} placeholder="Name" />
              <input name="role" value={profile.role} onChange={handleChange} placeholder="Role" />
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
              <h2>{profile.name}</h2>
              <h4>{profile.role}</h4>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>Address:</strong> {profile.address}</p>
            </>
          )}

          <button
            className="edit-btn"
            onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
