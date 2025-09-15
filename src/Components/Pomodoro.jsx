import { useState, useEffect } from 'react'
import './Section.css'

export default function Pomodoro() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => setSeconds(prev => prev + 1), 1000)
    } else if (!isRunning && interval) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <div className="section-card">
      <h2>Pomodoro Timer</h2>
      <div style={{ fontSize: '2rem', margin: '20px 0' }}>
        {minutes.toString().padStart(2,'0')}:{secs.toString().padStart(2,'0')}
      </div>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => setSeconds(0)} style={{ marginLeft: '10px' }}>Reset</button>
    </div>
  )
}
