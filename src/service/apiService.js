// src/service/apiService.js
import axios from "axios";

// Base URL untuk API
const API_URL = "https://yusnar.my.id/api-go-selarashomeid"; // Ganti dengan URL API sebenarnya

// Fungsi untuk mendapatkan token dari localStorage
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Fungsi untuk menambahkan header Authorization untuk setiap request
export const setAuthorizationHeader = () => {
  const token = getAuthToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Fungsi untuk login
export const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        login_from: "web",
      });
  
      // Jika login berhasil, simpan token dan data user di localStorage
      if (response.data.success) {
        const body = response.data;
        const token = body.data.token;
        const data = body.data.data;
        localStorage.setItem("token", token); // Menyimpan token
        localStorage.setItem("user", JSON.stringify(data)); // Menyimpan data user
        return response.data; // Kembalikan data login
      }
      return null;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed, please try again.");
    }
};

// Fungsi untuk logout dengan mengirimkan token di header Authorization
export const logout = async () => {
  try {
    setAuthorizationHeader(); // Pastikan header Authorization sudah di-set
    const response = await axios.post(`${API_URL}/auth/logout`);

    // Menghapus token dan data user dari localStorage setelah logout
    if (response.data.success) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return response.data; // Kembalikan respon logout
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Logout failed, please try again.");
  }
};
