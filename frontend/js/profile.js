async function fetchProfile() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:5000/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const user = await response.json();
        
        document.getElementById('username').textContent = user.username;
        document.getElementById('wallet-balance').textContent = user.wallet.toFixed(2);
        document.getElementById('avatar').src = user.avatar || 'https://via.placeholder.com/100'; // สมมติว่ามีฟิลด์ avatar
        fetchGames(user.id);
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

async function fetchGames(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/purchases/user/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const purchases = await response.json();
        const gameGrid = document.getElementById('my-games');
        gameGrid.innerHTML = '';

        for (const p of purchases) {
            const versions = await fetchGameVersions(p.game.id);
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            gameCard.innerHTML = `
                <img src="${p.game.image || 'https://via.placeholder.com/200'}" alt="${p.game.title}">
                <div class="game-info">
                    <h3>${p.game.title}</h3>
                    <select id="version-${p.game.id}" onchange="updateDownloadButton(${p.game.id})">
                        ${versions.map(v => `<option value="${v.id}">${v.version}</option>`).join('')}
                    </select>
                    <button onclick="downloadGame(${p.game.id}, document.getElementById('version-${p.game.id}').value)">Download</button>
                </div>
            `;
            gameGrid.appendChild(gameCard);
        }
    } catch (error) {
        console.error('Error fetching games:', error);
    }
}

async function fetchGameVersions(gameId) {
    try {
        const response = await fetch(`http://localhost:5000/api/games/versions/${gameId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching versions:', error);
        return [];
    }
}

async function topUp() {
    const amount = parseFloat(document.getElementById('topup-amount').value);
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:5000/api/wallet/topup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId: 1, amount })
        });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            fetchProfile();
            anime({ targets: '#wallet-balance', scale: [1, 1.2, 1], duration: 500 });
        }
    } catch (error) {
        console.error('Top-up error:', error);
    }
}

function changeCover() {
    const file = document.getElementById('cover-upload').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('cover-image').style.backgroundImage = `url(${reader.result})`;
        };
        reader.readAsDataURL(file);
    }
}

function changeBackground() {
    const file = document.getElementById('bg-upload').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('profile-bg').style.backgroundImage = `url(${reader.result})`;
        };
        reader.readAsDataURL(file);
    }
}

function changeAvatar() {
    const file = document.getElementById('avatar-upload').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('avatar').src = reader.result;
            // สมมติส่งไฟล์ไป Backend เพื่อบันทึก (ยังไม่ทำงานจริงในตัวอย่างนี้)
            uploadAvatar(file);
        };
        reader.readAsDataURL(file);
    }
}

async function uploadAvatar(file) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const response = await fetch('http://localhost:5000/api/users/avatar', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Avatar upload error:', error);
    }
}

async function downloadGame(gameId, versionId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:5000/api/games/download/${gameId}/${versionId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `game_${gameId}_v${versionId}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            anime({ targets: '.game-card button', scale: [1, 1.1, 1], duration: 300 });
        } else {
            alert('Download failed');
        }
    } catch (error) {
        console.error('Download error:', error);
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'pages/login.html';
}

document.addEventListener('DOMContentLoaded', fetchProfile);
async function fetchProfile() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:5000/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const user = await response.json();
        
        document.getElementById('username').textContent = user.username;
        document.getElementById('wallet-balance').textContent = user.wallet.toFixed(2);
        document.getElementById('avatar').src = user.avatar || 'https://via.placeholder.com/120';
        fetchGames(user.id);

        // อนิเมชันโหลดหน้า Profile
        anime({
            targets: '.profile-header',
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 800,
            easing: 'easeOutQuad'
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

async function topUp() {
    const amount = parseFloat(document.getElementById('topup-amount').value);
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:5000/api/wallet/topup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId: 1, amount })
        });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            fetchProfile();
            anime({
                targets: '#wallet-balance',
                scale: [1, 1.2, 1],
                duration: 500,
                easing: 'easeOutQuad',
                complete: () => document.querySelector('#wallet-balance').classList.add('success-animation')
            });
            setTimeout(() => document.querySelector('#wallet-balance').classList.remove('success-animation'), 1000);
        } else {
            showErrorAnimation(result.error);
        }
    } catch (error) {
        console.error('Top-up error:', error);
        showErrorAnimation('Top-up failed');
    }
}

async function downloadGame(gameId, versionId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:5000/api/games/download/${gameId}/${versionId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `game_${gameId}_v${versionId}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            anime({
                targets: '.game-card button',
                scale: [1, 1.1, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
        } else {
            const result = await response.json();
            if (result.error.includes('Insufficient funds')) {
                showInsufficientFundsAnimation();
            } else {
                showErrorAnimation(result.error);
            }
        }
    } catch (error) {
        console.error('Download error:', error);
        showErrorAnimation('Download failed');
    }
}

// ฟังก์ชันใหม่สำหรับอนิเมชัน
function showPageTransition() {
    anime({
        targets: 'body',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutQuad'
    });
}

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

function showInsufficientFundsAnimation() {
    const alert = document.createElement('div');
    alert.className = 'alert insufficient-funds-animation';
    alert.textContent = "Insufficient funds! Please top up your wallet.";
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

// เรียกใช้อนิเมชันเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
    showPageTransition();
    fetchProfile();
});

// เพิ่มใน logout
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