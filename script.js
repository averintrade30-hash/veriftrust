const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

const docInput = document.getElementById('docInput');
const selfieInput = document.getElementById('selfieInput');
const verifyBtn = document.getElementById('verifyBtn');
const walletInput = document.getElementById('walletInput');
const stakingBtn = document.getElementById('stakingBtn');
const statusToast = document.getElementById('status');

function showToast(message) {
    statusToast.textContent = message;
    statusToast.classList.remove('hidden');
    setTimeout(() => statusToast.classList.add('hidden'), 3000);
}

// Обработка верификации
verifyBtn.addEventListener('click', () => {
    if (!docInput.files[0] || !selfieInput.files[0]) {
        showToast('Пожалуйста, загрузите оба фото');
        return;
    }

    const data = {
        action: 'verify',
        docName: docInput.files[0].name,
        selfieName: selfieInput.files[0].name
    };

    tg.sendData(JSON.stringify(data));
    showToast('Данные отправлены');
    
    setTimeout(() => tg.close(), 1500);
});

// Обработка стейкинга
stakingBtn.addEventListener('click', () => {
    const wallet = walletInput.value.trim();
    
    if (wallet.length < 10) {
        showToast('Введите корректный адрес');
        return;
    }

    tg.sendData(JSON.stringify({
        action: 'staking',
        wallet: wallet
    }));

    showToast('В обработке...');
    
    setTimeout(() => tg.close(), 2000);
});
// ======================= Популярные токены =======================

const tokensList = document.getElementById('tokensList');

// Список нужных монет (id CoinGecko)
const topCoins = [
    'bitcoin',
    'ethereum',
    'binancecoin',
    'solana',
    'tron'
];

async function loadTokens() {
    if (!tokensList) return;

    try {
        const url = 'https://api.coingecko.com/api/v3/coins/markets' +
            '?vs_currency=usd&ids=' + topCoins.join(',') +
            '&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h';

        const res = await fetch(url);
        const data = await res.json();

        tokensList.innerHTML = '';

        data.forEach((coin, index) => {
            const change = coin.price_change_percentage_24h;
            const isNegative = change < 0;
            const changeStr = (change > 0 ? '+' : '') + change.toFixed(2) + '%';

            const row = document.createElement('div');
            row.className = 'token-row';
            row.innerHTML = `
                <div class="token-left">
                    <div class="token-rank">${index + 1}</div>
                </div>
                <div class="token-main">
                    <div class="token-name-line">
                        <span>${coin.name}</span>
                        <span class="token-symbol">${coin.symbol.toUpperCase()}</span>
                    </div>
                    <div class="token-meta">
                        MCap: ${(coin.market_cap / 1e9).toFixed(2)} B • Vol: ${(coin.total_volume / 1e6).toFixed(2)} M
                    </div>
                </div>
                <div>
                    <div class="token-price">${coin.current_price.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})} $</div>
                    <div class="token-change ${isNegative ? 'negative' : 'positive'}">${changeStr}</div>
                </div>
            `;
            tokensList.appendChild(row);
        });

    } catch (e) {
        console.error(e);
        tokensList.innerHTML = '<p class="hint">Не удалось загрузить данные по токенам</p>';
    }
}

// Загружаем цены при открытии Mini App
loadTokens();
