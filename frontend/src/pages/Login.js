import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email.endsWith('@chitkara.edu.in')) {
      alert('Please use your chitkara.edu.in email to login.');
      return;
    }

    if (email === 'admin@chitkara.edu.in' && password === 'admin123') {
      localStorage.setItem('userRole', 'admin');
      alert('Welcome Admin!');
      navigate('/admin');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const userData = {
          name: response.data.user.name,
          email: response.data.user.email,
          profilePic: response.data.user.profilePic || 'https://i.pravatar.cc/150?img=47',
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        alert('Login successful!');
        navigate('/');
      }
    } catch (error) {
      alert(error.response.data.msg || 'Invalid credentials');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-form">
          <div className="logo-container">
            <div className="logo">CM</div>
          </div>

          <h2>Welcome back!</h2>
          <p>Enter to get unlimited access to Campus Marketplace.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label>College Email <span>*</span></label>
              <input name="email" type="email" placeholder="Enter your college email" required />
            </div>

            <div>
              <label>Password <span>*</span></label>
              <div className="password-input">
                <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" required />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>

              <div className="password-options">
                <label>
                  <input type="checkbox" /> <span>Remember me</span>
                </label>
                <Link to="/forgot-password">Forgot your password?</Link>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Log In
            </button>

            <div className="divider">
              <span>Or, login with</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn btn-secondary">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" /> Continue with Google
            </button>
          </form>

          <p>
            Don’t have an account?
            <Link to="/signup">Register here</Link>
          </p>
        </div>
      </div>

      <div className="auth-image-container"
        style={{ backgroundImage: "url('/marketplace.jpg')" }}></div>
    </div>
  );
};

export default Login;
