function showFilePicker(inputId) {
    document.getElementById(inputId).click();
    anime({
        targets: `#${inputId}`,
        scale: [1, 1.1, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
}

async function fetchProfile() {
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    try {
        const response = await fetch('http://localhost:5000/api/users/me', {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept-Language': lang
            }
        });
        const user = await response.json();
        
        document.getElementById('username').textContent = user.username;
        document.getElementById('wallet-balance').textContent = user.wallet.toFixed(2);
        document.getElementById('avatar').src = user.avatar || 'https://via.placeholder.com/120';
        document.getElementById('joined-date').textContent = new Date(user.created_at).toLocaleDateString();
        document.getElementById('purchased-games').textContent = await getPurchasedGamesCount(user.id);

        // ตรวจสอบ Role และแสดงปุ่มสำหรับ Developer
        if (user.role === 'developer') {
            document.getElementById('developer-actions').style.display = 'block';
        }

        // อนิเมชันโหลดหน้า Profile
        anime({
            targets: '.profile-card',
            opacity: [0, 1],
            scale: [0.9, 1],
            duration: 1000,
            easing: 'easeOutQuad'
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        showErrorAnimation('Failed to load profile');
    }
}

async function getPurchasedGamesCount(userId) {
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    try {
        const response = await fetch(`http://localhost:5000/api/purchases/user/${userId}`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept-Language': lang
            }
        });
        const purchases = await response.json();
        return purchases.length;
    } catch (error) {
        console.error('Error fetching purchased games:', error);
        return 0;
    }
}

async function fetchGames(userId) {
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    try {
        const response = await fetch(`http://localhost:5000/api/purchases/user/${userId}`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept-Language': lang
            }
        });
        const purchases = await response.json();
        const gameGrid = document.getElementById('my-games');
        gameGrid.innerHTML = '';

        purchases.forEach(async (p, index) => {
            const versions = await fetchGameVersions(p.game.id);
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            gameCard.innerHTML = `
                <img src="${p.game.image || 'https://via.placeholder.com/250x200'}" alt="${p.game.title}">
                <div class="game-info">
                    <h3>${p.game.title}</h3>
                    <select id="version-${p.game.id}" onchange="updateDownloadButton(${p.game.id})" class="input-field">
                        ${versions.map(v => `<option value="${v.id}">${v.version}</option>`).join('')}
                    </select>
                    <button onclick="downloadGame(${p.game.id}, document.getElementById('version-${p.game.id}').value)" data-lang="download" class="btn-primary">Download</button>
                </div>
            `;
            gameGrid.appendChild(gameCard);
            anime({
                targets: gameCard,
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

async function topUp() {
    const amount = parseFloat(document.getElementById('topup-amount').value);
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    try {
        const response = await fetch('http://localhost:5000/api/wallet/topup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept-Language': lang
            },
            body: JSON.stringify({ userId: 1, amount })
        });
        const result = await response.json();
        if (response.ok) {
            showSuccessAnimation(result.message || 'Top-up successful!');
            fetchProfile();
            anime({
                targets: '#wallet-balance',
                scale: [1, 1.2, 1],
                duration: 500,
                easing: 'easeOutQuad'
            });
        } else {
            showErrorAnimation(result.error);
        }
    } catch (error) {
        console.error('Top-up error:', error);
        showErrorAnimation('Top-up failed');
    }
}

async function changeAvatar(input) {
    const file = input.files[0];
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('avatar').src = reader.result;
            uploadFile(file, 'avatar', token, lang);
            anime({
                targets: '.avatar',
                scale: [1, 1.1, 1],
                rotate: [0, 360],
                duration: 800,
                easing: 'easeOutElastic'
            });
        };
        reader.readAsDataURL(file);
    }
}

async function changeCover(input) {
    const file = input.files[0];
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('cover-image').style.backgroundImage = `url(${reader.result})`;
            uploadFile(file, 'cover', token, lang);
            anime({
                targets: '.cover-image',
                scale: [1, 1.1, 1],
                duration: 800,
                easing: 'easeOutElastic'
            });
        };
        reader.readAsDataURL(file);
    }
}

async function changeBackground(input) {
    const file = input.files[0];
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('profile-bg').style.backgroundImage = `url(${reader.result})`;
            uploadFile(file, 'background', token, lang);
            anime({
                targets: '.profile-container',
                scale: [1, 1.05, 1],
                duration: 800,
                easing: 'easeOutElastic'
            });
        };
        reader.readAsDataURL(file);
    }
}

async function uploadFile(file, type, token, lang) {
    const formData = new FormData();
    formData.append(type, file);

    try {
        const response = await fetch(`http://localhost:5000/api/users/${type}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const result = await response.json();
        if (response.ok) {
            showSuccessAnimation(result.message || `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
        } else {
            showErrorAnimation(result.error);
        }
    } catch (error) {
        console.error(`Upload ${type} error:`, error);
        showErrorAnimation(`Failed to update ${type}`);
    }
}

async function downloadGame(gameId, versionId) {
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    try {
        const response = await fetch(`http://localhost:5000/api/games/download/${gameId}/${versionId}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept-Language': lang }
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

function editProfile() {
    const username = prompt('Enter new username:', document.getElementById('username').textContent);
    if (username) {
        updateProfile(username);
        anime({
            targets: '#username',
            scale: [1, 1.1, 1],
            duration: 500,
            easing: 'easeOutQuad'
        });
    }
}

async function updateProfile(username) {
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('language') || 'en';
    try {
        const response = await fetch('http://localhost:5000/api/users/me', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept-Language': lang
            },
            body: JSON.stringify({ username })
        });
        const result = await response.json();
        if (response.ok) {
            document.getElementById('username').textContent = username;
            showSuccessAnimation('Profile updated successfully!');
        } else {
            showErrorAnimation(result.error);
        }
    } catch (error) {
        console.error('Update profile error:', error);
        showErrorAnimation('Failed to update profile');
    }
}

function navigateTo(page) {
    anime({
        targets: 'body',
        opacity: [1, 0],
        duration: 500,
        easing: 'easeInQuad',
        complete: () => {
            window.location.href = `pages/${page}`;
        }
    });
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

// ฟังก์ชัน Animation
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
document.addEventListener('DOMContentLoaded', () => {
    fetchProfile();
    // อนิเมชันสำหรับ Language Switcher
    anime({
        targets: '.language-switcher',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutQuad'
    });
});