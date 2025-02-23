document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    fetch("http://localhost:5000/api/user/profile", {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("profile-info").innerHTML = `
            <p>ชื่อผู้ใช้: ${data.username}</p>
            <p>อีเมล: ${data.email}</p>
        `;

        const purchasedGamesDiv = document.getElementById("purchased-games");
        data.purchasedGames.forEach(game => {
            let gameItem = document.createElement("div");
            gameItem.innerHTML = `<p>${game.title}</p>`;
            purchasedGamesDiv.appendChild(gameItem);
        });
    });

    window.logout = function () {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    };
});
