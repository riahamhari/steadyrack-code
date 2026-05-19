import { createHTMLElement } from '@utils/ts/helpers/DOM';
import { COPY, pctIcon } from './constants.ts';

export const init = (variantSelects: HTMLElement) => {
	document.body.classList.add('sr_au003');
	const greenPdpBar = createHTMLElement('div', {
		className: 'au003_pdp_bar',
		html: `<p>${pctIcon}${COPY.bnsm}</p>`,
	});

	variantSelects.after(greenPdpBar);
};

const BREAKDOWN_ID = 'au-002-cart-breakdown';
const BMSM_BAR_ID = 'au003-bmsm-bar';

const getBmsmBarState = (discountPct: string | null | undefined) => {
	const pct = discountPct ? parseInt(/(\d+)/.exec(discountPct)?.[1] ?? '0') : 0;
	if (pct >= 10) return { step: 3, fillPct: 100, text: "You're saving the most!", badge: 'Saving 10%' };
	if (pct >= 5) return { step: 2, fillPct: 50, text: 'Add 1 more rack to save 10%', badge: 'Saving 5%' };
	return { step: 1, fillPct: 0, text: 'Add 1 more to save 5%', badge: '' };
};

const applyCartChanges = (targetNode: HTMLElement): boolean => {
	const freeShippingUnlockTxt = targetNode.querySelector('.unicorn_cart_unlock span strong');
	const checkoutBtnTxt = targetNode.querySelector('.unicorn_cart_checkout_button_text');
	const priceContainer = targetNode.querySelector<HTMLElement>('.items_prices__kPZpv');
	const cartFooter = targetNode.querySelector<HTMLElement>('.unicorn_cart_footer .unicorn_cart_block');
	const price = targetNode?.querySelector<HTMLElement>(
		'.items_prices__kPZpv > span:not(.au-002-cart-price__strikethrough):not(.au-002-cart-price__discountPrice):nth-child(1)'
	);

	if (!freeShippingUnlockTxt || !checkoutBtnTxt || !priceContainer || !cartFooter || !price) {
		targetNode.querySelector(`#${BMSM_BAR_ID}`)?.remove();
		return false;
	}

	const discountedPrice = document.querySelector(
		'.items_prices__kPZpv > span:not(.au-002-cart-price__strikethrough):not(.au-002-cart-price__discountPrice):nth-child(2)'
	);
	const discountPct = targetNode.querySelector('.items_discount_tag__eVCmt span span')?.textContent;

	const priceVal = parseAmount(price.textContent);
	const discountedPriceVal = discountedPrice ? parseAmount(discountedPrice.textContent) : null;

	// --- cart footer breakdown ---
	const cartBreakdown = cartFooter.querySelector<HTMLElement>(`#${BREAKDOWN_ID}`);

	if (cartBreakdown) {
		cartBreakdown.querySelector<HTMLElement>('.au-002-bd__subtotal-val').textContent = price.textContent;
		let discountRow = cartBreakdown.querySelector<HTMLElement>('.au-002-bd__row--discount');
		if (discountedPrice) {
			if (!discountRow) {
				discountRow = document.createElement('div');
				discountRow.className = 'au-002-bd__row au-002-bd__row--discount';
				discountRow.innerHTML = `<span class="au-002-bd__label">Buy More Save More (<span>${discountPct}</span>)</span><span class="au-002-bd__discount-val"></span>`;
				cartBreakdown.querySelector<HTMLElement>('.au-002-bd__row--subtotal').after(discountRow);
			}
			discountRow.style.display = '';
			discountRow.querySelector<HTMLElement>('.au-002-bd__discount-val').textContent =
				`-$${(priceVal - discountedPriceVal).toFixed(2)}`;
			discountRow.querySelector<HTMLElement>('.au-002-bd__label span').textContent = discountPct;
		} else if (discountRow) {
			discountRow.style.display = 'none';
		}

		cartBreakdown.querySelector<HTMLElement>('.au-002-bd__total-val').textContent =
			`$${discountedPrice ? discountedPriceVal : priceVal}`;
		const discountPriceOffEl = cartBreakdown.querySelector<HTMLElement>('.au-002-bd__label span');
		if (discountPriceOffEl) discountPriceOffEl.textContent = `${discountPct}`;
	} else {
		const breakdown = document.createElement('div');
		breakdown.id = BREAKDOWN_ID;
		breakdown.innerHTML = `
			<div class="au-002-bd__row au-002-bd__row--subtotal">
				<span class="au-002-bd__label">Subtotal</span>
				<span class="au-002-bd__subtotal-val">${price.textContent}</span>
			</div>
            ${
							discountedPrice
								? `	<div class="au-002-bd__row au-002-bd__row--discount">
				<span class="au-002-bd__label">Buy More Save More (<span>${discountPct}</span>)</span>
				<span class="au-002-bd__discount-val">-$${(priceVal - discountedPriceVal).toFixed(2)}</span>
			</div>`
								: ``
						}
		
			<div class="au-002-bd__row au-002-bd__row--total">
				<span class="au-002-bd__label">Total</span>
				<span class="au-002-bd__total-val">$${discountedPrice ? discountedPriceVal : priceVal}</span>
			</div>
		`;
		cartFooter.prepend(breakdown);
	}

	// --- BMSM progress bar ---
	const { step, fillPct, text, badge } = getBmsmBarState(discountPct);
	const dotClass = (i: number) =>
		i < step
			? 'au003-bmsm__dot au003-bmsm__dot--passed'
			: i === step
				? 'au003-bmsm__dot au003-bmsm__dot--active'
				: 'au003-bmsm__dot';

	const existingBmsmBar = targetNode.querySelector<HTMLElement>(`#${BMSM_BAR_ID}`);
	if (existingBmsmBar) {
		existingBmsmBar.querySelector<HTMLElement>('.au003-bmsm__text').textContent = text;
		const badgeEl = existingBmsmBar.querySelector<HTMLElement>('.au003-bmsm__badge');
		badgeEl.textContent = badge;
		badgeEl.style.display = badge ? '' : 'none';
		existingBmsmBar.querySelector<HTMLElement>('.au003-bmsm__fill').style.width = `${fillPct}%`;
		existingBmsmBar.querySelectorAll<HTMLElement>('.au003-bmsm__dot').forEach((dot, i) => {
			dot.className = dotClass(i + 1);
		});
	} else {
		const cartBlock = targetNode.querySelector<HTMLElement>('.unicorn_cart_block');
		if (!cartBlock) return true;
		const bmsmBar = document.createElement('div');
		bmsmBar.id = BMSM_BAR_ID;
		bmsmBar.innerHTML = `
			<div class="au003-bmsm__header">
				<p class="au003-bmsm__text">${text}</p>
				<span class="au003-bmsm__badge" style="${badge ? '' : 'display:none'}">${badge}</span>
			</div>
			<div class="au003-bmsm__track">
				<div class="au003-bmsm__fill" style="width:${fillPct}%"></div>
				<span class="${dotClass(1)}"></span>
				<span class="${dotClass(2)}"></span>
				<span class="${dotClass(3)}"></span>
			</div>
			<div class="au003-bmsm__labels">
				<span>1</span>
				<span>2</span>
				<span>3 · 10%</span>
			</div>
		`;
		cartBlock.after(bmsmBar);
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
