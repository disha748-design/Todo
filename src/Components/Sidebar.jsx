import "./Sidebar.css"

export default function Sidebar({ category, setCategory }) {
  const categories = ["Daily Life", "Study", "Work", "Job Prep"]
  return (
    <aside className="sidebar">
      <h3>Categories</h3>
      <ul>
        {categories.map(c => (
          <li 
            key={c} 
            className={category === c ? "active" : ""}
            onClick={() => setCategory(c)}
          >
            {c}
          </li>
        ))}
      </ul>
    </aside>
  )
}
