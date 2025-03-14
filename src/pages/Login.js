import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authLogin, sendEmailForgotPassword } from "../service/apiService";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { getCookie, setAllCookiesUserData } from "../utils/general";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await authLogin(email, password);
      console.log(response)
      if (response && response.success === true) {
        const token = response.data.token;
        Cookies.set("token", token, { expires: 1, secure: true, sameSite: "Strict" });
        setAllCookiesUserData(response);
        
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
          text: response.error.data.message || "Silakan coba lagi!",
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
      });
    }
  };

  const handleForgotPassword = async () => {
    const { value: userEmail } = await Swal.fire({
      title: "Forgot Password",
      input: "email",
      inputLabel: "Masukkan email Anda",
      inputPlaceholder: "contoh@gmail.com",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Email tidak boleh kosong!";
        }
      },
    });

    if (userEmail) {
      try {
        const response = await sendEmailForgotPassword(userEmail);

        if (response.success) {
          Swal.fire({
            title: "Berhasil!",
            text: "Link reset password telah dikirim, mohon cek email.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Email Tidak Ditemukan",
            text: "Mohon periksa kembali email yang Anda masukkan.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (err) {
        Swal.fire({
          title: "Terjadi Kesalahan",
          text: "Mohon coba lagi nanti atau hubungi admin.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-logo-container"></div>

      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
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
            <button type="button" id="toggle-password" onClick={togglePasswordVisibility}>
              <i className={passwordVisible ? "bi bi-eye-slash" : "bi bi-eye"}></i>
            </button>
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="forgot-password" onClick={handleForgotPassword} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
          Forgot Password?
        </div>
      </div>
    </div>
  );
}

export default Login;
