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