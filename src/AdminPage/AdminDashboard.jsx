import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const username = sessionStorage.getItem("username");
  const collegeName = sessionStorage.getItem("collegeName");
  const navigate = useNavigate();

  const handleAttendance = () => {
    navigate("/admindashboard/attendancelist");
  };

  const handleRegisteredUsers = () => {
    navigate("/admindashboard/registered-users");
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{collegeName}</h1>
      <h2>Welcome {username}</h2>
      <div style={{ marginTop: '30px' }}>
        <button onClick={handleAttendance} style={{ marginRight: '10px', padding: '10px 20px' }}>
          Attendance
        </button>
        <button onClick={handleRegisteredUsers} style={{ padding: '10px 20px' }}>
          Registered Users
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
