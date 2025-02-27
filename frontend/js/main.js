document.addEventListener('DOMContentLoaded', () => {
    fetchGames(); // ดึงข้อมูลเกมจาก API
    checkAuthStatus(); // ตรวจสอบสถานะล็อกอิน
});

// ดึงข้อมูลเกมจาก API (เรียกจาก game.js)
async function fetchGames() {
    try {
        const response = await fetch('http://localhost:5000/api/games');
        const games = await response.json();
        const gameList = document.getElementById('game-list');
        gameList.innerHTML = '';

        games.forEach((game, index) => {
            const card = document.createElement('div');
            card.classList.add('game-card');
            card.innerHTML = `
                <img src="${game.image || 'https://via.placeholder.com/300x200'}" alt="${game.title}">
                <div class="game-info">
                    <h3>${game.title}</h3>
                    <p>${game.description || 'No description'}</p>
                    <p class="price">$${game.price}</p>
                    <button onclick="addToCart(${game.id})">Add to Cart</button>
                    <button onclick="navigateTo('game_detail.html?id=${game.id}')">View Details</button>
                </div>
            `;
            gameList.appendChild(card);

            anime({
                targets: card,
                translateY: [50, 0],
                opacity: [0, 1],
                delay: index * 100,
                duration: 800,
                easing: 'easeOutExpo'
            });
        });
    } catch (error) {
        console.error('Error fetching games:', error);
    }
}

// นำทางไปยังหน้าย่อย
function navigateTo(page) {
    window.location.href = `pages/${page}`;
}

// ตรวจสอบสถานะล็อกอิน
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const loginLink = document.querySelector('nav a[href="login.html"]');
    const profileLink = document.querySelector('nav a[href="profile.html"]');
    const logoutLink = document.createElement('a');

    if (token) {
        if (loginLink) loginLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'inline';
        logoutLink.href = '#';
        logoutLink.textContent = 'Logout';
        logoutLink.onclick = () => {
            localStorage.removeItem('token');
            window.location.reload();
        };
        profileLink.parentNode.appendChild(logoutLink);
    } else {
        if (loginLink) loginLink.style.display = 'inline';
        if (profileLink) profileLink.style.display = 'none';
        if (logoutLink) logoutLink.remove();
    }
}