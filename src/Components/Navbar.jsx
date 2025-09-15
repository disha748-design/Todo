import "./Navbar.css"

export default function Navbar({ activeSection, setActiveSection }) {
  const links = ["todos", "mindmap", "diary", "pomodoro", "profile"]
  return (
    <nav className="navbar">
      <h2>My Dashboard</h2>
      <ul>
        {links.map(link => (
          <li 
            key={link} 
            className={activeSection === link ? "active" : ""}
            onClick={() => setActiveSection(link)}
          >
            {link.charAt(0).toUpperCase() + link.slice(1)}
          </li>
        ))}
      </ul>
    </nav>
  )
}
