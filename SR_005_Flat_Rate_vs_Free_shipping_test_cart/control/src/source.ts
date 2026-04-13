const tagInterval = setInterval(() => {
	if (typeof window?.clarity === 'function') {
		window.clarity('set', 'test-SR005', 'control');
		clearInterval(tagInterval);
	}
}, 300);
