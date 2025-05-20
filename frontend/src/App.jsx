import React from 'react';
import './App.css';
import Layout from './layout/layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Services from './pages/Services';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import Doctors from './pages/Doctors/Doctors';
import DoctorDetails from './pages/Doctors/DoctorDetails';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:id" element={<DoctorDetails />} />
        <Route path="services" element={<Services />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}

export default App
