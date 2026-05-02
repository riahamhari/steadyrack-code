const tagInterval = setInterval(() => {
	if (typeof window?.clarity === 'function') {
		window.clarity('set', 'test-AU002', 'control');
		clearInterval(tagInterval);
	}
}, 300);
