import React, { useState } from 'react' 
import './App.css'
import Layout from './layout/layout'
import DoctorDetails from './pages/Doctors/DoctorDetails'
import { Routes, Route } from 'react-router-dom'
import Doctors from './pages/Doctors/Doctors'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Layout />
      <Routes>
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
      </Routes>
    </>
  )
}

export default App
