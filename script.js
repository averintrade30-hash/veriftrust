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

// ============= Обработка верификации =============
verifyBtn.addEventListener('click', () => {
    if (!docInput.files[0] || !selfieInput.files[0]) {
        showToast('❌ Пожалуйста, загрузите оба фото');
        return;
    }

    const data = {
        action: 'verify',
        docName: docInput.files[0].name,
        selfieName: selfieInput.files[0].name,
        timestamp: Date.now()
    };

    tg.sendData(JSON.stringify(data));
    showToast('✅ Документы отправлены на проверку');
    
    setTimeout(() => tg.close(), 1500);
});

// ============= Обработка стейкинга =============
stakingBtn.addEventListener('click', () => {
    const wallet = walletInput.value.trim();
    
    if (wallet.length < 10) {
        showToast('❌ Введите корректный адрес кошелька');
        return;
    }

    tg.sendData(JSON.stringify({
        action: 'staking',
        wallet: wallet,
        timestamp: Date.now()
    }));

    showToast('⏳ Запрос в обработке...');
    
    setTimeout(() => tg.close(), 2000);
});

// ============= Популярные токены (онлайн) =============

const tokensList = document.getElementById('tokensList');

// ID монет из CoinGecko API
const topCoins = [
    { id: 'bitcoin', name: 'Bitcoin' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'binancecoin', name: 'BNB Smart Chain' },
    { id: 'solana', name: 'Solana' },
    { id: 'tron', name: 'Tron' }
];

async function loadTokens() {
    if (!tokensList) return;

    try {
        const ids = topCoins.map(c => c.id).join(',');
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h`;

        const res = await fetch(url);
        const data = await res.json();

        tokensList.innerHTML = '';

        data.forEach((coin, index) => {
            const change = coin.price_change_percentage_24h || 0;
            const isNegative = change < 0;
            const changeStr = (change > 0 ? '+' : '') + change.toFixed(2) + '%';

            // Форматируем цену
            let priceFormatted;
            if (coin.current_price >= 1000) {
                priceFormatted = Math.floor(coin.current_price).toLocaleString('en-US').replace(/,/g, ' ');
            } else if (coin.current_price >= 1) {
                priceFormatted = coin.current_price.toFixed(2).replace('.', ',');
            } else {
                priceFormatted = coin.current_price.toFixed(4).replace('.', ',');
            }

            // Форматируем капитализацию и объём
            const mcap = (coin.market_cap / 1e9).toFixed(2).replace('.', ',');
            const vol = (coin.total_volume / 1e9).toFixed(2).replace('.', ',');

            const row = document.createElement('div');
            row.className = 'token-row';
            row.innerHTML = `
                <div class="token-rank">${index + 1}</div>
                <img src="${coin.image}" alt="${coin.name}" class="token-icon">
                <div class="token-main">
                    <div class="token-name">${topCoins[index].name}</div>
                    <div class="token-meta">MCap: ${mcap} $ • Vol: ${vol} $</div>
                </div>
                <div class="token-right">
                    <div class="token-price">${priceFormatted} $</div>
                    <div class="token-change ${isNegative ? 'negative' : 'positive'}">${changeStr}</div>
                </div>
            `;
            tokensList.appendChild(row);
        });

    } catch (e) {
        console.error('Ошибка загрузки токенов:', e);
        tokensList.innerHTML = '<div class="loading-text">Не удалось загрузить данные</div>';
    }
}

// Загружаем токены при открытии Mini App
loadTokens();
