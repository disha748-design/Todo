import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Pages/Auth";
import Navbar from "./Components/Navbar";
import Sidebar from "./components/Sidebar";
import TodoList from "./components/TodoList";
import Diary from "./Components/Diary";
import Pomodoro from "./components/Pomodoro";
import Profile from "./Components/Profile";
import "./App.css";
import Wellbeing from "./Components/Wellbeing";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("todos");
  const [category, setCategory] = useState("Daily Life");

  // Load current session/user on mount
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("getUser error:", error);
        return;
      }
      if (mounted && data?.user) setUser(data.user);
    }

    loadUser();

    // Subscribe to auth state changes to update user on login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) setUser(session.user);
        else setUser(null);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Called by Auth after successful login/signup
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  // Called by Profile on logout
  const handleLogout = () => {
    setUser(null);
  };

  if (!user)
    return <Auth onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeSection) {
      case "todos":
        return <TodoList user={user} category={category} />;
      case "wellbeing":
        return <Wellbeing user={user} />;
      case "diary":
        return <Diary user={user} />;
      case "pomodoro":
        return <Pomodoro user={user} />;
      case "profile":
        return <Profile user={user} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
      />
      <div className="main-content">
        {activeSection === "todos" && (
          <Sidebar category={category} setCategory={setCategory} />
        )}
        <div className="content-area">{renderContent()}</div>
      </div>
    </div>
  );
}
