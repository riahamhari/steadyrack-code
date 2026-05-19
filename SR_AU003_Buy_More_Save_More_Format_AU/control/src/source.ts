const tagInterval = setInterval(() => {
	if (typeof window?.clarity === 'function') {
		window.clarity('set', 'test-AU003', 'control');
		clearInterval(tagInterval);
	}
}, 300);
