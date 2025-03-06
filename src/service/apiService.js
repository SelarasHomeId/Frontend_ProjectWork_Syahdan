import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { getCookie } from "../utils/general";
import Cookies from "js-cookie";

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
    token = getCookie("token");
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
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
  
  try {
    let response = await hitAPI();
    return response.data;
  } catch (error) {
    if (error.status === 401 && endpoint !== "/auth/login") {
      const newToken = await refreshToken();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        let response = await hitAPI();
        return response.data
      } else {
        throw new Error("Gagal memperbarui token");
      }
    }
    console.error(`Error pada request ${method} ${endpoint}:`, error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// ==================================================================================================== //
// Fungsi untuk memperbarui token jika sesi habis
const refreshToken = async () => {
  const response = await apiRequest({
    method: "POST",
    endpoint: "/auth/refresh-token",
  })
  Cookies.set("token", response.data.token, { expires: 1, secure: true, sameSite: "Strict" });
  return response.data.token;
};

// ==================================================================================================== //
// AUTHENTICATION (Login, Logout, Reset Password)
export const authLogin = async (email, password) => {
  return await apiRequest({
    method: "POST",
    endpoint: "/auth/login",
    body: { email, password, login_from: "web" },
  });
};

export const authLogout = async () => {
  return await apiRequest({
    method: "POST",
    endpoint: "/auth/logout",
  });
};

export const sendEmailForgotPassword = async (email) => {
  return await apiRequest({
    method: "POST",
    endpoint: "/auth/send-email/forgot-password",
    body: { email },
  });
};

export const changePassword = async (oldPassword, newPassword) => {
  const id = getCookie("id");
  return await apiRequest({
    method: "PATCH",
    endpoint: `/user/change-password/${id}`,
    body: { old_password: oldPassword, new_password: newPassword },
  });
};

// ==================================================================================================== //
// NOTIFICATIONS
export const fetchNotifications = async () => {
  const response = await apiRequest({
    method: "GET",
    endpoint: "/notifikasi?order=created_at&order_by=desc",
  });
  return response
};

export const markNotificationAsRead = async (notificationId) => {
  return await apiRequest({
    method: "PUT",
    endpoint: `/notifikasi/set-read/${notificationId}`,
  });
};

// ==================================================================================================== //
// WORKSPACE
export const workspaceFind = async () => {
  const response = await apiRequest({
    method: "GET",
    endpoint: "/workspace",
  });
  return response?.data?.data || [];
};

// ==================================================================================================== //
// USER MANAGEMENT (CRUD)
export const getAllUser = async (endpoint) => {
  return await apiRequest({
    method: "GET",
    endpoint: endpoint,
  });
};

export const getUserById = async (userId) => {
  return await apiRequest({
    method: "GET",
    endpoint: `/user/${userId}`,
  });
};

export const addUser = async (userData) => {
  return await apiRequest({
    method: "POST",
    endpoint: "/user",
    body: userData,
  });
};

export const updateUser = async (userId, updatedData) => {
  return await apiRequest({
    method: "PUT",
    endpoint: `/user/${userId}`,
    body: updatedData,
  });
};

export const deleteUser = async (userId) => {
  return await apiRequest({
    method: "DELETE",
    endpoint: `/user/${userId}`,
  });
};

export const resetPasswordUser = async (userId) => {
  return await apiRequest({
    method: "PATCH",
    endpoint: `/user/reset-password/${userId}`,
  });
};

// ==================================================================================================== //
// PROJECT MANAGEMENT (CRUD)
export const getAllProject = async (endpoint) => {
  return await apiRequest({
    method: "GET",
    endpoint: endpoint,
  });
};

export const getProjectById = async (projectId) => {
  return await apiRequest({
    method: "GET",
    endpoint: `/project/${projectId}`,
  });
};

export const addProject = async (projectData) => {
  return await apiRequest({
    method: "POST",
    endpoint: "/project",
    body: projectData,
  });
};

export const updateProject = async (projectId, updatedData) => {
  return await apiRequest({
    method: "PUT",
    endpoint: `/project/${projectId}`,
    body: updatedData,
  });
};

export const deleteProject = async (projectId) => {
  return await apiRequest({
    method: "DELETE",
    endpoint: `/project/${projectId}`,
  });
};

// ==================================================================================================== //
// DIVISION MANAGEMENT (CRUD)
export const getAllDivision = async (endpoint) => {
  return await apiRequest({
    method: "GET",
    endpoint: endpoint,
  });
};

export const getDivisionById = async (divisiId) => {
  return await apiRequest({
    method: "GET",
    endpoint: `/divisi/${divisiId}`,
  });
};

export const addDivision = async (divisiData) => {
  return await apiRequest({
    method: "POST",
    endpoint: "/divisi",
    body: divisiData,
  });
};

export const updateDivision = async (divisiId, updatedData) => {
  return await apiRequest({
    method: "PUT",
    endpoint: `/divisi/${divisiId}`,
    body: updatedData,
  });
};

export const deleteDivision = async (divisiId) => {
  return await apiRequest({
    method: "DELETE",
    endpoint: `/divisi/${divisiId}`,
  });
};

// ==================================================================================================== //
// ROLE MANAGEMENT
export const getAllRole = async (endpoint) => {
  return await apiRequest({
    method: "GET",
    endpoint: endpoint,
  });
};

// ==================================================================================================== //
// CRM
export const getAllCountAccess = async () => {
  return await apiRequest({
    method: "GET",
    endpoint: "/crm/access/count",
  });
};

export const getAllCalculateTask = async () => {
  return await apiRequest({
    method: "GET",
    endpoint: "/crm/calculate_task",
  });
};

export const getAllContactAndAffiliate = async (endpoint) => {
  return await apiRequest({
    method: "GET",
    endpoint: endpoint,
  });
};