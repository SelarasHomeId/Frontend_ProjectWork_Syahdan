import axios from "axios";
import { BASE_URL } from "../utils/constant";

// ==================================================================================================== //

export const apiRequest = async ({
  method,
  endpoint,
  body = null,
  token = null,
  contentType = 'application/json'
}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': contentType };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const hitAPI = async () => {
      switch (method.toUpperCase()) {
        case 'POST':
          return contentType === 'application/json'
            ? axios.post(url, body, { headers })
            : handleMultipartRequest(method, url, headers, body);
        case 'GET':
          return axios.get(url, { headers });
        case 'PUT':
          return contentType === 'application/json'
            ? axios.put(url, body, { headers })
            : handleMultipartRequest(method, url, headers, body);
        case 'DELETE':
          return axios.delete(url, { headers });
        case 'PATCH':
          return contentType === 'application/json'
            ? axios.patch(url, body, { headers })
            : handleMultipartRequest(method, url, headers, body);
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    };

    let response = await hitAPI();

    if (response.status === 401 && endpoint !== '/auth/login') {
      const newToken = await refreshToken(token);

      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await hitAPI();
      } else {
        throw new Error('Failed to refresh token');
      }
    }

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const handleMultipartRequest = async (method, url, headers, body) => {
  const formData = new FormData();

  for (const key in body) {
    if (body.hasOwnProperty(key)) {
      formData.append(key, body[key]);
    }
  }

  switch (method.toUpperCase()) {
    case 'POST':
      return axios.post(url, formData, { headers });
    case 'PUT':
      return axios.put(url, formData, { headers });
    default:
      throw new Error('Unsupported multipart HTTP method');
  }
};

const refreshToken = async (token) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, { token });
    localStorage.setItem("token", response.data.token);
    return response.data.token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

// ==================================================================================================== //

export const authLogin = async (email, password) => {
  const response = await apiRequest({
    method: 'POST',
    endpoint: '/auth/login',
    body: {
      email: email, 
      password: password,
      login_from: 'web',
    },
    token: null,
    contentType: 'application/json',
  });

  return response;
};

export const authLogout = async () => {
  const token = localStorage.getItem('token');

  const response = await apiRequest({
    method: 'POST',
    endpoint: '/auth/logout',
    body: null,
    token: token,
    contentType: 'application/json'
  });

  return response;
};

export const workspaceFind = async () => {
  const token = localStorage.getItem('token');

  const response = await apiRequest({
    method: 'GET',
    endpoint: '/workspace',
    body: null,
    token: token,
    contentType: 'application/json'
  });

  return response.data.data;
}

// ==================================================================================================== //