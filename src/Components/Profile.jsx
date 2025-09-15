import { supabase } from "./supabaseClient";
import "./Profile.css";

export default function Profile({ user, onLogout }) {
  if (!user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={
            user.user_metadata?.avatar_url ||
            "https://via.placeholder.com/80"
          }
          alt="avatar"
          className="profile-avatar"
        />
        <h2>{user.user_metadata?.full_name || "User"}</h2>
        <p>{user.email}</p>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
