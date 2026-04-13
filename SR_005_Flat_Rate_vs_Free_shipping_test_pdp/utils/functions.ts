import { getVariant } from './variantStore.ts';
import { copy, freeShippingThresholds, siteLocationMap } from './constants.ts';

export const init = (uspText: HTMLElement, shippingText: HTMLElement, unicornCartBlock: HTMLElement) => {
	const variant = getVariant();
	const hostName = window.location.hostname;
	const siteLocation = siteLocationMap[hostName as keyof typeof siteLocationMap];
	const threshold = freeShippingThresholds[variant][siteLocation];

	if (!threshold) return;

	uspText.innerHTML = `${copy.freeShipping} ${threshold}*`;

	shippingText.innerHTML = `*${copy.freeShipping}  ${threshold} from local warehouses is available in select countries. Find out more here.`;

	const freeShippingUnlockTxt = unicornCartBlock.querySelector('.unicorn_cart_unlock span strong');
	if (!freeShippingUnlockTxt) return;

	freeShippingUnlockTxt.textContent = freeShippingUnlockTxt.textContent.replace('Flat Rate', 'FREE');
};

export const observeUnicornCart = (targetNode: HTMLElement) => {
	const observer = new MutationObserver((mutationList, observer) => {
		for (const mutation of mutationList) {
			if (mutation.type === 'childList') {
				const waitForEl = setInterval(() => {
					const freeShippingUnlockTxt = targetNode.querySelector('.unicorn_cart_unlock span strong');
					const progressBar = targetNode.querySelector('.unlock_progress_bar__mckDF');
					const checkoutBtnTxt = targetNode.querySelector('.unicorn_cart_checkout_button_text');
					if (freeShippingUnlockTxt && checkoutBtnTxt) {
						clearInterval(waitForEl);

						const variant = getVariant();
						const hostName = window.location.hostname;
						const siteLocation = siteLocationMap[hostName as keyof typeof siteLocationMap];
						const threshold = freeShippingThresholds[variant][siteLocation];

						const distanceToThreshold = getDistanceToThreshold(checkoutBtnTxt as HTMLElement, threshold);

						if (distanceToThreshold <= 0) {
							freeShippingUnlockTxt.textContent = "You've unlocked FREE Shipping!";
						} else {
							const currencySymbol = threshold.match(/^[^\d]/)?.[0] ?? '$';
							freeShippingUnlockTxt.textContent = `You are ${currencySymbol}${distanceToThreshold.toFixed(2)} from FREE Shipping!`;
						}

						if (progressBar) {
							const thresholdAmount = parseAmount(threshold);
							const cartTotal = thresholdAmount - distanceToThreshold;
							const percentage = Math.min((cartTotal / thresholdAmount) * 100, 100);
							(progressBar as HTMLElement).style.width = `${percentage}%`;
						}
					}
				}, 300);
			}
		}
	});
	// Options for the observer (which mutations to observe)
	const config = { attributes: true, childList: true, subtree: true };

	observer.observe(targetNode, config);
};

const parseAmount = (text: string): number => {
	const match = text.match(/[\$€£]([\d,.]+)/);
	return match ? parseFloat(match[1].replace(',', '')) : 0;
};

export const getDistanceToThreshold = (checkoutBtnTxt: HTMLElement, threshold: string): number => {
	const cartTotal = parseAmount(checkoutBtnTxt.textContent ?? '');
	const thresholdAmount = parseAmount(threshold);
	return thresholdAmount - cartTotal;
};
