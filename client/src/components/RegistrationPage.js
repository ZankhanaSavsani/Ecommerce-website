import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import VerifyEmail from './VerifyEmail'; // Adjust the path based on your structure

const RegistrationPage = () => {
  const navigate = useNavigate(); // Initialize navigate

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // New field for confirm password
    phone: '',
    street: '',
    apartment: '',
    zip: '',
    city: '',
    country: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false); // New state for verification

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear messages on input change
    setError(null);
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/register', formData);
      setSuccessMessage(response.data.message || 'Registration successful! Please verify your email.');
      setError(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '', // Reset confirm password
        phone: '',
        street: '',
        apartment: '',
        zip: '',
        city: '',
        country: '',
      });
      setIsVerifying(true); // Show verification component on success
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
      setSuccessMessage('');
    }
  };

  return (
    <div className="background">
      <div className="shape left"></div> {/* Left circle */}
      <div className="shape right"></div> {/* Right circle */}
      <div className="registration-container">
        <h3>Registration</h3>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        
        {/* Render the verification component if the user is verifying */}
        {isVerifying ? (
          <VerifyEmail />
        ) : (
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-sections">
              <div className="form-section">
                <h4>Personal Information</h4>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword" // New confirm password field
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-section">
                <h4>Address Information</h4>
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={formData.street}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment"
                  value={formData.apartment}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="zip"
                  placeholder="Zip"
                  value={formData.zip}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Buttons Section */}
            <div className="buttons-section">
              <button type="submit">Register</button>
              <button type="button" onClick={() => navigate('/login')}>
                Go to Login
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        * {
          padding: 0;
          margin: 0;
          box-sizing: border-box;
        }
        body {
          background-color: #080710;
        }
        .background {
          width: 600px; 
          height: auto; 
          position: absolute;
          transform: translate(-50%, -50%);
          left: 50%;
          top: 50%;
        }
        .shape {
          height: 200px;
          width: 200px;
          position: absolute;
          border-radius: 50%;
        }
        .shape.left {
          background: linear-gradient(#1845ad, #23a2f6);
          left: -250px;
          top: -360px;
        }
        .shape.right {
          background: linear-gradient(to right, #ff512f, #f09819);
          right: -250px; 
          bottom: -360px; 
        }
        .registration-container {
          height: auto;
          width: 900px; 
          background-color: rgba(255, 255, 255, 0.13);
          position: absolute;
          transform: translate(-50%, -50%);
          top: 50%;
          left: 50%;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
          padding: 20px 30px;
        }
        h3 {
          font-size: 32px;
          font-weight: 500;
          line-height: 42px;
          text-align: center;
          color: #ffffff;
        }
        .form-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .form-sections {
          display: flex;
          justify-content: space-between;
        }
        .form-section {
          width: 48%; 
        }
        h4 {
          font-size: 18px;
          color: #ffffff; /* Changed to white */
          margin-bottom: 10px;
        }
        input {
          display: block;
          height: 50px;
          width: 100%;
          background-color: rgba(255, 255, 255, 0.07);
          border-radius: 3px;
          padding: 0 10px;
          margin-top: 8px;
          font-size: 14px;
          font-weight: 300;
          color: #ffffff;
        }
        .buttons-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
        }
        button {
          width: 100%;
          background-color: #ffffff;
          color: #080710;
          padding: 15px 0;
          font-size: 18px;
          font-weight: 600;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-top: 10px; /* Adds space between buttons */
        }
        button:hover {
          background-color: #e6e6e6; 
        }
        .error {
          color: red;
          text-align: center;
        }
        .success {
          color: green;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default RegistrationPage;
