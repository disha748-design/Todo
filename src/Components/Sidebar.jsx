import React from "react";
import "./Sidebar.css";

export default function Sidebar({ category, setCategory }) {
  const categories = ["Daily Life", "Study", "Work", "Job Prep"];

  return (
    <aside className="sidebar">
      <h3>Categories</h3>
      <ul>
        {categories.map((cat) => (
          <li
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>
    </aside>
  );
}
