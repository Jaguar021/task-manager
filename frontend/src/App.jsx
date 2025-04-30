import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Employee from './pages/employee/Employee'
import Client from './pages/client/Client'
import Admin from './pages/admin/Admin';
import Teamleader from './pages/teamleader/Teamleader';
import HomePage from './pages/homepage/Homepage';
import ProtectedRoute from './ProtectedRoute';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/employee" element={
        <ProtectedRoute allowedRole="employee">
          <Employee/>
        </ProtectedRoute>
      }/>

      <Route path="/client" element={
        <ProtectedRoute allowedRole="client">
          <Client/>
        </ProtectedRoute>
      }/>

      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin">
          <Admin/>
        </ProtectedRoute>
      }/>

      <Route path="/teamleader" element={
        <ProtectedRoute allowedRole="team leader">  {/* important: match exact string */}
          <Teamleader/>
        </ProtectedRoute>
      }/>
    </Routes>
  )
}

export default App
