// 開始時間をnullで初期化
let startTime = null;
let timerDuration = null;

// タイマー要素を作成
const timerElement = document.createElement('div');
timerElement.style.fontSize = '20px';
timerElement.style.color = 'white';
timerElement.style.marginLeft = '10px';

// DOMの変更を監視するMutationObserverを作成
const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('div[data-self-name]')) {
					if (!startTime) {
						startTime = Date.now();
						chrome.storage.local.set({ startTime: startTime });
					}

					// タイマー要素をMTG名の横に追加
					const headerElement = document.querySelector('.lefKC');
					if (headerElement) {
						headerElement.appendChild(timerElement);
					}
				}
			});
		}
	});
});

// body要素の子要素の変更を監視開始
observer.observe(document.body, { childList: true, subtree: true });

// ページがアンロードされたときに終了時間を送信
window.addEventListener('beforeunload', () => {
	chrome.runtime.sendMessage({ endTime: Date.now() });
});

// 1秒ごとに経過時間を更新
setInterval(() => {
	// 開始時間とタイマーの期間を取得
	chrome.storage.local.get(['startTime', 'timerDuration'], (data) => {
		if (data.startTime) {
			startTime = data.startTime;
		}
		if (data.timerDuration) {
			timerDuration = data.timerDuration;
		}
		// タイマーの期間が指定されていない場合はデフォルトで30分に設定
		else {
			timerDuration = 30 * 60 * 1000;
		}

		if (startTime) {
			const elapsedTime = Date.now() - startTime;
			const minutes = Math.floor(elapsedTime / 60000);
			const seconds = ((elapsedTime % 60000) / 1000).toFixed(0);
			timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

			// タイマーの期間が経過したら、タイマーの色を赤に変更
			if (timerDuration && elapsedTime >= timerDuration) {
				timerElement.style.color = 'red';
			} else {
				timerElement.style.color = 'white';
			}
		} else {
			timerElement.textContent = '';
			timerElement.style.color = 'white';
		}
	});
}, 1000);

// background.jsからリセットメッセージを受信したときにタイマーをリセット
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.resetTimer) {
		startTime = null;
		timerDuration = null;
		chrome.storage.local.set({ startTime: null, timerDuration: null });
		timerElement.textContent = '';
	}
});