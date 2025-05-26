import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceList = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  // Use a departments state to hold the list of options.
  const [departments, setDepartments] = useState(['All']);
  const [newDepartment, setNewDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper: get local date in YYYY-MM-DD format (adjusting for timezone)
  const getLocalDateString = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now - tzOffset).toISOString().split('T')[0];
  };

  const fetchAttendance = async (date, department) => {
    setLoading(true);
    setError(null);
    try {
      let url = `http://192.168.1.7:8080/api/admin/attendancelist?date=${date}`;
      // Add department parameter if a specific department is selected.
      if (department && department !== 'All') {
        url += `&department=${department}`;
      }
      const response = await axios.get(url);
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
    fetchAttendance(today, selectedDepartment);
  }, []);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchAttendance(newDate, selectedDepartment);
  };

  const handleDepartmentChange = (e) => {
    const newDepartmentSelected = e.target.value;
    setSelectedDepartment(newDepartmentSelected);
    fetchAttendance(selectedDate, newDepartmentSelected);
  };

  // Add new department to the dropdown dynamically.
  const handleAddDepartment = () => {
    const trimmedDept = newDepartment.trim();
    if (trimmedDept !== '' && !departments.includes(trimmedDept)) {
      setDepartments(prev => [...prev, trimmedDept]);
      setNewDepartment('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Attendance for {selectedDate}</h2>
      <div 
        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}
      >
        <input 
          type="date" 
          value={selectedDate} 
          onChange={handleDateChange} 
          style={{ padding: '5px', fontSize: '16px' }} 
        />
        <div>
          <select 
            value={selectedDepartment} 
            onChange={handleDepartmentChange} 
            style={{ padding: '5px', fontSize: '16px', marginRight: '10px' }}
          >
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
          <input 
            type="text" 
            value={newDepartment} 
            onChange={(e) => setNewDepartment(e.target.value)} 
            placeholder="Add department" 
            style={{ padding: '5px', fontSize: '16px' }}
          />
          <button 
            onClick={handleAddDepartment} 
            style={{ padding: '5px 10px', fontSize: '16px', marginLeft: '5px' }}
          >
            Add Department
          </button>
        </div>
      </div>
      
      {loading ? (
        <p>Loading attendance...</p>
      ) : error ? (
        <p>{error}</p>
      ) : attendanceRecords.length === 0 ? (
        <p>
          No attendance records found for {selectedDate} 
          {selectedDepartment !== 'All' && ` in ${selectedDepartment}`}
        </p>
      ) : (
        <table 
          border="1" 
          cellPadding="5" 
          cellSpacing="0" 
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile No</th>
              <th>Department</th>
              <th>Age</th>
              <th>College</th>
              <th>Date</th>
              <th>In Time</th>
              <th>Out Time</th>
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
                <td>{record.inTime}</td>
                <td>{record.outTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceList;
