import React, { useState } from "react";
import "../pages/styles/Login.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Fungsi untuk toggle visibility password
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted");
  };

  return (
    <div className="login-page">
      {/* Logo di atas form */}
      <div className="login-logo-container"></div>
      
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Input Username */}
          <div className="input-container">
            <FaUser className="icon" />
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              required
            />
          </div>

          {/* Input Password */}
          <div className="input-container">
            <FaLock className="icon" />
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              required
            />
            <button
              type="button"
              id="toggle-password"
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Tombol Login */}
          <button type="submit">Login</button>
        </form>

        {/* Tautan Lupa Password */}
        <div className="forgot-password">Forgot Password?</div>
      </div>
    </div>
  );
}

export default Login;
