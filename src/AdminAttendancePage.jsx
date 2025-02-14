import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminAttendancePage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api2/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setError("Error fetching users");
      });
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Registered Users</h2>
      <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Mail ID</th>
            <th>Mobile Number</th>
            <th>Department</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ border: '1px solid #aaa' }}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.mailId}</td>
              <td>{user.mobNo}</td>
              <td>{user.dept}</td>
              <td>{user.date}</td>
              <td>{user.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAttendancePage;
