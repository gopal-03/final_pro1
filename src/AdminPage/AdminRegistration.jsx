import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegistration = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    mobileNumber: '',
    collegeName: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.1.7:8080/api/admin/register', formData);
      setMessage(response.data);
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data || 'Registration failed.');
    }
  };

  return (
    <div className="container">
      <h2>Admin Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Mobile Number:</label>
          <input 
            type="text" 
            name="mobileNumber" 
            value={formData.mobileNumber} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>College Name:</label>
          <input 
            type="text" 
            name="collegeName" 
            value={formData.collegeName} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Re-enter Password:</label>
          <input 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminRegistration;
