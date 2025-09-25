import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./Pomodoro.css"; // custom CSS for Pomodoro

export default function Pomodoro({ user }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  // Fetch sessions count
  useEffect(() => {
    if (!user) return;
    const fetchSessions = async () => {
      const { count, error } = await supabase
        .from("pomodoro_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (!error) setSessions(count);
    };
    fetchSessions();
  }, [user]);

  // Timer interval
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Complete session
  useEffect(() => {
    if (!user) return;
    const completeSession = async () => {
      setIsRunning(false);
      setSeconds(0);
      const { error } = await supabase.from("pomodoro_sessions").insert([
        { user_id: user.id },
      ]);
      if (!error) setSessions((prev) => prev + 1);
    };
    if (seconds >= 25 * 60) completeSession();
  }, [seconds, user]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="pomodoro-wrapper">
      <div className="overlay">
        <h2>Pomodoro Timer</h2>

        <div className="timer-display">
          {minutes.toString().padStart(2, "0")}:
          {secs.toString().padStart(2, "0")}
        </div>

        <div className="timer-controls">
          <button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? "Pause" : "Start"}
          </button>
          <button onClick={() => setSeconds(0)}>Reset</button>
        </div>

        <p className="sessions-count">
          ✅ Sessions Completed: {sessions}
        </p>

        {!user && <p>Please log in to track your sessions.</p>}
      </div>
    </div>
  );
}
