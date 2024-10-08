import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/login', formData);
      setSuccessMessage(response.data.message || 'Login successful!');
      setError(null);
      
      // Navigate to the desired route after a successful login
      navigate('/'); // You can change this to any route you want to navigate to

      // Reset form fields
      setFormData({
        email: '',
        password: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed!');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background">
      <div className="shape"></div>
      <div className="shape right-shape"></div> {/* Added right shape for corner circle */}
      <form onSubmit={handleSubmit}>
        <h3>Login Here</h3>

        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        {/* Registration button inside the form */}
        <button 
          type="button" 
          onClick={() => navigate('/register')} 
          style={{ marginTop: '15px', backgroundColor: 'transparent', color: '#ffffff', border: '2px solid #ffffff', padding: '10px 0', fontSize: '16px', fontWeight: '600', borderRadius: '5px', cursor: 'pointer' }}>
          Go to Registration
        </button>
      </form>

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
          width: 430px;
          height: 520px;
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
        .shape:first-child {
          background: linear-gradient(#1845ad, #23a2f6);
          left: -80px;
          top: -80px;
        }
        .shape.right-shape { /* Styles for the right shape */
          background: linear-gradient(to right, #ff512f, #f09819);
          right: -30px;
          bottom: -80px;
        }
        form {
          height: 520px;
          width: 400px;
          background-color: rgba(255, 255, 255, 0.13);
          position: absolute;
          transform: translate(-50%, -50%);
          top: 50%;
          left: 50%;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
          padding: 50px 35px;
        }
        form * {
          font-family: 'Poppins', sans-serif;
          color: #ffffff;
          letter-spacing: 0.5px;
          outline: none;
          border: none;
        }
        form h3 {
          font-size: 32px;
          font-weight: 500;
          line-height: 42px;
          text-align: center;
        }
        label {
          display: block;
          margin-top: 30px;
          font-size: 16px;
          font-weight: 500;
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
        }
        ::placeholder {
          color: #e5e5e5;
        }
        button {
          margin-top: 20px; /* Adjusted margin */
          width: 100%;
          background-color: #ffffff;
          color: #080710;
          padding: 15px 0;
          font-size: 18px;
          font-weight: 600;
          border-radius: 5px;
          cursor: pointer;
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

export default LoginPage;
