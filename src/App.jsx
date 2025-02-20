import React from 'react';
import FaceRegister from './FaceRegister';
import AttendenceIn from './AttendenceIn';


function App() {
  return (
    <div className="App">
      <h1>Face Attendance System</h1>
      <FaceRegister/>
      <hr />
      <AttendenceIn />
    </div>
  );
}

export default App;
