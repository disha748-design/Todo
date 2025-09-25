import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Profile.css";

export default function Profile({ user, onLogout }) {
  const [stats, setStats] = useState({
    studyHours: 0,
    tasksCompleted: 0,
    tasksLeft: 0,
  });

  if (!user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: sessions } = await supabase
          .from("pomodoro_sessions")
          .select("completed_at")
          .eq("user_id", user.id);

        const totalMinutes = sessions?.length * 25 || 0;
        const totalHours = (totalMinutes / 60).toFixed(1);

        const { data: todos } = await supabase
          .from("todos")
          .select("is_complete")
          .eq("user_id", user.id);

        const tasksCompleted = todos?.filter((t) => t.is_complete).length || 0;
        const tasksLeft = (todos?.length || 0) - tasksCompleted;

        setStats({ studyHours: totalHours, tasksCompleted, tasksLeft });
      } catch (err) {
        console.error("Error fetching stats:", err.message);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="profile-card">
      <p className="profile-email">{user.email}</p>

      <div className="profile-stats">
        <div className="stat-box">
          <h3>{stats.studyHours}</h3>
          <p>Hours Studied</p>
        </div>
        <div className="stat-box">
          <h3>{stats.tasksCompleted}</h3>
          <p>Tasks Completed</p>
        </div>
        <div className="stat-box">
          <h3>{stats.tasksLeft}</h3>
          <p>Tasks Left</p>
        </div>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}
