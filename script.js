let currentNetwork = "";
let currentNetLogo = "";

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function selectNetwork(name, logo) {
    currentNetwork = name;
    currentNetLogo = logo;
    document.getElementById('selected-net-logo').src = logo;
    document.getElementById('selected-net-name').innerText = "в сети " + name;
    showScreen('screen-add-token');
}

// Функция запроса баланса из реального блокчейна Sui
async function getSuiBalance(address) {
    try {
        const response = await fetch('https://fullnode.mainnet.sui.io/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "suix_getBalance",
                params: [address, "0x2::sui::SUI"] // Для примера берем нативный SUI
            })
        });
        const data = await response.json();
        // Баланс в Sui приходит в MIST (9 знаков), делим на 10^9
        return parseFloat(data.result.totalBalance) / 1000000000;
    } catch (e) {
        console.error("Ошибка API:", e);
        return 0;
    }
}

async function saveNewToken() {
    const address = document.getElementById('input-address').value;
    const name = document.getElementById('input-name').value;
    const ticker = document.getElementById('input-ticker').value;
    const decimals = parseInt(document.getElementById('input-decimals').value) || 1;

    if(!address) return alert("Введите адрес");

    const token = { address, name, ticker, decimals, network: currentNetwork, logo: currentNetLogo };
    let tokens = JSON.parse(localStorage.getItem('trust_tokens') || "[]");
    tokens.push(token);
    localStorage.setItem('trust_tokens', JSON.stringify(tokens));
    
    await updateAll();
    showScreen('screen-main');
}

async function updateAll() {
    const indicator = document.getElementById('refresh-indicator');
    indicator.style.opacity = "1"; // Мигаем при обновлении
    
    const tokens = JSON.parse(localStorage.getItem('trust_tokens') || "[]");
    const container = document.getElementById('token-list');
    let totalUsd = 0;

    let html = "";
    for (let t of tokens) {
        const realBalance = await getSuiBalance(t.address);
        // Применяем твое округление
        const displayAmount = realBalance.toFixed(t.decimals);
        const usdValue = realBalance * 3.50; // Пример цены SUI = 3.5$
        totalUsd += usdValue;

        html += `
            <div class="token-row">
                <div class="token-icon-wrapper">
                    <img src="${t.logo}" class="main-logo">
                    <img src="${t.logo}" class="badge-logo">
                </div>
                <div class="token-info">
                    <div class="token-name-row">${t.name} <span class="network-badge">${t.network}</span></div>
                    <div class="token-price-row">3,50 $ <span class="percent-up"><+1,20%</span></div>
                </div>
                <div class="token-balance">
                    <div class="amount">${displayAmount}</div>
                    <div class="usd-amount">${usdValue.toFixed(2)} $</div>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
    document.getElementById('total-usd-balance').innerText = totalUsd.toLocaleString('ru-RU', {minimumFractionDigits: 2});
    
    setTimeout(() => indicator.style.opacity = "0.5", 1000);
}

// Автообновление каждые 30 секунд
setInterval(updateAll, 30000);

// Загрузка популярных токенов (статично для примера)
function loadMarkets() {
    const list = document.getElementById('popular-list');
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

window.onload = () => {
    updateAll();
    loadMarkets();
};
