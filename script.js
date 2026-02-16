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
