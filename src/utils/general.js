import Cookies from "js-cookie";

export const validatePassword = (password) => {
  const minLength = 10;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[\W_]/; // \W = non-word character (special characters)

  if (password.length < minLength) {
    return "Password baru harus memiliki minimal 10 karakter.";
  }
  if (!uppercaseRegex.test(password)) {
    return "Password baru harus mengandung huruf besar (A-Z).";
  }
  if (!lowercaseRegex.test(password)) {
    return "Password baru harus mengandung huruf kecil (a-z).";
  }
  if (!numberRegex.test(password)) {
    return "Password baru harus mengandung angka (0-9).";
  }
  if (!specialCharRegex.test(password)) {
    return "Password baru harus mengandung karakter spesial (!@#$%^&* dll).";
  }

  return null; // Password valid
}

export const setAllCookiesUserData = (response) => {
  const email = response.data.data.email;
  const name = response.data.data.name;
  const id = response.data.data.id;
  const roleId = response.data.data.role.id;
  const divisiId = response.data.data.divisi.id;
  const roleName = response.data.data.role.name;
  const divisiName = response.data.data.divisi.name;
  Cookies.set("email", email, { expires: 1, secure: true, sameSite: "Strict" });
  Cookies.set("name", name, { expires: 1, secure: true, sameSite: "Strict" });
  Cookies.set("id", id, { expires: 1, secure: true, sameSite: "Strict" });
  Cookies.set("roleId", roleId, { expires: 1, secure: true, sameSite: "Strict" });
  Cookies.set("divisiId", divisiId, { expires: 1, secure: true, sameSite: "Strict" });
  Cookies.set("roleName", roleName, { expires: 1, secure: true, sameSite: "Strict" });
  Cookies.set("divisiName", divisiName, { expires: 1, secure: true, sameSite: "Strict" });
};

export const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export const removeAllCookies = () => {
  const allCookies = Cookies.get();
  Object.keys(allCookies).forEach((cookie) => {
    Cookies.remove(cookie);
  });
};