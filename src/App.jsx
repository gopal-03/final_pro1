// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Register, Identify } from './FaceComponents';
import AdminAttendancePage from './AdminAttendancePage';

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <nav>
          <ul style={{ listStyle: "none", display: "flex", gap: "20px" }}>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/identify">Identify</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/admin" element={<AdminAttendancePage/>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/identify" element={<Identify />} />
          <Route path="*" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
