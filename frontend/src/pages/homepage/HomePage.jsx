import React, { useState } from "react";
import "./HomePage.css";
import assets from "../../../src/assets/assets";
import Login from "./login/Login";
import Signup from "./signup/Signup";

const HomePage = () => {
  const [authWindow, setAuthWindow] = useState(null); // 'login' | 'signup' | null

  return (
    <>
      <div className="homepage">
        <nav className="navbar">
          <div className="logo">Task Manager</div>
          <div className="nav-buttons">
            <button className="nav-btn">Home</button>
            <button className="nav-btn">About Us</button>
            <button className="nav-btn">Help</button>
          </div>
        </nav>

        <main className="content">
          <div className="content-overlay">
            <h1>Why choose us!</h1>

            <div className="tile1">
              <div className="schedule">
                <img src={assets.Schedule} />
                <p>
                  Our task manager simplifies scheduling by organizing projects
                  into manageable tasks, assigning them to the right team
                  members based on their skills and availability. With clear
                  deadlines, real-time updates, and progress tracking, it
                  ensures smooth collaboration and efficient project execution.
                  The easy-to-use dashboard gives you a quick overview of task
                  status, employee workload, and upcoming deadlines, helping you
                  stay on track and deliver projects on time.
                </p>
              </div>
              <div className="collaboration">
                <img src={assets.Collaboration} />
                <p>
                  Collaboration flows seamlessly with the task manager's
                  built-in communication tools and shared workspaces. Team
                  members can easily exchange updates, leave comments on tasks,
                  and stay informed through real-time notifications. By keeping
                  everything in one place—task details, assignments, and
                  progress—everyone stays aligned, reducing miscommunication and
                  boosting productivity across the board.
                </p>
              </div>
            </div>

            <div className="tile2">
              <div className="processing">
                <img src={assets.Processing} />
                <p>
                  Breaking down complex projects into smaller, manageable tasks
                  makes it easier to plan, assign, and track progress. Each
                  piece can be given clear deadlines, priorities, and team
                  members, ensuring nothing gets overlooked. This approach
                  improves focus, accountability, and allows for more accurate
                  progress tracking—making the entire project feel more
                  achievable and organized from start to finish.
                </p>
              </div>
              <div className="analytics">
                <img src={assets.analytics} />
                <p>
                  Gain valuable insights with built-in analytics that help you
                  track project progress, team performance, and overall
                  productivity. From task completion rates to employee workload
                  and time efficiency, the dashboard presents real-time data in
                  a clear, visual format. These insights make it easier to
                  identify bottlenecks, optimize resource allocation, and make
                  informed decisions to keep projects on schedule and teams
                  performing at their best.
                </p>
              </div>
            </div>

            <div className="sign">
              <h2>Get Started With Us!</h2>
              <div className="buttons">
                <button onClick={() => setAuthWindow("login")}>Login</button>
                <button onClick={() => setAuthWindow("signup")}>Signup</button>
              </div>
            </div>
            <footer className="footer">
              <div className="footer-container">
                {/* Branding */}
                <div className="footer-section">
                  <h2 className="footer-logo">Task Manager</h2>
                  <p className="footer-tagline">
                    Empowering teams to achieve more together.
                  </p>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                  <h3>Quick Links</h3>
                  <ul>
                    <li>
                      <button className="footer-link">Home</button>
                    </li>
                    <li>
                      <button className="footer-link">About</button>
                    </li>
                    <li>
                      <button className="footer-link">Projects</button>
                    </li>
                    <li>
                      <button className="footer-link">Contact</button>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-section">
                  <h3>Contact Us</h3>
                  <p>Email: support@taskmanager.com</p>
                  <p>Phone: +123 456 7890</p>
                </div>

                {/* Social Media */}
                <div className="footer-section">
                  <h3>Follow Us</h3>
                  <div className="social-icons">
                    <button className="social-icon">🐦</button>
                    <button className="social-icon">💼</button>
                    <button className="social-icon">📸</button>
                    <button className="social-icon">💬</button>
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="footer-bottom">
                <p>© 2025 Task Manager. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </main>
      </div>
      {authWindow && (
        <div className="auth-overlay">
          {authWindow === "login" && <Login closeWindow={() => setAuthWindow(null)} />}
          {authWindow === "signup" && <Signup closeWindow={() => setAuthWindow(null)} />}
        </div>
      )}
    </>
  );
};

export default HomePage;
