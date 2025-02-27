document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('email', email);
            await sendOTP(email);
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('otp-section').style.display = 'block';
            anime({ targets: '#otp-section', opacity: [0, 1], translateY: [-20, 0], duration: 500 });
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Login error:', error);
    }
});

async function sendOTP(email) {
    try {
        const response = await fetch('http://localhost:5000/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const result = await response.json();
        if (response.ok) {
            alert('OTP has been sent to your email! Check your inbox or spam folder.');
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Send OTP error:', error);
    }
}

async function verifyOTP() {
    const otp = document.getElementById('otp').value;
    const email = localStorage.getItem('email');

    try {
        const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('token', result.token);
            localStorage.removeItem('email');
            window.location.href = 'profile.html';
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Verify OTP error:', error);
    }
}
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const result = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
});