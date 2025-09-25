import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./Diary.css";

export default function Diary({ user }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null); // For modal

  // Fetch notes
  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("diary_notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setNotes(data);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  // Add new note
  const addNote = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const { data, error } = await supabase
      .from("diary_notes")
      .insert([{ user_id: user.id, title, content }])
      .select();
    if (error) console.error(error);
    else setNotes((prev) => [data[0], ...prev]);

    setTitle("");
    setContent("");
  };

  // Delete note
  const deleteNote = async (id) => {
    const { error } = await supabase.from("diary_notes").delete().eq("id", id);
    if (error) console.error(error);
    else setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <div className="section-card diary-container">
      <h2>♡ My Diary ♡</h2>

      {/* Add Note */}
      <form className="diary-form" onSubmit={addNote}>
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Add Note</button>
      </form>

      {/* Notes List */}
      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p>No notes yet. Start writing!</p>
      ) : (
        <ul className="diary-notes">
          {notes.map((note) => (
            <li key={note.id} className="diary-note-card">
              <h3 onClick={() => setSelectedNote(note)} className="note-title">
                {note.title || "Untitled"}
              </h3>
              <p>{note.content.slice(0, 50)}...</p>
              <small>{new Date(note.created_at).toLocaleString()}</small>
              <button onClick={() => deleteNote(note.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal for full note */}
      {selectedNote && (
        <div className="modal-overlay" onClick={() => setSelectedNote(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedNote(null)}>❌</button>
            <h2>{selectedNote.title || "Untitled"}</h2>
            <p>{selectedNote.content}</p>
            <small>{new Date(selectedNote.created_at).toLocaleString()}</small>
          </div>
        </div>
      )}
    </div>
  );
}
