import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceList = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper: get local date in YYYY-MM-DD format (adjusting for timezone)
  const getLocalDateString = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now - tzOffset).toISOString().split('T')[0];
  };

  const fetchAttendance = async (date) => {
    setLoading(true);
    setError(null);
    try {
      // Replace the URL below with your active ngrok URL.
      const response = await axios.get(
        `http://192.168.1.11:8080/api/admin/attendancelist?date=${date}`
      );
      const records = Array.isArray(response.data) ? response.data : [];
      setAttendanceRecords(records);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError("Error fetching attendance data.");
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // On mount, fetch attendance for today.
  useEffect(() => {
    const today = getLocalDateString();
    setSelectedDate(today);
    fetchAttendance(today);
  }, []);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchAttendance(newDate);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Attendance for {selectedDate}</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={handleDateChange} 
          style={{ padding: '5px', fontSize: '16px' }} 
        />
      </div>
      
      {loading ? (
        <p>Loading attendance...</p>
      ) : error ? (
        <p>{error}</p>
      ) : attendanceRecords.length === 0 ? (
        <p>No attendance records found for {selectedDate}</p>
      ) : (
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
            {attendanceRecords.map((record) => (
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
      )}
    </div>
  );
};

export default AttendanceList;
