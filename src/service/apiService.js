import axios from "axios";
import { BASE_URL } from "../utils/constant";

// ==================================================================================================== //
// Fungsi utama untuk melakukan request API
export const apiRequest = async ({
  method,
  endpoint,
  body = null,
  token = null,
  contentType = "application/json",
}) => {
  const url = `${BASE_URL}${endpoint}`;
  let headers = { "Content-Type": contentType };

  if (!token) {
    token = localStorage.getItem("token");
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const hitAPI = async () => {
      switch (method.toUpperCase()) {
        case "POST":
          return axios.post(url, body, { headers });
        case "GET":
          return axios.get(url, { headers });
        case "PUT":
          return axios.put(url, body, { headers });
        case "DELETE":
          return axios.delete(url, { headers });
        case "PATCH":
          return axios.patch(url, body, { headers });
        default:
          throw new Error(`Metode HTTP tidak didukung: ${method}`);
      }
    };

    let response = await hitAPI();

    if (response.status === 401 && endpoint !== "/auth/login") {
      const newToken = await refreshToken(token);
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        response = await hitAPI();
      } else {
        throw new Error("Gagal memperbarui token");
      }
    }

    return response.data;
  } catch (error) {
    console.error(`Error pada request ${method} ${endpoint}:`, error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// ==================================================================================================== //
// Fungsi untuk menangani multipart request (upload file)
const handleMultipartRequest = async (method, url, headers, body) => {
  const formData = new FormData();
  Object.keys(body).forEach((key) => formData.append(key, body[key]));

  switch (method.toUpperCase()) {
    case "POST":
      return axios.post(url, formData, { headers });
    case "PUT":
      return axios.put(url, formData, { headers });
    default:
      throw new Error("Metode HTTP multipart tidak didukung");
  }
};

// ==================================================================================================== //
// Fungsi untuk memperbarui token jika sesi habis
const refreshToken = async (token) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, { token });
    localStorage.setItem("token", response.data.token);
    return response.data.token;
  } catch (error) {
    console.error("Gagal memperbarui token:", error);
    return null;
  }
};

// ==================================================================================================== //
// Fungsi untuk melakukan login
export const authLogin = async (email, password) => {
  return await apiRequest({
    method: "POST",
    endpoint: "/auth/login",
    body: { email, password, login_from: "web" },
  });
};

// Fungsi untuk logout
export const authLogout = async () => {
  return await apiRequest({
    method: "POST",
    endpoint: "/auth/logout",
  });
};

// Fungsi untuk mendapatkan daftar workspace
export const workspaceFind = async () => {
  const response = await apiRequest({
    method: "GET",
    endpoint: "/workspace",
  });
  return response?.data?.data || [];
};

// Fungsi untuk mereset password
export const resetPassword = async (email) => {
  const response = await apiRequest({
    method: "POST",
    endpoint: "/auth/reset-password",
    body: { email },
  });

  return response;
};

// ==================================================================================================== //
// Fungsi untuk mengubah password
export const changePassword = async (oldPassword, newPassword) => {
  return await apiRequest({
    method: "POST",
    endpoint: "/user/change-password",
    body: { old_password: oldPassword, new_password: newPassword },
  });
};
