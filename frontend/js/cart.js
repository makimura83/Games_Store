let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(gameId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add to cart');
        window.location.href = 'pages/login.html';
        return;
    }

    if (!cart.includes(gameId)) {
        cart.push(gameId);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Game ID ${gameId} added to cart!`);
        anime({ targets: 'button', scale: [1, 1.1, 1], duration: 300 });
    } else {
        alert('This game is already in your cart!');
    }
}

function viewCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach(async (gameId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/games/${gameId}`);
            const game = await response.json();
            const item = document.createElement('div');
            item.classList.add('cart-item');
            item.innerHTML = `
                <img src="${game.image || 'https://via.placeholder.com/100'}" alt="${game.title}">
                <div>
                    <h3>${game.title}</h3>
                    <p>$${game.price}</p>
                    <button onclick="removeFromCart(${gameId})">Remove</button>
                </div>
            `;
            cartItems.appendChild(item);
        } catch (error) {
            console.error('Error fetching cart item:', error);
        }
    });
}

function removeFromCart(gameId) {
    cart = cart.filter(id => id !== gameId);
    localStorage.setItem('cart', JSON.stringify(cart));
    viewCart();
    anime({ targets: '.cart-item', opacity: [1, 0], duration: 500, complete: () => viewCart() });
}

async function confirmPurchase() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to purchase');
        window.location.href = 'pages/login.html';
        return;
    }

    try {
        for (const gameId of cart) {
            const response = await fetch('http://localhost:5000/api/purchases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId: 1, gameId })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
        }
        alert('Purchase successful!');
        cart = [];
        localStorage.removeItem('cart');
        viewCart();
    } catch (error) {
        console.error('Purchase error:', error);
        alert('Purchase failed: ' + error.message);
    }
}

// โหลดตะกร้าเมื่อหน้า Checkout โหลด
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('checkout.html')) {
        viewCart();
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    fetchGameDetails(gameId);
    anime({
        targets: 'body',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutQuad'
    });
});

async function fetchGameDetails(gameId) {
    const lang = localStorage.getItem('language') || 'en';
    try {
        const response = await fetch(`http://localhost:5000/api/games/${gameId}`, {
            headers: { 'Accept-Language': lang }
        });
        const game = await response.json();
        
        document.getElementById('game-title').textContent = game.title;
        document.getElementById('game-description').textContent = game.description || 'No description';
        document.getElementById('game-price').textContent = `$${game.price}`;
        document.getElementById('game-image').src = game.image || 'https://via.placeholder.com/400x300';

        anime({
            targets: '.game-card',
            scale: [0.9, 1],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutQuad'
        });
    } catch (error) {
        console.error('Error fetching game:', error);
        showErrorAnimation('Failed to load game details');
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

async function downloadGame() {
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    if (!token) {
        showErrorAnimation('Please login to download');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    const versions = await fetch('http://localhost:5000/api/games/versions/' + gameId, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept-Language': lang
        }
    });
    const versionsData = await versions.json();

    try {
        if (versionsData.length > 0) {
            const versionId = versionsData[0].id; // ดาวน์โหลดเวอร์ชันล่าสุด
            const response = await fetch(`http://localhost:5000/api/games/download/${gameId}/${versionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `game_${gameId}.zip`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                anime({
                    targets: '#download-btn',
                    scale: [1, 1.1, 1],
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            } else {
                const result = await response.json();
                showErrorAnimation(result.error);
            }
        }
    } catch (error) {
        console.error('Download error:', error);
        showErrorAnimation('Download failed');
    }
}