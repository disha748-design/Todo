import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import TodoList from "./components/TodoList"
import Mindmap from "./components/Mindmap"
import Diary from "./components/Diary"
import Pomodoro from "./components/Pomodoro"
import Profile from "./components/Profile"
import { ErrorBoundary } from "./ErrorBoundary"
import './App.css'

export default function App() {
  const [session, setSession] = useState(null)
  const [activeSection, setActiveSection] = useState("todos")
  const [category, setCategory] = useState("Daily Life")

  // Get current session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSession(data.session)
    })

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const renderContent = () => {
    switch(activeSection) {
      case "todos": return <TodoList session={session} category={category} />
      case "mindmap": return <Mindmap />
      case "diary": return <Diary />
      case "pomodoro": return <Pomodoro />
      case "profile": return <Profile session={session} />
      default: return null
    }
  }

  if (!session) return <Auth onLogin={(s) => setSession(s)} />

  return (
    <ErrorBoundary>
      <div className="app-container">
        <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="main-content">
          {/* Show sidebar only for todos section */}
          {activeSection === "todos" && (
            <Sidebar category={category} setCategory={setCategory} />
          )}
          <div className="content-area">
            {renderContent()}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
