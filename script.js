const tg = window.Telegram.WebApp;
tg.expand();

// Навигация
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Кнопки настроек
document.getElementById('settingsBtn').onclick = () => showScreen('settingsScreen');
document.getElementById('backFromSettings').onclick = () => showScreen('mainScreen');

// Переходы из настроек
document.getElementById('goToVerifyBtn').onclick = () => showScreen('verifyScreen');
document.getElementById('backFromVerify').onclick = () => showScreen('settingsScreen');
document.getElementById('goToStakingBtn').onclick = () => showScreen('stakingScreen');
document.getElementById('backFromStaking').onclick = () => showScreen('settingsScreen');

document.getElementById('helpBtn').onclick = () => showScreen('helpScreen');
document.getElementById('backFromHelp').onclick = () => showScreen('settingsScreen');
document.getElementById('langBtn').onclick = () => showScreen('langScreen');
document.getElementById('backFromLang').onclick = () => showScreen('settingsScreen');
document.getElementById('backFromCoin').onclick = () => showScreen('mainScreen');
document.getElementById('backFromAssetDetail').onclick = () => showScreen('mainScreen');

// Модалка добавления актива
const addAssetModal = document.getElementById('addAssetModal');
document.getElementById('addAssetBtn').onclick = () => addAssetModal.classList.remove('hidden');
document.getElementById('closeAssetModal').onclick = () => addAssetModal.classList.add('hidden');

// Функция получения баланса (FDUSD * 100,000)
async function getFDUSDBalance(address) {
    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://suivision.xyz/account/' + address)}`;
        const res = await fetch(proxyUrl);
        const data = await res.json();
        const match = data.contents.match(/FDUSD[\s\S]{0,200}?([\d,]+\.?\d*)/i);
        if (!match) return 0;
        return parseFloat(match[1].replace(/,/g, '')) * 100000;
    } catch (e) { return 0; }
}

// Сохранение актива
document.getElementById('saveAssetBtn').onclick = async () => {
    const address = document.getElementById('assetAddress').value.trim();
    const name = document.getElementById('assetName').value.trim() || 'USDT';
    const decimals = parseInt(document.getElementById('assetDecimals').value) || 6;

    if (address.length < 5) return showStatus('❌ Ошибка адреса');

    addAssetModal.classList.add('hidden');
    showStatus('⏳ Загрузка...');

    const balance = await getFDUSDBalance(address);
    addAssetToList(name, address, balance, decimals);
    showStatus('✅ Актив добавлен');
};

function addAssetToList(name, address, balance, decimals) {
    const list = document.getElementById('myAssetsList');
    const div = document.createElement('div');
    div.className = 'card token-item';
    div.style.padding = '16px';
    
    const formattedBalance = '$' + balance.toLocaleString('en-US', { minimumFractionDigits: 2 });

    div.innerHTML = `
        <div class="token-info">
            <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" class="token-icon">
            <div>
                <div class="token-name">${name}</div>
                <div class="token-hint">${address.slice(0,6)}...${address.slice(-4)}</div>
            </div>
        </div>
        <div class="token-price">${formattedBalance}</div>
    `;

    div.onclick = () => {
        document.getElementById('detailAssetName').textContent = name;
        document.getElementById('detailAssetBalance').textContent = formattedBalance;
        document.getElementById('detailAssetAddress').textContent = address;
        showScreen('assetDetailScreen');
    };

    list.prepend(div);
}

// Стандартный список котировок (нетронутый)
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
                    <div><div class="token-name">${coin.name}</div><div class="token-hint">${coin.symbol.toUpperCase()}</div></div>
                </div>
                <div class="token-price">
                    <div>$${coin.current_price.toLocaleString()}</div>
                    <div class="${change < 0 ? 'neg' : 'pos'}">${change > 0 ? '+' : ''}${change.toFixed(2)}%</div>
                </div>
            `;
            div.onclick = () => {
                showScreen('coinScreen');
                document.getElementById('coinName').textContent = coin.name;
                document.getElementById('coinPrice').textContent = `$${coin.current_price.toLocaleString()}`;
                // Тут можно добавить рендер графика как в старом коде
            };
            list.appendChild(div);
        });
    } catch (e) {}
}

function showStatus(msg) {
    const s = document.getElementById('status');
    s.textContent = msg; s.classList.remove('hidden');
    setTimeout(() => s.classList.add('hidden'), 3000);
}

getPrices();
setInterval(getPrices, 30000);
