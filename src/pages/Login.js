// src/pages/Login.js
import React, { useState } from "react";
import "../styles/Login.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Untuk navigasi
import { authLogin } from "../service/apiService"; // Mengimpor fungsi login
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await authLogin(email, password);

      if (response && response.success === true) {
        const token = response.data.token
        const email = response.data.data.email
        const name = response.data.data.name
        const id = response.data.data.id
        const roleId = response.data.data.role.id
        const divisiId = response.data.data.divisi.id
        const roleName = response.data.data.role.name
        const divisiName = response.data.data.divisi.name
        localStorage.setItem("token", token)
        localStorage.setItem("email", email)
        localStorage.setItem("name", name)
        localStorage.setItem("id", id)
        localStorage.setItem("roleId", roleId)
        localStorage.setItem("divisiId", divisiId)
        localStorage.setItem("roleName", roleName)
        localStorage.setItem("divisiName", divisiName)
        Swal.fire({
          title: "Berhasil Login",
          text: "Anda akan dialihkan...",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/home");
        });
      } else {
        Swal.fire({
          title: "Gagal Login",
          text: "Silakan coba lagi!",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          setEmail("");
          setPassword("");
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Terjadi Kesalahan",
        text: "Mohon hubungi admin anda!",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  };

  return (
    <div className="login-page">
      <div className="login-logo-container"></div>

      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Input Email */}
          <div className="input-container">
            <FaUser className="icon" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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