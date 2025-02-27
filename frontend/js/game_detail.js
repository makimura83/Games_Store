const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('id');

async function fetchGameDetails() {
    try {
        const response = await fetch(`http://localhost:5000/api/games/${gameId}`);
        const game = await response.json();
        
        document.getElementById('game-title').textContent = game.title;
        document.getElementById('game-description').textContent = game.description || 'No description';
        document.getElementById('game-price').textContent = `$${game.price}`;
        document.getElementById('game-image').src = game.image || 'https://via.placeholder.com/400x300';
    } catch (error) {
        console.error('Error fetching game:', error);
    }
}

async function purchaseGame() {
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
            document.getElementById('download-btn').style.display = 'inline-block';
            anime({ targets: 'button', scale: [1, 1.1, 1], duration: 300 });
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Purchase error:', error);
    }
}

async function downloadGame() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to download');
        window.location.href = 'login.html';
        return;
    }

    try {
        const versions = await fetch('http://localhost:5000/api/games/versions/' + gameId, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const versionsData = await versions.json();
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
                anime({ targets: '#download-btn', scale: [1, 1.1, 1], duration: 300 });
            } else {
                alert('Download failed');
            }
        }
    } catch (error) {
        console.error('Download error:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchGameDetails);