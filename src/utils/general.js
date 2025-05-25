import Cookies from "js-cookie";

export const validatePassword = (password) => {
  const minLength = 8;
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

export const removeAllCookies = () => {
  const allCookies = Cookies.get();
  Object.keys(allCookies).forEach((cookie) => {
    Cookies.remove(cookie);
  });
};

// ============================================START INITIAL=============
export const decimalToHexColor = (color) => {
  return `#${Number(color).toString(16).toUpperCase().padStart(8, '0').substring(2)}`;
}

export const hexColorToDecimal = (hexColor) => {
  return parseInt(hexColor.replace("#", ""), 16);
};

export const getInitials = (name) => {
  const words = name.split(" ");
  return words.length > 1
    ? words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase()
    : words[0][0].toUpperCase();
};

export const getColorFromInitial = (initial) => {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFF5", "#FF8C00", "#FFD700",
    "#ADFF2F", "#00FF7F", "#40E0D0", "#1E90FF", "#DC143C", "#FF4500", "#8A2BE2", "#4B0082",
    "#7FFF00", "#8B0000", "#00FA9A", "#FF69B4", "#4682B4", "#20B2AA", "#FF6347", "#BDB76B",
    "#F08080", "#556B2F", "#9370DB", "#DDA0DD", "#8B4513", "#2E8B57", "#A52A2A", "#708090",
    "#FFB6C1", "#6A5ACD", "#FA8072", "#778899", "#F4A460", "#008080", "#BA55D3", "#CD5C5C",
    "#00CED1", "#DA70D6", "#B22222", "#5F9EA0", "#FF00FF", "#DEB887", "#00BFFF", "#9932CC",
    "#D2691E", "#7B68EE", "#C71585", "#191970", "#DB7093", "#F5DEB3", "#6495ED", "#32CD32",
    "#8FBC8F", "#B8860B", "#2F4F4F", "#F0E68C", "#8B008B", "#E9967A", "#800000", "#FF7F50",
    "#DC143C", "#4169E1", "#DAA520", "#2E8B57", "#CD853F", "#8A2BE2", "#FF4500", "#D2691E",
    "#FFDAB9", "#ADFF2F", "#48D1CC", "#7CFC00", "#F0FFF0", "#5F9EA0", "#FFDEAD", "#9400D3",
    "#AFEEEE", "#FF1493", "#00FFFF", "#0000FF", "#008B8B", "#FF00FF", "#800080", "#008000",
    "#808000", "#800000", "#C0C0C0", "#FF6347", "#FFD700", "#6B8E23", "#4682B4", "#B0E0E6"
  ];
  let charSum = initial.length === 2 
      ? initial.charCodeAt(0) + initial.charCodeAt(1) 
      : initial.charCodeAt(0);
  const index = charSum % colors.length;
  return colors[index];
};

export const getContrastingTextColor = (bgHex) => {
  let hex = bgHex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex.split('').map(ch => ch + ch).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const toLinear = (c) => {
    const v = c / 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  const lum = 0.2126 * toLinear(r)
            + 0.7152 * toLinear(g)
            + 0.0722 * toLinear(b);

  return lum < 0.5 ? '#FFFFFF' : '#000000';
};
// ============================================END INITIAL=============

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}