import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define your API base URL
  const apiBaseUrl = "https://6d09-120-56-188-160.ngrok-free.app/api/attendance";

  // Fetch all attendance records on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBaseUrl}/allattendancelist`);
        setRecords(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch attendance data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiBaseUrl]);

  if (loading) return <p>Loading attendance...</p>;
  if (error) return <p>{error}</p>;
  if (records.length === 0) return <p>No attendance records found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Attendance Records</h2>
      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile No</th>
            <th>Department</th>
            <th>Age</th>
            <th>College</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id}>
              <td>{record.name}</td>
              <td>{record.mobno}</td>
              <td>{record.dept}</td>
              <td>{record.age}</td>
              <td>{record.college}</td>
              <td>{record.date}</td>
              <td>{record.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;
