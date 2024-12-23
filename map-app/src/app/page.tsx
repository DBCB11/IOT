"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './Login.css'; // Add your styles here

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name || !password) {
      setErrorMessage('Please enter both name and password.');
      return;
    }

    try {
      const response = await fetch('http://203.171.20.94:9202/api/Users/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response.json();
      const token = data.token;

      if (token) {
        console.log('Bearer token:', token);
        alert('Login successful!');
        setErrorMessage('');
        // Navigate to the page.tsx with the token
        localStorage.setItem('token', token);
        router.push('/login');
      } else {
        throw new Error('No token received.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
