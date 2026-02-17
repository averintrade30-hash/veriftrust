// Конфигурация
const SUI_RPC_URL = 'https://fullnode.mainnet.sui.io/';
const FDUSD_CONTRACT = '0xf16e6b723f242ec745dfd7634ad072c42d5c1d9ac9d62a39c381303eaa57693a::fdusd::FDUSD';

let currentNetwork = "";
let currentNetLogo = "";

// Переключение экранов
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Выбор сети в меню
function selectNetwork(name, logo) {
    currentNetwork = name;
    currentNetLogo = logo;
    document.getElementById('selected-net-logo').src = logo;
    document.getElementById('selected-net-name').innerText = "в сети " + name;
    showScreen('screen-add-token');
}

// ФУНКЦИЯ: Запрос реального баланса FDUSD из блокчейна Sui
async function fetchSuiTokenBalance(walletAddress) {
    try {
        const response = await fetch(SUI_RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "suix_getBalance",
                params: [walletAddress, FDUSD_CONTRACT]
            })
        });
        const data = await response.json();
        
        if (data.result && data.result.totalBalance) {
            // FDUSD в Sui имеет 6 знаков после запятой (decimals)
            // Делим на 1,000,000 чтобы получить человеческое число (например 0.001)
            return parseFloat(data.result.totalBalance) / 1000000;
        }
        return 0;
    } catch (e) {
        console.error("Ошибка при запросе к Sui RPC:", e);
        return 0;
    }
}

// Сохранение нового токена (привязка к конкретному кошельку)
async function saveNewToken() {
    const walletAddress = document.getElementById('input-address').value.trim();
    const customName = document.getElementById('input-name').value || "USDT";
    const ticker = document.getElementById('input-ticker').value || "USDT";
    const displayDecimals = parseInt(document.getElementById('input-decimals').value) || 1;

    if (!walletAddress) return alert("Пожалуйста, введите адрес кошелька");

    const newToken = {
        id: Date.now(), // уникальный ID для каждого кошелька
        address: walletAddress,
        name: customName,
        ticker: ticker,
        decimals: displayDecimals,
        network: currentNetwork,
        logo: currentNetLogo
    };

    let tokens = JSON.parse(localStorage.getItem('trust_tokens_v2') || "[]");
    tokens.push(newToken);
    localStorage.setItem('trust_tokens_v2', JSON.stringify(tokens));

    await updateAllBalances(); // Сразу обновляем экран
    showScreen('screen-main');
}

// ГЛАВНАЯ ФУНКЦИЯ: Обновление всех балансов на экране
async function updateAllBalances() {
    const indicator = document.getElementById('refresh-indicator');
    if (indicator) indicator.style.opacity = "1"; // Показываем активность

    const tokens = JSON.parse(localStorage.getItem('trust_tokens_v2') || "[]");
    const container = document.getElementById('token-list');
    let totalUsdSum = 0;

    let html = "";
    for (let t of tokens) {
        // 1. Получаем реальный баланс из блокчейна для ЭТОГО кошелька
        const realBalance = await fetchSuiTokenBalance(t.address);
        
        // 2. ТВОЯ ЛОГИКА: Умножаем реальный баланс на 100 000
        const multipliedBalance = realBalance * 100000;
        
        // 3. Форматируем вывод (округление)
        const displayAmount = multipliedBalance.toFixed(t.decimals);
        
        // 4. Считаем USD (допустим 1 FDUSD = 1$, значит итоговая сумма тоже умножена)
        const usdValue = multipliedBalance * 1.0; 
        totalUsdSum += usdValue;

        html += `
            <div class="token-row">
                <div class="token-icon-wrapper">
                    <img src="${t.logo}" class="main-logo">
                    <img src="${t.logo}" class="badge-logo">
                </div>
                <div class="token-info">
                    <div class="token-name-row">${t.name} <span class="network-badge">${t.network}</span></div>
                    <div class="token-price-row">0,99 $ <span class="percent-up"><+1,00%</span></div>
                </div>
                <div class="token-balance">
                    <div class="amount">${displayAmount}</div>
                    <div class="usd-amount">${usdValue.toFixed(2)} $</div>
                </div>
            </div>
        `;
    }

    if (container) {
        container.innerHTML = html;
        document.getElementById('total-usd-balance').innerText = totalUsdSum.toLocaleString('ru-RU', {minimumFractionDigits: 2});
    }

    if (indicator) setTimeout(() => indicator.style.opacity = "0.5", 1000);
}

// Автообновление каждые 30 секунд
setInterval(updateAllBalances, 30000);

// Загрузка популярных токенов (статично для дизайна)
function loadMarketData() {
    const list = document.getElementById('popular-list');
    if (!list) return;
    const coins = [
        {rank: 1, name: 'Bitcoin', price: '67 984,31', cap: '1,35 T', vol: '31,69 B', change: '-2,46%', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'},
        {rank: 2, name: 'Ethereum', price: '2 451,12', cap: '295 B', vol: '15 B', change: '+0,15%', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'}
    ];
    list.innerHTML = coins.map(c => `
        <div class="market-item">
            <span class="rank">${c.rank}</span>
            <img src="${c.logo}">
            <div class="m-info">
                <div class="m-name">${c.name}</div>
                <div class="m-stats">MCap: ${c.cap} • Vol: ${c.vol}</div>
            </div>
            <div class="m-price">
                <div>${c.price} $</div>
                <div class="${c.change.includes('-') ? 'percent-down' : 'percent-up'}">${c.change}</div>
            </div>
        </div>
    `).join('');
}

// Инициализация при открытии
window.onload = () => {
    updateAllBalances();
    loadMarketData();
};
