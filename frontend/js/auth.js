document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("token", data.token);
            window.location.href = "profile.html";
        } else {
            alert("เข้าสู่ระบบไม่สำเร็จ!");
        }
    })
    .catch(error => console.error("Login error:", error));
});

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem("token", data.token);
                    window.location.href = "profile.html";
                } else {
                    alert("เข้าสู่ระบบล้มเหลว!");
                }
            });
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("สมัครสมาชิกสำเร็จ! โปรดเข้าสู่ระบบ");
                    window.location.href = "login.html";
                } else {
                    alert("สมัครสมาชิกไม่สำเร็จ!");
                }
            });
        });
    }
});
