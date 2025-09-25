import React, { useState } from "react";
import "./Navbar.css";

export default function Navbar({ activeSection, setActiveSection, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sections = ["todos", "wellbeing", "diary", "pomodoro", "profile"];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>My Planner</h2>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </div>

      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {sections.map((sec) => (
          <li
            key={sec}
            className={activeSection === sec ? "active" : ""}
            onClick={() => {
              setActiveSection(sec);
              setMenuOpen(false);
            }}
          >
            {sec.charAt(0).toUpperCase() + sec.slice(1)}
          </li>
        ))}
      </ul>

      <div className="navbar-user">
        <img
          src={`https://ui-avatars.com/api/?name=${user?.username || user?.email}&background=6A9C89&color=F5E8B7`}
          alt="User"
          className="user-icon"
        />
      </div>
    </nav>
  );
}
