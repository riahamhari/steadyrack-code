import { PRICE_VALUES } from './constants.ts';

export const init = (priceEls: HTMLElement[]) => {
	priceEls.forEach((price) => {
		price.classList.add('au-002-price');
		price.innerHTML = `<span class="au-002-price__strikethrough-price">${PRICE_VALUES.strikethroughPrice}</span>
						<span class="au-002-price__discount-price">${PRICE_VALUES.discountPrice}</span>
						<span class="au-002-price__discountPct-label">${PRICE_VALUES.discountPercentage} OFF</span>`;
	});
};

const BREAKDOWN_ID = 'au-002-cart-breakdown';

const applyCartChanges = (targetNode: HTMLElement): boolean => {
	const freeShippingUnlockTxt = targetNode.querySelector('.unicorn_cart_unlock span strong');
	const checkoutBtnTxt = targetNode.querySelector('.unicorn_cart_checkout_button_text');
	const priceContainer = targetNode.querySelector<HTMLElement>('.items_prices__kPZpv');
	const cartFooter = targetNode.querySelector<HTMLElement>('.unicorn_cart_footer .unicorn_cart_block');
	const price = priceContainer?.querySelector<HTMLElement>(
		'span:not(.au-002-cart-price__strikethrough):not(.au-002-cart-price__discountPrice)'
	);

	if (!freeShippingUnlockTxt || !checkoutBtnTxt || !priceContainer || !cartFooter || !price) return false;

	const priceVal = parseAmount(price.textContent);
	const discountVal = Math.floor(Math.floor(priceVal) * 0.89) + 0.99;

	const discountAmount = Math.round(priceVal - discountVal).toFixed(2);

	// --- price container (strikethrough) ---
	const strikethroughEl = priceContainer.querySelector<HTMLElement>('.au-002-cart-price__strikethrough');
	const discountEl = priceContainer.querySelector<HTMLElement>('.au-002-cart-price__discountPrice');

	if (strikethroughEl && discountEl) {
		strikethroughEl.textContent = price.textContent;
		discountEl.textContent = `$${discountVal}`;
	} else {
		console.log('inserting strikethrough price');
		priceContainer.insertAdjacentHTML(
			'beforeend',
			`<span class="au-002-cart-price__strikethrough" style="display: block; font-size: 14px; text-align: right; text-transform: none; line-height: 1.2; width: auto;">${price.textContent}</span>
			<span class="au-002-cart-price__discountPrice" style="display: block; font-size: 14px; text-align: right; text-transform: none; line-height: 1.2; width: auto;">$${discountVal}</span>`
		);
	}

	// --- cart footer breakdown ---
	const existing = cartFooter.querySelector<HTMLElement>(`#${BREAKDOWN_ID}`);

	if (existing) {
		existing.querySelector<HTMLElement>('.au-002-bd__subtotal-val')!.textContent = price.textContent;
		existing.querySelector<HTMLElement>('.au-002-bd__discount-val')!.textContent = `-$${discountAmount}`;
		existing.querySelector<HTMLElement>('.au-002-bd__total-val')!.textContent = `$${discountVal}`;
	} else {
		const breakdown = document.createElement('div');
		breakdown.id = BREAKDOWN_ID;
		breakdown.innerHTML = `
			<div class="au-002-bd__row au-002-bd__row--subtotal">
				<span class="au-002-bd__label">Subtotal</span>
				<span class="au-002-bd__subtotal-val">${price.textContent}</span>
			</div>
			<div class="au-002-bd__row au-002-bd__row--discount">
				<span class="au-002-bd__label">Discount (11%)</span>
				<span class="au-002-bd__discount-val">-$${discountAmount}</span>
			</div>
			<div class="au-002-bd__row au-002-bd__row--total">
				<span class="au-002-bd__label">Total</span>
				<span class="au-002-bd__total-val">$${discountVal}</span>
			</div>
		`;
		cartFooter.prepend(breakdown);
	}

	return true;
};

const parseAmount = (text: string): number => {
	const match = text.match(/[\$€£]([\d,.]+)/);
	return match ? parseFloat(match[1].replace(',', '')) : 0;
};

export const observeUnicornCart = (targetNode: HTMLElement) => {
	applyCartChanges(targetNode);

	const config = { attributes: true, childList: true, subtree: true };

	const observer = new MutationObserver(() => {
		observer.disconnect();

		let intervalId: ReturnType<typeof setInterval>;

		const reconnect = () => {
			clearInterval(intervalId);
			observer.observe(targetNode, config);
		};

		intervalId = setInterval(() => {
			if (applyCartChanges(targetNode)) reconnect();
		}, 300);

		setTimeout(reconnect, 3000);
	});

	observer.observe(targetNode, config);
};
