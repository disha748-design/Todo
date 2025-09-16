import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./TodoList.css";

export default function TodoList({ user, category }) {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch todos for the selected category
  const fetchTodos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch todos error:", error);
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchTodos();
  }, [category, user]);

  // Add new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: text.trim(), user_id: user.id, category }])
      .select();

    if (error) {
      console.error("Add todo error:", error);
    } else if (data && data.length > 0) {
      setTodos((prev) => [data[0], ...prev]);
    }

    setText("");
  };

  // Toggle complete
  const toggleTodo = async (todo) => {
    const { error } = await supabase
      .from("todos")
      .update({ is_complete: !todo.is_complete })
      .eq("id", todo.id);

    if (error) console.error("Toggle todo error:", error);
    else fetchTodos();
  };

  // Delete todo
  const removeTodo = async (id) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Delete todo error:", error);
    } else {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="todo-container">
      <h2 className="todo-heading">{category} Todos</h2>

      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="todo-form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Add a new todo in ${category}`}
        />
        <button type="submit">Add</button>
      </form>

      {/* Todo List */}
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="empty-text">No todos yet.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((t) => (
            <li key={t.id} className={t.is_complete ? "completed" : ""}>
              <div className="todo-left">
                <input
                  type="checkbox"
                  checked={t.is_complete}
                  onChange={() => toggleTodo(t)}
                />
                <span className="todo-title">{t.title}</span>
              </div>
              <button className="delete-btn" onClick={() => removeTodo(t.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
