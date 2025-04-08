import { Routes, Route } from 'react-router-dom'
import Login from './components/Login/Login'
import './App.css'
import WordleGame from './components/WordleGame/WordleGame'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<WordleGame></WordleGame>} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<h1>Profile</h1>} />
      </Routes>
    </>
  )
}

export default App
