import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Captcha from "./Captcha"; 
import "./Login.css";

const Login = ({ setCurrentUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState("");
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptcha(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (captchaInput !== captcha) {
      alert("Invalid Captcha!");
      return;
    }

    try {
      // Send login request to backend
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email: username,
        password: password
      });

      const user = response.data;

      alert("Login successful!");
      setCurrentUser(user);
      navigate("/admission");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Invalid Username or Password!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Captcha captcha={captcha} refresh={generateCaptcha} />
          <input
            type="text"
            placeholder="Enter Captcha"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">Login</button>
        </form>

        {/* Register / Signup Link */}
        <div className="register-link">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="signup-link">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
