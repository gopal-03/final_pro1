// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminRegistration from './AdminPage/AdminRegistration';
import AdminLogin from './AdminPage/AdminLogin';
import AdminDashboard from './AdminPage/AdminDashboard';
import FaceRegister from './FaceRegister';
import AttendanceList from './AdminPage/AttendanceList';
import RegisteredUsers from './AdminPage/RegisteredUsers';
import './App.css';

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
            
          </ul>
        </nav>
        <Routes>
        <Route path="/faceRegister" element={<FaceRegister />} />
          <Route path="/register" element={<AdminRegistration />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/admindashboard/attendancelist" element={<AttendanceList/>} />
          <Route path="/admindashboard/registered-users" element={<RegisteredUsers/>} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
