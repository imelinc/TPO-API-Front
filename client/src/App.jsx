import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/navbar.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Bienvenido a PressPlay 🎮</h1>
        <p>Tu tienda de videojuegos favorita</p>
      </main>

      {/* Rutas mínimas (vacías por ahora) */}
      <Routes>
        {/* Ejemplos futuros:
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        */}
      </Routes>
    </>
  )
}

export default App
