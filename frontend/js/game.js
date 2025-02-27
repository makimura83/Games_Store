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