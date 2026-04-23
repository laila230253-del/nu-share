/* =========================
   DEFAULT ADMIN ACCOUNT
========================= */
(function () {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let adminExists = users.find(function (u) {
        return u.email === "admin@nu.edu.om" && u.role === "admin";
    });

    if (!adminExists) {
        users.push({
            name: "Admin",
            email: "admin@nu.edu.om",
            password: "admin123",
            role: "admin"
        });

        localStorage.setItem("users", JSON.stringify(users));
    }
})();

/* =========================
   REGISTER
========================= */
function register() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let role = document.getElementById("role").value;

    if (name === "" || email === "" || password === "") {
        alert("Please fill all fields!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let existingUser = users.find(function (u) {
        return u.email.toLowerCase() === email.toLowerCase();
    });

    if (existingUser) {
        alert("This email is already registered!");
        return;
    }

    users.push({
        name: name,
        email: email,
        password: password,
        role: role
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");
    window.location.href = "login.html";
}

/* =========================
   LOGIN
========================= */
function login() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let adminCodeInput = document.getElementById("adminCode");
    let adminCode = adminCodeInput ? adminCodeInput.value.trim() : "";

    if (email === "" || password === "") {
        alert("Please fill all fields!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let foundUser = users.find(function (u) {
        return u.email === email && u.password === password;
    });

    if (!foundUser) {
        alert("Incorrect email or password!");
        return;
    }

    /* Extra protection for admin */
    if (foundUser.role === "admin") {
        if (adminCode !== "NUADMIN2026") {
            alert("Invalid admin secret code!");
            return;
        }
    }

    localStorage.setItem("currentUser", JSON.stringify(foundUser));

    if (foundUser.role === "admin") {
        alert("Admin login successful!");
    } else {
        alert("Login successful!");
    }

    window.location.href = "index.html";
}

/* =========================
   USER HELPERS
========================= */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
}

function requireUser() {
    let user = getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return null;
    }

    return user;
}

function initUser() {
    let user = requireUser();
    if (!user) return;

    let username = document.getElementById("username");
    let role = document.getElementById("role");

    if (username) username.innerText = user.name;
    if (role) role.innerText = user.role;
}

/* =========================
   ADMIN CHECK
========================= */
function checkAdmin() {
    let user = getCurrentUser();
    let adminPanel = document.getElementById("adminPanel");

    if (user && user.role === "admin" && adminPanel) {
        adminPanel.style.display = "block";
    }
}

/* =========================
   ADMIN PAGE
========================= */
function loadAdmin() {
    let user = getCurrentUser();

    if (!user || user.role !== "admin") {
        alert("Access denied!");
        window.location.href = "login.html";
        return;
    }

    let adminName = document.getElementById("adminName");
    let username = document.getElementById("username");
    let role = document.getElementById("role");

    if (adminName) {
        adminName.innerText = "Welcome Admin: " + user.name;
    }

    if (username) username.innerText = user.name;
    if (role) role.innerText = user.role;

    displayUsers();
}

function displayUsers() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let usersList = document.getElementById("usersList");

    if (!usersList) return;

    usersList.innerHTML = "";

    users.forEach(function (u, i) {
        usersList.innerHTML += `
            <div class="card">
                👤 ${u.name}<br>
                📧 ${u.email}<br>
                🔐 ${u.role}
                ${u.role !== "admin" ? `<div class="actions"><button class="delete-btn" type="button" onclick="deleteUser(${i})">Delete</button></div>` : ""}
            </div>
        `;
    });
}

function deleteUser(i) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users[i].role === "admin") {
        alert("Cannot delete admin!");
        return;
    }

    users.splice(i, 1);
    localStorage.setItem("users", JSON.stringify(users));
    displayUsers();
}

/* =========================
   NOTIFICATIONS
========================= */
function addNotification(msg) {
    let n = JSON.parse(localStorage.getItem("notifications")) || [];
    n.unshift(msg);
    localStorage.setItem("notifications", JSON.stringify(n));
    updateNotifCount();
}

function updateNotifCount() {
    let n = JSON.parse(localStorage.getItem("notifications")) || [];
    let badge = document.getElementById("notifCount");

    if (badge) {
        badge.innerText = n.length;
    }
}

function loadNotif() {
    updateNotifCount();
}

/* =========================
   THEME
========================= */
function loadTheme() {
    let theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark");
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

/* =========================
   NAVIGATION
========================= */
function openPage(page) {
    window.location.href = page;
}

function go(page) {
    window.location.href = page;
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}