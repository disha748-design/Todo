import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./Wellbeing.css";

export default function Wellbeing({ user }) {
  const [mood, setMood] = useState(5);
  const [gratitude, setGratitude] = useState("");
  const [gratitudeList, setGratitudeList] = useState([]);
  const [quote, setQuote] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  // Fetch gratitude notes
  const fetchGratitude = async () => {
    const { data, error } = await supabase
      .from("gratitude_notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) console.error("Error fetching gratitude:", error);
    else setGratitudeList(data || []);
  };

  // Fetch mood logs
  const fetchMoodHistory = async () => {
    const { data, error } = await supabase
      .from("mood_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(7);

    if (error) console.error("Error fetching mood:", error);
    else setMoodHistory(data || []);
  };

  // Fetch random quote from API
 // Fetch random quote from API
const fetchQuote = async () => {
  try {
    const res = await fetch(
      "https://api.jsongpt.com/json?prompt=Generate%207%20motivational%20quotes&quotes=array%20of%20quotes"
    );
    const data = await res.json();

    // If API returns { quotes: ["...", "...", "..."] }
    if (data.quotes && Array.isArray(data.quotes)) {
      const randomIndex = Math.floor(Math.random() * data.quotes.length);
      setQuote({ quote: data.quotes[randomIndex], author: null });
    } else {
      console.error("Unexpected quote response:", data);
    }
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
};

  useEffect(() => {
    if (user) {
      fetchGratitude();
      fetchMoodHistory();
      fetchQuote();
    }
  }, [user]);

  // Add mood log
  const addMood = async () => {
    const { error } = await supabase
      .from("mood_logs")
      .insert([{ user_id: user.id, mood }]);

    if (error) console.error("Error saving mood:", error);
    else fetchMoodHistory();
  };

  // Add gratitude
  const addGratitude = async (e) => {
    e.preventDefault();
    if (!gratitude.trim()) return;

    const { data, error } = await supabase
      .from("gratitude_notes")
      .insert([{ user_id: user.id, note: gratitude }])
      .select();

    if (error) {
      console.error("Error adding gratitude:", error);
    } else {
      setGratitudeList((prev) => [data[0], ...prev]);
      setGratitude("");
    }
  };

  // Delete gratitude
  const deleteGratitude = async (id) => {
    const { error } = await supabase
      .from("gratitude_notes")
      .delete()
      .eq("id", id);

    if (error) console.error("Error deleting gratitude:", error);
    else setGratitudeList((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="wellbeing-container">
      <h2>🌿 Wellbeing</h2>

      {/* Daily Quote */}
      <div className="wellbeing-section">
        <h3>💡 Daily Motivation</h3>
        {quote ? (
          <blockquote>
            “{quote.quote}” {quote.author && <footer>- {quote.author}</footer>}
          </blockquote>
        ) : (
          <p>Loading quote...</p>
        )}
      </div>

      {/* Mood Journal */}
      <div className="wellbeing-section">
        <h3>Mood Journal</h3>
        <div className="mood-input">
          <label>How are you feeling (1–10)?</label>
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
          />
          <span>{mood}</span>
          <button onClick={addMood}>Log Mood</button>
        </div>
        <div className="mood-history">
          {moodHistory.length === 0 ? (
            <p>No moods logged yet.</p>
          ) : (
            moodHistory.map((m) => (
              <div key={m.id} className="mood-item">
                <span>{m.mood} / 10</span>
                <small>{new Date(m.created_at).toLocaleDateString()}</small>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Gratitude Notes */}
      <div className="wellbeing-section">
        <h3>Gratitude Notes</h3>
        <form onSubmit={addGratitude}>
          <input
            type="text"
            placeholder="Write one good thing..."
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        <ul className="gratitude-list">
          {gratitudeList.length === 0 ? (
            <p>No gratitude notes yet.</p>
          ) : (
            gratitudeList.map((g) => (
              <li key={g.id} className="gratitude-item">
                <span>
                  {g.note}{" "}
                  <small>({new Date(g.created_at).toLocaleDateString()})</small>
                </span>
                <button onClick={() => deleteGratitude(g.id)}>❌</button>
              </li>
            ))
          )}
        </ul>
      </div>

    </div>
  );
}
