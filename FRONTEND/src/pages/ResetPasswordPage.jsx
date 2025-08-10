import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`https://chattr-app.onrender.com/api/users/reset-password/${token}`, { password });
      setMessage(data.message);
    } catch (err) {
      setMessage('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" className="input mb-4" required />
        <button type="submit" className="btn">Update Password</button>
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
