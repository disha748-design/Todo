import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./Section.css";

export default function Pomodoro({ user }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  // Fetch sessions from DB on mount (only if user exists)
  useEffect(() => {
    if (!user) return; // ⬅️ guard against undefined

    const fetchSessions = async () => {
      const { count, error } = await supabase
        .from("pomodoro_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (error) console.error(error);
      else setSessions(count);
    };

    fetchSessions();
  }, [user]); // ✅ depend on user, not user.id directly

  // Timer interval
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // When a session completes (25 min = 1500 sec)
  useEffect(() => {
    if (!user) return; // ⬅️ guard here too

    const completeSession = async () => {
      setIsRunning(false);
      setSeconds(0);

      const { error } = await supabase.from("pomodoro_sessions").insert([
        {
          user_id: user.id,
        },
      ]);

      if (error) console.error(error);
      else setSessions((prev) => prev + 1);
    };

    if (seconds >= 25 * 60) {
      completeSession();
    }
  }, [seconds, user]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (!user) {
    return (
      <div className="section-card">
        <h2>Pomodoro Timer</h2>
        <p>Please log in to start tracking your sessions.</p>
      </div>
    );
  }

  return (
    <div className="section-card">
      <h2>Pomodoro Timer</h2>

      <div style={{ fontSize: "2.5rem", margin: "20px 0" }}>
        {minutes.toString().padStart(2, "0")}:
        {secs.toString().padStart(2, "0")}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={() => setSeconds(0)}>Reset</button>
      </div>

      <p style={{ marginTop: "20px", fontSize: "1.2rem", color: "#3E5F44" }}>
        ✅ Sessions Completed: {sessions}
      </p>
    </div>
  );
}
