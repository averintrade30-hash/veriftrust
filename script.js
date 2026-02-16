// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();

// Элементы
const photoInput = document.getElementById('photoInput');
const verifyBtn = document.getElementById('verifyBtn');
const walletInput = document.getElementById('walletInput');
const stakingBtn = document.getElementById('stakingBtn');
const status = document.getElementById('status');

// Функция показа статуса
function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    status.classList.remove('hidden');
    
    setTimeout(() => {
        status.classList.add('hidden');
    }, 5000);
}

// Верификация
verifyBtn.addEventListener('click', () => {
    const file = photoInput.files[0];
    
    if (!file) {
        showStatus('❌ Выберите фото для верификации', 'error');
        return;
    }

    // Отправляем данные боту
    tg.sendData(JSON.stringify({
        action: 'verify',
        fileName: file.name,
        fileSize: file.size,
        timestamp: Date.now()
    }));

    showStatus('✅ Документ отправлен на проверку', 'success');
});

// Подключение стейкинга
stakingBtn.addEventListener('click', () => {
    const wallet = walletInput.value.trim();
    
    if (!wallet) {
        showStatus('❌ Введите адрес кошелька', 'error');
        return;
    }

    if (!wallet.startsWith('0x') || wallet.length < 40) {
        showStatus('❌ Неверный формат адреса кошелька', 'error');
        return;
    }

    // Отправляем данные боту
    tg.sendData(JSON.stringify({
        action: 'staking',
        wallet: wallet,
        timestamp: Date.now()
    }));

    showStatus('⏳ Запрос в обработке...', 'processing');
    
    // Закрываем приложение через 2 секунды
    setTimeout(() => {
        tg.close();
    }, 2000);
});

// Настройка темы Telegram
tg.ready();
