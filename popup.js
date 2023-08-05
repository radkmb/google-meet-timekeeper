// タイマーの時間を設定する
document.getElementById('setTimerButton').addEventListener('click', () => {
    const hours = document.getElementById('timerInputHours').value || 0;
    const minutes = document.getElementById('timerInputMinutes').value || 0;
    const seconds = document.getElementById('timerInputSeconds').value || 0;

    const timerDuration = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;

    if (timerDuration) {
        chrome.storage.local.set({ timerDuration: timerDuration }, () => {
            document.getElementById('message').textContent = `タイマーを${hours}時間${minutes}分${seconds}秒で設定しました`;

            document.getElementById('timerInputHours').style.display = 'none';
            document.getElementById('timerInputHoursString').style.display = 'none';
            document.getElementById('timerInputMinutes').style.display = 'none';
            document.getElementById('timerInputMinutesString').style.display = 'none';
            document.getElementById('timerInputSeconds').style.display = 'none';
            document.getElementById('timerInputSecondsString').style.display = 'none';
            document.getElementById('setTimerButton').style.display = 'none';

            setTimeout(() => {
                document.getElementById('message').textContent = '';
            }, 1000);
        });
        // タイマーの期間に基づいてアラームを設定するメッセージを送信
        chrome.runtime.sendMessage({ resetTimer: true });

    }
});

// タイマーをリセット
document.getElementById('resetTimerButton').addEventListener('click', () => {
    chrome.storage.local.set({ startTime: null, timerDuration: null }, () => {
        document.getElementById('message').textContent = `タイマーをリセットしました`;

        document.getElementById('timerInputHours').style.display = 'inline';
        document.getElementById('timerInputHoursString').style.display = 'inline';
        document.getElementById('timerInputMinutes').style.display = 'inline';
        document.getElementById('timerInputMinutesString').style.display = 'inline';
        document.getElementById('timerInputSeconds').style.display = 'inline';
        document.getElementById('timerInputSecondsString').style.display = 'inline';
        document.getElementById('setTimerButton').style.display = 'inline';

        setTimeout(() => {
            document.getElementById('message').textContent = '';
        }, 1000);
    });

    // リセットメッセージを送信
    chrome.runtime.sendMessage({ resetTimer: true });
});