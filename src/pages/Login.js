import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authLogin, sendEmailForgotPassword } from "../service/apiService";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import {setAllCookiesUserData } from "../utils/general";
import bgImage from "../assets/img/rumah.jpg"
import logoImage from "../assets/img/logoselaras.png"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token')
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
      const response = await authLogin(email, password,);
      const msg =
      response.data?.message ??
      response.data?.data?.message ??
      "";
      
      console.log("ini respon"+response)
      console.log(msg)

      if (response && response.success === true) {
        const token = response.data.token;
        Cookies.set("token", token, { expires: 36500, secure: true, sameSite: "Strict" });
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
      }else {
        console.log("masuk else ", response)
        Swal.fire({
          title: "Gagal Login",
          text: response.error.data.message,
          icon: "error",
          confirmButtonColor:"#970321",
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
      icon: "info",
      title: "Forgot Password",
      input: "email",
      inputLabel: "Masukkan email Anda, Untuk Menerima Tautan Reset Password",
      inputPlaceholder: "contoh@gmail.com",
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      confirmButtonText: '<i class="fa fa-paper-plane" style="margin-right: 6px;"></i> Submit',
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
            confirmButtonColor:"#149746",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Email Tidak Ditemukan",
            text: "Mohon periksa kembali email yang Anda masukkan.",
            icon: "error",
            confirmButtonColor:"#970321",
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
    <div
      style={{
        position: 'relative',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
      className="d-flex justify-content-center align-items-center px-3"
    >
      {/* overlay darken */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      />

      {/* Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '70vh',
          margin: '0 auto',
          height: '100%',
          minHeight:'50%',
          maxHeight: '75vh',
          overflowY: 'auto',
        }}
        className="card shadow-lg p-3"
      >
        {/* Logo inside card */}
        <div className="text-center mb-4">
          <img
            src={logoImage}
            alt="Logo"
            style={{
              width: '50%',        
              maxWidth: '10vh',   
              height: 'auto',      
            }}
          />
        </div>

        <h2 className="text-center mb-4 fs-2">Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group input-group-lg mb-4">
            <span className="input-group-text bg-white fs-5">
              <FaUser />
            </span>
            <input
              type="email"
              className="form-control form-control-lg fs-6"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group input-group-lg mb-4">
            <span className="input-group-text bg-white fs-5">
              <FaLock />
            </span>
            <input
              type={passwordVisible ? 'text' : 'password'}
              className="form-control form-control-lg fs-5"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary btn-lg"
              onClick={togglePasswordVisibility}
            >
              <i className={passwordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'} />
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-danger btn-lg w-100 mb-3"
          >
            Login
          </button>
        </form>

        {/* Forgot */}
        <div
          onClick={handleForgotPassword}
          className="text-center text-primary fs-5 mb-2"
          style={{ cursor: 'pointer' }}
        >
          Forgot Password?
        </div>
      </div>
    </div>
  );
}

export default Login;
