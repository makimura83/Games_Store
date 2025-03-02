async function loadTranslations(lang) {
    try {
        const response = await fetch(`../languages/${lang}.json`);
        if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
        return await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        return {}; // คืนค่า Object ว่างถ้าโหลดไม่สำเร็จ
    }
}

let currentTranslations = {};

async function changeLanguage(lang) {
    console.log('Changing language to:', lang);
    if (!['en', 'th', 'jp'].includes(lang)) {
        console.error('Invalid language:', lang);
        lang = 'en'; // ใช้ภาษาอังกฤษเป็นค่าเริ่มต้น
    }
    localStorage.setItem('language', lang);
    currentTranslations = await loadTranslations(lang);
    try {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            console.log('Translating key:', key, 'to:', currentTranslations[key]);
            if (currentTranslations[key]) {
                element.textContent = currentTranslations[key];
            } else {
                console.warn(`Translation missing for key: ${key} in language: ${lang}`);
                element.textContent = key; // ใช้ key เป็นค่าเริ่มต้น
            }
        });
    } catch (error) {
        console.error('Error changing language:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing language...');
    const savedLang = localStorage.getItem('language') || 'en';
    console.log('Saved language:', savedLang);
    document.getElementById('language-switcher').value = savedLang;
    await changeLanguage(savedLang);
});