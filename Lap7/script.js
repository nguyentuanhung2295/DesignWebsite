// Lấy tham chiếu đến các elements
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");

// Các elements từ HTML cũ (để tương thích)
const inputUsernameLogin = document.querySelector(".input-login-username");
const inputPasswordLogin = document.querySelector(".input-login-password");
const inputUsernameRegister = document.querySelector(".input-signup-username");
const inputPasswordRegister = document.querySelector(".input-signup-password");

// Hiển thị thông báo
function showAlert(containerId, message, type) {
  const alertContainer = document.getElementById(containerId);
  if (alertContainer) {
    alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
      alertContainer.innerHTML = "";
    }, 3000);
  } else {
    // Fallback to alert if container not found
    alert(message);
  }
}

// Lưu user vào localStorage
function saveUsers(users) {
  try {
    localStorage.setItem("users", JSON.stringify(users));
  } catch (e) {
    console.log("LocalStorage not available, using session storage");
  }
}

// Lấy users từ localStorage
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("users")) || [];
  } catch (e) {
    console.log("LocalStorage not available");
    return [];
  }
}

// Lưu user hiện tại
function saveCurrentUser(email) {
  try {
    localStorage.setItem("currentUser", email);
  } catch (e) {
    console.log("LocalStorage not available");
  }
}

// Lấy user hiện tại
function getCurrentUser() {
  try {
    return localStorage.getItem("currentUser");
  } catch (e) {
    return null;
  }
}

// SIGNUP logic - Updated version
function signup(event) {
  if (event) {
    event.preventDefault();
  }

  // Lấy giá trị từ cả phiên bản mới và cũ
  const email =
    (registerEmail && registerEmail.value) ||
    (inputUsernameRegister && inputUsernameRegister.value) ||
    "";
  const password =
    (registerPassword && registerPassword.value) ||
    (inputPasswordRegister && inputPasswordRegister.value) ||
    "";
  const confirmPass = (confirmPassword && confirmPassword.value) || password;

  // Validation
  if (!email || !password) {
    showAlert("registerAlert", "Please enter email and password!", "error");
    return;
  }

  // Kiểm tra email hợp lệ
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAlert("registerAlert", "Please enter a valid email!", "error");
    return;
  }

  // Kiểm tra độ dài mật khẩu
  if (password.length < 6) {
    showAlert(
      "registerAlert",
      "Password must be at least 6 characters!",
      "error"
    );
    return;
  }

  // Kiểm tra confirm password (nếu có)
  if (confirmPassword && password !== confirmPass) {
    showAlert("registerAlert", "Passwords do not match!", "error");
    return;
  }

  const user = {
    email: email,
    password: password,
  };

  let users = getUsers();

  // Kiểm tra user đã tồn tại
  let userExists = users.some((u) => u.email === user.email);

  if (userExists) {
    showAlert(
      "registerAlert",
      "This account already exists. Please choose another email.",
      "error"
    );
  } else {
    users.push(user);
    saveUsers(users);

    showAlert(
      "registerAlert",
      "Signup successful! Redirecting to login...",
      "success"
    );

    // Reset form
    if (document.getElementById("registerForm")) {
      document.getElementById("registerForm").reset();
    }

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  }
}

// LOGIN logic - Updated version
function login(event) {
  if (event) {
    event.preventDefault();
  }

  // Lấy giá trị từ cả phiên bản mới và cũ
  const email =
    (loginEmail && loginEmail.value) ||
    (inputUsernameLogin && inputUsernameLogin.value) ||
    "";
  const password =
    (loginPassword && loginPassword.value) ||
    (inputPasswordLogin && inputPasswordLogin.value) ||
    "";

  if (!email || !password) {
    showAlert("loginAlert", "Please enter both email and password!", "error");
    return;
  }

  let users = getUsers();

  // Tìm user
  let user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    saveCurrentUser(email);
    showAlert("loginAlert", "Login successful! Redirecting...", "success");

    // Reset form
    if (document.getElementById("loginForm")) {
      document.getElementById("loginForm").reset();
    }

    // Redirect after 1 second
    setTimeout(() => {
      window.location.href = "welcome.html";
    }, 1000);
  } else {
    showAlert(
      "loginAlert",
      "Invalid email or password. Please try again.",
      "error"
    );
  }
}

// Logout function
function logout() {
  try {
    localStorage.removeItem("currentUser");
  } catch (e) {
    console.log("LocalStorage not available");
  }
  window.location.href = "login.html";
}

// Kiểm tra và hiển thị thông tin user trên trang welcome
function checkWelcomePage() {
  const currentUser = getCurrentUser();
  const welcomeMessage = document.getElementById("welcomeMessage");

  if (welcomeMessage && currentUser) {
    welcomeMessage.textContent = `Welcome back, ${currentUser}!`;
  } else if (
    window.location.pathname.includes("welcome.html") &&
    !currentUser
  ) {
    // Nếu không có user đăng nhập mà truy cập welcome page, redirect về login
    window.location.href = "login.html";
  }
}

// Event listeners cho form mới
document.addEventListener("DOMContentLoaded", function () {
  // Login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", login);
  }

  // Register form
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", signup);
  }

  // Kiểm tra trang welcome
  checkWelcomePage();

  // Tạo một số user mẫu nếu chưa có
  const users = getUsers();
  if (users.length === 0) {
    const sampleUsers = [
      { email: "test@example.com", password: "123456" },
      { email: "admin@test.com", password: "admin123" },
    ];
    saveUsers(sampleUsers);
  }
});
