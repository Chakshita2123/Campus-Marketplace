import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const navigate = useNavigate();

  const checkPasswordStrength = (pass) => {
    const len = pass.length >= 8;
    const upper = /[A-Z]/.test(pass);
    const lower = /[a-z]/.test(pass);
    const num = /\d/.test(pass);
    const special = /[!@#$%^&*]/.test(pass);
    const passed = [len, upper, lower, num, special].filter(Boolean).length;

    if (passed <= 2) {
      setPasswordStrength('Weak password');
    } else if (passed === 3 || passed === 4) {
      setPasswordStrength('Medium strength');
    } else {
      setPasswordStrength('Strong password');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (!email.endsWith('@chitkara.edu.in')) {
      alert('Please use your chitkara.edu.in email to signup.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!strongPassword.test(password)) {
      alert(
        'Password must have 8+ characters, one uppercase, one lowercase, one number, and one special symbol.'
      );
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      if (response.data) {
        alert('Account created successfully!');
        navigate('/login');
      }
    } catch (error) {
      alert(error.response.data.msg || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-form">
          <div className="logo-container">
            <div className="logo">CM</div>
          </div>

          <h2>Create an account</h2>
          <p>Join the marketplace and start exploring today.</p>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label>Full Name <span>*</span></label>
              <input name="name" type="text" placeholder="Enter your name" required />
            </div>

            <div>
              <label>College Email <span>*</span></label>
              <input name="email" type="email" placeholder="Enter your college email" required />
            </div>

            <div>
              <label>Password <span>*</span></label>
              <div className="password-input">
                <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password"
                  value={password}
                  onChange={handlePasswordChange}
                  required />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
              <p className="password-strength">{passwordStrength}</p>
            </div>

            <div>
              <label>Confirm Password <span>*</span></label>
              <div className="password-input">
                <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" required />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </form>

          <p>
            Already have an account?
            <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>

      <div className="auth-image-container"
        style={{ backgroundImage: "url('/marketplace.jpg')" }}></div>
    </div>
  );
};

export default Signup;
