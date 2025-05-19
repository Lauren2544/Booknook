import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function LoginSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? `${import.meta.env.VITE_API_URL}/api/auth/login` : `${import.meta.env.VITE_API_URL}/api/auth/signup`;
      const res = await axios.post(endpoint, { email, password }, { withCredentials: true });
      // Redirect to main app
      if (res.status === 200) {
        navigate('/'); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white text-gray-900 p-6 w-110 rounded-lg shadow-lg max-h-[120vh] overflow-y-auto border-4 border-dark-brown"
            >
        <h2 className="text-3xl font-serif text-center text-dark-brown mb-6 font-semibold">
          {isLogin ? "Welcome to Booknook" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-dark-brown text-lg mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 bg-gray-100 border border-dark-brown rounded focus:ring-2 focus:ring-brown-500"
            />
          </div>

          <div>
            <label className="block text-dark-brown text-lg mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 bg-gray-100 border border-dark-brown rounded focus:ring-2 focus:ring-brown-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded text-lg hover:bg-green-700 transition font-semibold hover:underline"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-dark-brown">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="!bg-gray-100 text-dark-brown py-2 rounded text-lg transition font-semibold focus:ring-1 hover:underline ml-1"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>

        </motion.div>
      </div>
  );
}