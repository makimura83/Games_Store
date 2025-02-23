document.addEventListener("DOMContentLoaded", function () {
    const gamesList = document.getElementById("games-list");

    fetch("http://localhost:5000/api/games") // API ดึงข้อมูลเกม
        .then(response => response.json())
        .then(games => {
            games.forEach(game => {
                let gameItem = document.createElement("div");
                gameItem.classList.add("game-card");
                gameItem.innerHTML = `
                    <img src="${game.image}" alt="${game.title}">
                    <h3>${game.title}</h3>
                    <p>${game.description}</p>
                    <p>ราคา: ${game.price} บาท</p>
                    <a href="game_detail.html?id=${game.id}">ดูรายละเอียด</a>
                `;
                gamesList.appendChild(gameItem);
            });
        })
        .catch(error => console.error("Error loading games:", error));
});

function loadGameDetail() {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get("id");

    fetch(`http://localhost:5000/api/games/${gameId}`)
        .then(response => response.json())
        .then(game => {
            document.getElementById("game-detail").innerHTML = `
                <img src="${game.image}" alt="${game.title}">
                <h2>${game.title}</h2>
                <p>${game.description}</p>
                <p>ราคา: ${game.price} บาท</p>
                <button onclick="addToCart(${game.id})">เพิ่มลงตะกร้า</button>
            `;
        })
        .catch(error => console.error("Error loading game details:", error));
}

if (window.location.pathname.includes("game_detail.html")) {
    loadGameDetail();
}
