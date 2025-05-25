import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { removeAllCookies } from "../utils/general";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

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
    token = Cookies.get("token");
  }

  if (token != null) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const id = Cookies.get('id');
  if (token != null && (id === undefined || id === null)){
    try {
      const response = await authLogout();
      if (response.success) {
        Swal.fire({
          title: "Logout",
          text: "Sesi Anda Telah Berakhir, Silahkan Login Ulang",
          icon: "warning",	
          iconColor: "#dc3545",
          timer: 2500,
          showConfirmButton: false,
        }).then(() => {
          removeAllCookies();
          window.location.replace('/');
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Gagal Logout, hubungi admin anda",
        text: error,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  if (contentType === "multipart/form-data" && (method.toUpperCase() === "POST" || method.toUpperCase() === "PUT" )) {
    const formData = new FormData();
    Object.keys(body).forEach((key) => formData.append(key, body[key]));
    body = formData
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
    if (error.status === 401 && (endpoint !== "/auth/login" && endpoint !== "/auth/send-email/forgot-password" && endpoint !== "/auth/logout" && endpoint !== "/auth/refresh-token")) {
      const newToken = await refreshToken();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        let response = await hitAPI();
        return response.data
      } else {
        throw new Error("Gagal memperbarui token");
      }
    }else if(error.status === 422 && (endpoint !== "/auth/login" && endpoint !== "/auth/send-email/forgot-password" && endpoint !== "/auth/logout" && endpoint !== "/auth/refresh-token")){
        try {
          const response = await authLogout();
          if (response.success) {
            Swal.fire({
              title: "Logout",
              text: "Akun Dikunci atau password telah berubah",
              icon: "success",
              timer: 2500,
              showConfirmButton: false,
            }).then(() => {
              removeAllCookies();
              window.location.replace('/');
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Gagal Logout, hubungi admin anda",
            text: error,
            icon: "error",
            confirmButtonText: "OK",
          });
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
  Cookies.set("token", response.data.token, { expires: 36500, secure: true, sameSite: "Strict" });
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
    body: { logout_from: "web"},
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
  const id = Cookies.get("id");
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
    contentType: "multipart/form-data",
  });
};

export const updateProject = async (projectId, updatedData) => {
  return await apiRequest({
    method: "PUT",
    endpoint: `/project/${projectId}`,
    body: updatedData,
    contentType: "multipart/form-data",
  });
};

export const deleteProject = async (projectId) => {
  return await apiRequest({
    method: "DELETE",
    endpoint: `/project/${projectId}`,
  });
};

export const deleteProjectCover = async (projectId) => {
  return await apiRequest({
    method: "DELETE",
    endpoint: `/project/${projectId}/cover`,
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


// ==================================================================================================== //
// BOARD
export const getAllBoardByWorkspaceId = async (workspaceId) => {
  const response = await apiRequest({
    method: "GET",
    endpoint: `/board/${workspaceId}?order=sort_number&order_by=asc`,
  });

  return response.data.data
}

export const updateBoard = async (boardId, updatedData) => {
  return await apiRequest({
    method: "PUT",
    endpoint: `/board/${boardId}`,
    body: updatedData,
  });
};

export const deleteBoard = async (boardId) => {
  return await apiRequest({
    method: "DELETE",
    endpoint: `/board/${boardId}`,
  });
};

export const createBoard = async (boardData) => {
  return await apiRequest({
    method: "POST",
    endpoint: "/board",
    body: boardData,
  });
};

// ==================================================================================================== //
// TASK
export const getAllTaskByBoardId = async (boardId) => {
  const response = await apiRequest({
    method: "GET",
    endpoint: `/task/${boardId}?order=sort_number&order_by=asc`,
  });

  return response.data.data
}

export const createTask = async (taskData) => {
  return await apiRequest({
    method: "POST",
    endpoint: "/task",
    body: taskData,
  });
};

export const getTaskById = async (taskId) => {
  return await apiRequest({
    method: "GET",
    endpoint: `/task/detail/${taskId}`,
  });
};

export const updateTask = async (taskId, updatedData, contentType) => {
  return await apiRequest({
    method: "PUT",
    endpoint: `/task/${taskId}`,
    body: updatedData,
    contentType: contentType ?? "multipart/form-data"
  });
};

export const searchTask = async (search) => {
  const response = await apiRequest({
    method: "GET",
    endpoint: `/task?search=${search}`,
  });

  return response.data.data
}
export const getLabel = async () => {
  const response = await apiRequest({
    method: "GET",
    endpoint: `/task/label`,
  });

  return response.data.data
}