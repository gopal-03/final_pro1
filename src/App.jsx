// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminRegistration from './AdminPage/AdminRegistration';
import AdminLogin from './AdminPage/AdminLogin';
import AdminDashboard from './AdminPage/AdminDashboard';
import FaceRegister from './FaceRegister';
import AttendenceIn from './AttendenceIn';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/register">Admin Registration</Link>
            </li>
            <li>
              <Link to="/login">Admin Login</Link>
            </li>
            <li>
              <Link to="/faceRegister">Face Register</Link>
            </li>
            <li>
              <Link to="/FaceAttendence">Face Attendence</Link>
            </li>
          </ul>
        </nav>
        <Routes>
        <Route path="/faceRegister" element={<FaceRegister />} />
        <Route path="/FaceAttendence" element={<AttendenceIn />} />
          <Route path="/register" element={<AdminRegistration />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
