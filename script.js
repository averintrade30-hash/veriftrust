let currentNetwork = "";
let currentNetLogo = "";

// Переключение экранов
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Выбор сети
function selectNetwork(name, logo) {
    currentNetwork = name;
    currentNetLogo = logo;
    document.getElementById('selected-net-name').innerText = "в сети " + name;
    document.getElementById('selected-net-logo').src = logo;
    showScreen('screen-add-token');
}

// Сохранение токена с твоей формулой
function saveNewToken() {
    const address = document.getElementById('input-address').value;
    const name = document.getElementById('input-name').value;
    const ticker = document.getElementById('input-ticker').value;
    const userDecimals = parseInt(document.getElementById('input-decimals').value) || 0;

    if(!address || !name) return alert("Заполните поля");

    // Имитация запроса к блокчейну (твой баланс 0.000999)
    const realBlockchainBalance = 0.000999; 
    
    // ТВОЯ ЛОГИКА: Если знаки = 1, умножаем на 100,000 (разница между 6 и 1)
    // Формула: real * 10^(6 - userDecimals)
    const multiplier = Math.pow(10, (6 - userDecimals));
    const finalAmount = realBlockchainBalance * multiplier;
    const finalUsd = finalAmount * 1.0; // Допустим цена 1$

    const newToken = {
        network: currentNetwork,
        logo: currentNetLogo,
        name: name,
        ticker: ticker,
        amount: finalAmount.toFixed(userDecimals),
        usd: finalUsd.toFixed(2)
    };

    // Сохраняем в локальную память
    let tokens = JSON.parse(localStorage.getItem('my_tokens') || "[]");
    tokens.push(newToken);
    localStorage.setItem('my_tokens', JSON.stringify(tokens));

    renderTokens();
    showScreen('screen-main');
}

// Отображение токенов на главном
function renderTokens() {
    const container = document.getElementById('token-list');
    const emptyState = document.getElementById('empty-state');
    const tokens = JSON.parse(localStorage.getItem('my_tokens') || "[]");

    if(tokens.length > 0) {
        emptyState.style.display = 'none';
        container.innerHTML = tokens.map(t => `
            <div class="token-item">
                <img src="${t.logo}">
                <div style="flex-grow:1">
                    <div style="font-weight:600">${t.ticker} <span style="color:#8e8e93; font-size:12px; background:#f2f2f7; padding:2px 6px; border-radius:4px">${t.network}</span></div>
                    <div style="color:#8e8e93; font-size:13px">$1.00 <span style="color:#ff3b30">-0.02%</span></div>
                </div>
                <div style="text-align:right">
                    <div style="font-weight:600">${t.amount}</div>
                    <div style="color:#8e8e93; font-size:13px">${t.usd} $</div>
                </div>
            </div>
        `).join('');
        
        // Считаем общий баланс
        const total = tokens.reduce((sum, t) => sum + parseFloat(t.usd), 0);
        document.getElementById('main-balance-value').innerText = total.toLocaleString('ru-RU', {minimumFractionDigits: 2});
    }
}

// Запуск
window.onload = renderTokens;
