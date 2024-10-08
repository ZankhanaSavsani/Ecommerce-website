import React, { useState } from 'react';
import axios from 'axios';

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/verify', { email, verificationCode });
      setMessage(response.data.message);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed!');
      setMessage('');
    }
  };

  return (
    <div className="verification-container">
      <h2>Email Verification</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Verification Code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default VerifyEmail;
