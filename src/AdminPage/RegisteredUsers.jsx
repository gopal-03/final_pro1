import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.192.253:8080/api/registered-users')
         .then(response => setUsers(response.data))
         .catch(error => console.error('Error fetching users:', error));
  }, []);

  const getImageSrc = (faceImage) => {
    // Assuming faceImage is returned as a Base64 encoded string.
    return `data:image/jpeg;base64,${faceImage}`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Registered Users</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Username</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Mobile No</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Department</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>College</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>College Username</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Age</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Face Image</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.username}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.mobno}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.dept}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.college}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.collegeUsername}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.age}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {user.faceImage ? (
                  <img 
                    src={getImageSrc(user.faceImage)}
                    alt="Face"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                ) : 'No Image'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisteredUsers;
