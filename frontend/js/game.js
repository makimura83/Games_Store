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
                    <button onclick="purchaseGame(${game.id})">Buy Now</button>
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

async function purchaseGame(gameId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to purchase');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/purchases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId: 1, gameId })
        });
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            anime({ targets: 'button', scale: [1, 1.1, 1], duration: 300 });
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Purchase error:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchGames);
document.addEventListener('DOMContentLoaded', () => {
    fetchGames();
    anime({
        targets: 'body',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutQuad'
    });
});

async function fetchGames() {
    const lang = localStorage.getItem('language') || 'en';
    try {
        const response = await fetch('http://localhost:5000/api/games', {
            headers: { 'Accept-Language': lang }
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
                    <p>${game.description || 'No description'}</p>
                    <p class="price">$${game.price}</p>
                    <button onclick="addToCart(${game.id})" data-lang="add-to-cart" class="btn-primary">Add to Cart</button>
                    <button onclick="navigateTo('game_detail.html?id=${game.id}')" data-lang="view-details" class="btn-primary">View Details</button>
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

async function purchaseGame() {
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    if (!token) {
        showErrorAnimation('Please login to purchase');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    try {
        const response = await fetch('http://localhost:5000/api/purchases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept-Language': lang
            },
            body: JSON.stringify({ userId: 1, gameId })
        });
        const result = await response.json();
        
        if (response.ok) {
            showSuccessAnimation('Game purchased successfully!');
            document.getElementById('download-btn').style.display = 'inline-block';
        } else if (result.error.includes('Insufficient funds')) {
            showInsufficientFundsAnimation();
        } else {
            showErrorAnimation(result.error);
        }
    } catch (error) {
        console.error('Purchase error:', error);
        showErrorAnimation('Purchase failed');
    }
}