const translations = {
    en: {
        login: "Login",
        login-btn: "Login",
        register: "Register",
        register-btn: "Register",
        login-link: "Already have an account? Login",
        register-link: "Don't have an account? Register",
        enter-otp: "Enter OTP",
        verify-btn: "Verify",
        welcome: "Welcome",
        wallet: "Wallet",
        topup-btn: "Top Up",
        change-bg: "Change Background",
        change-avatar: "Change Avatar",
        my-games: "My Games",
        home: "Home",
        store: "Store",
        logout: "Logout",
        cart: "Cart",
        checkout: "Checkout",
        confirm-purchase: "Confirm Purchase",
        add-to-cart: "Add to Cart",
        view-details: "View Details",
        buy-now: "Buy Now",
        download: "Download"
    },
    th: {
        login: "เข้าสู่ระบบ",
        login-btn: "เข้าสู่ระบบ",
        register: "สมัครสมาชิก",
        register-btn: "สมัครสมาชิก",
        login-link: "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ",
        register-link: "ยังไม่มีบัญชี? สมัครสมาชิก",
        enter-otp: "กรอก OTP",
        verify-btn: "ยืนยัน",
        welcome: "ยินดีต้อนรับ",
        wallet: "กระเป๋าเงิน",
        topup-btn: "เติมเงิน",
        change-bg: "เปลี่ยนพื้นหลัง",
        change-avatar: "เปลี่ยนรูปโปรไฟล์",
        my-games: "เกมของฉัน",
        home: "หน้าแรก",
        store: "ร้านค้า",
        logout: "ออกจากระบบ",
        cart: "ตะกร้า",
        checkout: "ชำระเงิน",
        confirm-purchase: "ยืนยันการซื้อ",
        add-to-cart: "เพิ่มในตะกร้า",
        view-details: "ดูรายละเอียด",
        buy-now: "ซื้อเลย",
        download: "ดาวน์โหลด"
    },
    jp: {
        login: "ログイン",
        login-btn: "ログイン",
        register: "登録",
        register-btn: "登録",
        login-link: "アカウントをお持ちですか？ログイン",
        register-link: "アカウントがない？登録",
        enter-otp: "OTPを入力",
        verify-btn: "確認",
        welcome: "ようこそ",
        wallet: "ウォレット",
        topup-btn: "チャージ",
        change-bg: "背景を変更",
        change-avatar: "アバターを変更",
        my-games: "私のゲーム",
        home: "ホーム",
        store: "ストア",
        logout: "ログアウト",
        cart: "カート",
        checkout: "チェックアウト",
        confirm-purchase: "購入を確定",
        add-to-cart: "カートに追加",
        view-details: "詳細を見る",
        buy-now: "今すぐ購入",
        download: "ダウンロード"
    }
};

function changeLanguage(lang) {
    console.log('Changing language to:', lang);
    if (!['en', 'th', 'jp'].includes(lang)) {
        console.error('Invalid language:', lang);
        lang = 'en'; // ใช้ภาษาอังกฤษเป็นค่าเริ่มต้น
    }
    localStorage.setItem('language', lang);
    try {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            console.log('Translating key:', key, 'to:', translations[lang][key]);
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            } else {
                console.warn(`Translation missing for key: ${key} in language: ${lang}`);
                element.textContent = key; // ใช้ key เป็นค่าเริ่มต้น
            }
        });
    } catch (error) {
        console.error('Error changing language:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing language...');
    const savedLang = localStorage.getItem('language') || 'en';
    console.log('Saved language:', savedLang);
    document.getElementById('language-switcher').value = savedLang;
    changeLanguage(savedLang);
});