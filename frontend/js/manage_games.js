document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'pages/login.html';
        return;
    }

    // ตรวจสอบ Role (Developer)
    checkDeveloperRole(token);
    fetchGames();
    document.getElementById('create-game-form').addEventListener('submit', createGame);
    document.getElementById('upload-version-form').addEventListener('submit', uploadVersion);

    // อนิเมชันโหลดหน้า
    anime({
        targets: '.manage-games-container',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutQuad'
    });
});

async function checkDeveloperRole(token) {
    try {
        const response = await fetch('http://localhost:5000/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const user = await response.json();
        if (!user || user.role !== 'developer') {
            showErrorAnimation('Developer access required!');
            setTimeout(() => window.location.href = 'profile.html', 2000);
        }
    } catch (error) {
        console.error('Error checking role:', error);
        showErrorAnimation('Failed to check role');
    }
}

async function fetchGames() {
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en'; // ดึงภาษาจาก localStorage
    try {
        const response = await fetch('http://localhost:5000/api/games', {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept-Language': lang // ส่งภาษาไปยัง Backend
            }
        });
        const games = await response.json();
        const gameList = document.getElementById('game-list');
        gameList.innerHTML = '';

        games.forEach((game, index) => {
            const card = document.createElement('div');
            card.classList.add('game-card');
            card.innerHTML = `
                <img src="${game.image || 'https://via.placeholder.com/250x200'}" alt="${game.title}">
                <div class="game-info">
                    <h3>${game.title}</h3>
                    <p>$${game.price}</p>
                    <button onclick="deleteGame(${game.id})" data-lang="delete-game" class="btn-primary">Delete Game</button>
                </div>
            `;
            gameList.appendChild(card);

            anime({
                targets: card,
                translateY: [50, 0],
                opacity: [0, 1],
                delay: index * 200,
                duration: 800,
                easing: 'easeOutExpo'
            });
        });
    } catch (error) {
        console.error('Error fetching games:', error);
        showErrorAnimation('Failed to load games');
    }
}

async function createGame(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    const title = document.getElementById('game-title').value;
    const description = document.getElementById('game-description').value;
    const price = parseFloat(document.getElementById('game-price').value);

    try {
        const response = await fetch('http://localhost:5000/api/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept-Language': lang // ส่งภาษาไปยัง Backend
            },
            body: JSON.stringify({ title, description, price, ownerId: 1 }) // สมมติ ownerId เป็น 1
        });
        const result = await response.json();

        if (response.ok) {
            showSuccessAnimation(result.message || 'Game created successfully!');
            document.getElementById('create-game-form').reset();
            fetchGames();
        } else {
            showErrorAnimation(result.error);
        }
    } catch (error) {
        console.error('Create game error:', error);
        showErrorAnimation('Failed to create game');
    }
}

async function uploadVersion(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    const gameId = document.getElementById('version-game-id').value;
    const version = document.getElementById('version-number').value;
    const file = document.getElementById('version-file').files[0];

    const formData = new FormData();
    formData.append('gameId', gameId);
    formData.append('version', version);
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:5000/api/games/versions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }, // ไม่ต้องใส่ Content-Type เมื่อใช้ FormData
            body: formData
        });
        const result = await response.json();

        if (response.ok) {
            showSuccessAnimation(result.message || 'Game version uploaded successfully!');
            document.getElementById('upload-version-form').reset();
            fetchGames();
        } else {
            showErrorAnimation(result.error);
        }
    } catch (error) {
        console.error('Upload version error:', error);
        showErrorAnimation('Failed to upload version');
    }
}

async function deleteGame(gameId) {
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    try {
        const response = await fetch(`http://localhost:5000/api/games/${gameId}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept-Language': lang // ส่งภาษาไปยัง Backend
            }
        });
        const result = await response.json();

        if (response.ok) {
            showSuccessAnimation(result.message || 'Game deleted successfully!');
            fetchGames();
        } else {
            showErrorAnimation(result.error);
        }
    } catch (error) {
        console.error('Delete game error:', error);
        showErrorAnimation('Failed to delete game');
    }
}

function logout() {
    anime({
        targets: 'body',
        opacity: [1, 0],
        duration: 500,
        easing: 'easeInQuad',
        complete: () => {
            localStorage.removeItem('token');
            window.location.href = 'pages/login.html';
        }
    });
}

// ฟังก์ชัน Animation (นำมาจาก profile.js หรือทั่วไป)
function showSuccessAnimation(message) {
    const alert = document.createElement('div');
    alert.className = 'alert success-animation';
    alert.textContent = message;
    document.body.appendChild(alert);
    anime({
        targets: alert,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutElastic',
        complete: () => setTimeout(() => {
            anime({
                targets: alert,
                opacity: [1, 0],
                duration: 500,
                easing: 'easeInQuad',
                complete: () => alert.remove()
            });
        }, 2000)
    });
}

function showErrorAnimation(message) {
    const alert = document.createElement('div');
    alert.className = 'alert error-animation';
    alert.textContent = message;
    document.body.appendChild(alert);
    anime({
        targets: alert,
        translateX: [-10, 10, 0],
        opacity: [0, 1, 0],
        duration: 1000,
        easing: 'easeInOutQuad',
        complete: () => setTimeout(() => alert.remove(), 2000)
    });
}