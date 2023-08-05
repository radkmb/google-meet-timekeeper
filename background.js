chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.startTime) {
        chrome.storage.local.set({ startTime: message.startTime });
        // 開始時刻をcontent scriptに送り返す
        chrome.tabs.sendMessage(sender.tab.id, { startTime: message.startTime });
    } else if (message.endTime) {
        chrome.storage.local.remove('startTime');
        // アラームをクリアする
        chrome.alarms.clear('TimeKeeperAlarm');
    } else if (message.timerDuration) {
        // タイマーの期間に基づいてアラームを設定する
        chrome.alarms.create('TimeKeeperAlarm', { delayInMinutes: parseFloat(message.timerDuration) });
    }
    if (message.resetTimer) {
        // リセットメッセージを受け取ったときにアラームをクリアする
        chrome.alarms.clear('TimeKeeperAlarm');
    }
});

// アラームが発生したときにアラートを表示する
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'TimeKeeperAlarm') {
        chrome.notifications.create('TimeKeeperNotification', {
            type: 'basic',
            iconUrl: 'icons/128.png',
            title: 'Google Meet TimeKeeper',
            message: '設定時間が経過しました！'
        });
    }
});
