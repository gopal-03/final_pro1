import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceList = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to fetch attendance records for a given date
  const fetchAttendance = async (date) => {
    setLoading(true);
    try {
      // Example: if the backend supports a date query parameter
      const response = await axios.get(`https://ff56-120-60-211-151.ngrok-free.app/api/admin/attendancelist?date=${date}`);
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error("Error fetching attendance", error);
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // On component mount, set the default date to today and fetch today's attendance
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchAttendance(today);
  }, []);

  // Update attendance when the date selection changes
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchAttendance(newDate);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Date picker at the top right */}
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
      ) : (
        <>
          {attendanceRecords.length === 0 ? (
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
        </>
      )}
    </div>
  );
};

export default AttendanceList;
