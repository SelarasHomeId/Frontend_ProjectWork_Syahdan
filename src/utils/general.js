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