import React from 'react'
import "./Profile.css"

const Profile = () => {
  return (
    <>
      <div className="container">
      <section class="profile">
        <img src="profile.jpg" alt="User Profile" class="profile-pic"/>
        <h2>John Doe</h2>
        <p class="role">Software Engineer</p>
        <p class="bio">Passionate web developer with expertise in MERN stack.</p>
        <p>Idle</p>
  
        <ul class="contact-info">
          <li>Email: johndoe@example.com</li>
          <li>Phone: +123 456 7890</li>
          <li>Location: New York, USA</li>
        </ul>

      <button class="edit-btn">Edit Profile</button>
    </section>

    <section className="skills">
      <span>Database<button>X</button></span>
      <span>Front End<button>X</button></span>
      <span>Data Analytics<button>X</button></span>
    </section>
      </div>

    </>
  )
}

export default Profile
