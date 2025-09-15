import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './TodoList.css'

export default function TodoList({ session, category }) {
  const userId = session.user.id
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [newCategory, setNewCategory] = useState(category)

  const categories = ["Daily Life", "Study", "Work", "Job Prep"]

  async function fetchTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setTodos(data)
  }

  useEffect(() => {
    fetchTodos()
  }, [category]) // refetch when category changes

  async function addTodo(e) {
    e.preventDefault()
    if (!text.trim()) return
   const { data, error } = await supabase
  .from('todos')
  .insert([{ title: text.trim(), user_id: userId, category }])

    if (error) console.error(error)
    else {
      setText('')
      setTodos(prev => [data[0], ...prev])
    }
  }

  async function toggle(todo) {
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !todo.is_complete })
      .eq('id', todo.id)
    if (error) console.error(error)
    else fetchTodos()
  }

  async function remove(todoId) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)
    if (error) console.error(error)
    else setTodos(prev => prev.filter(t => t.id !== todoId))
  }

  return (
    <div className="todo-container">
      <div className="todo-card">
        <h2>{category} Todos</h2>
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add a todo"
          />
          <select
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button type="submit">Add</button>
        </form>

        <ul className="todo-list">
          {todos.map(t => (
            <li key={t.id}>
              <div className="todo-item-left">
                <input
                  type="checkbox"
                  checked={t.is_complete}
                  onChange={() => toggle(t)}
                />
                <span style={{ textDecoration: t.is_complete ? 'line-through' : 'none' }}>
                  {t.title}
                </span>
              </div>
              <button onClick={() => remove(t.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
