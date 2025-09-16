import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Pages/Auth";
import Navbar from "./Components/Navbar";
import Sidebar from "./components/Sidebar";
import TodoList from "./components/TodoList";
import Mindmap from "./components/Mindmap";
import Diary from "./Components/Diary";
import Pomodoro from "./components/Pomodoro";
import Profile from "./Components/Profile";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("todos");
  const [category, setCategory] = useState("Daily Life");

  useEffect(() => {
    const sessionUser = supabase.auth.getUser();
    sessionUser.then(({ data }) => {
      if (data.user) setUser(data.user);
    });
  }, []);

  if (!user) return <Auth onLogin={setUser} />;

  const renderContent = () => {
    switch (activeSection) {
      case "todos":
        return <TodoList user={user} category={category} />;
      case "mindmap":
        return <Mindmap />;
      case "diary":
        return <Diary />;
      case "pomodoro":
        return <Pomodoro />;
      case "profile":
        return <Profile user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-content">
        {activeSection === "todos" && (
          <Sidebar category={category} setCategory={setCategory} />
        )}
        <div className="content-area">{renderContent()}</div>
      </div>
    </div>
  );
}
