import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateListing from './pages/CreateListing';
import AdminDashboard from './pages/AdminDashboard';
import LandlordDashboard from './pages/LandlordDashboard'; // Import
import StudentDashboard from './pages/StudentDashboard'; // Import

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* New Dashboard Routes */}
          <Route path="/dashboard/landlord" element={<LandlordDashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
