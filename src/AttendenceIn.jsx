import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceList = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Returns the local date in "YYYY-MM-DD" format.
  const getLocalDateString = () => {
    const now = new Date();
    // Adjust for timezone offset so that the date reflects local time
    const tzOffset = now.getTimezoneOffset() * 60000; 
    return new Date(now - tzOffset).toISOString().split('T')[0];
  };

  const fetchAttendance = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://74c6-120-60-34-101.ngrok-free.app/api/admin/attendancelist?date=${date}`
      );
      // Ensure that response data is an array.
      const records = Array.isArray(response.data) ? response.data : [];
      setAttendanceRecords(records);
    } catch (err) {
      console.error("Error fetching attendance", err);
      setError("Error fetching attendance data.");
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // On component mount, set default date to local today and fetch attendance.
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
      <h2>Attendance List</h2>
      {/* Date picker */}
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
        <table 
          style={{ width: '100%', borderCollapse: 'collapse' }} 
          border="1" 
          cellPadding="5" 
          cellSpacing="0"
        >
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
