document.addEventListener("DOMContentLoaded", function () {
    const gameList = document.getElementById("game-list");

    fetch("http://localhost:5000/api/games") // ดึงข้อมูลเกมจาก Backend
        .then(response => response.json())
        .then(games => {
            games.forEach(game => {
                let gameItem = document.createElement("div");
                gameItem.innerHTML = `
                    <h3>${game.title}</h3>
                    <p>${game.description}</p>
                    <p>ราคา: ${game.price} บาท</p>
                    <a href="game_detail.html?id=${game.id}">ดูรายละเอียด</a>
                `;
                gameList.appendChild(gameItem);
            });
        })
        .catch(error => console.error("Error loading games:", error));
});
