import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminAttendancePage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Initialize selectedDate to today's date (formatted as "YYYY-MM-DD")
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Fetch users whenever the selected date changes
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api2/attendence?date=${selectedDate}`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Error fetching users");
      });
  }, [selectedDate]);

  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Date picker at the top right */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
        <label htmlFor="datePicker" style={{ marginRight: "10px" }}>
          Change Date:
        </label>
        <input
          id="datePicker"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Attendance Data Table */}
      <div style={{ textAlign: "center" }}>
        <h2>Registered Users for {selectedDate}</h2>
        <table style={{ margin: "0 auto", borderCollapse: "collapse", width: "80%" }}>
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
            {users.map((user) => (
              <tr key={user.id} style={{ border: "1px solid #aaa" }}>
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
    </div>
  );
}
