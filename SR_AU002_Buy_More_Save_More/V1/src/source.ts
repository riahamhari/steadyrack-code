import { waitForSelectors } from '@utils/ts/promiseModules';
import { waitForAll } from '@utils/ts/waitForAll';
import { init, observeUnicornCart } from '../../utils/functions.ts';

const tagInterval = setInterval(() => {
	if (typeof window?.clarity === 'function') {
		window.clarity('set', 'test-AU002', 'variation-1');
		clearInterval(tagInterval);
	}
}, 300);

const result = await waitForAll(
	waitForSelectors(['.l-product__price-normal.l-leading-1', '#unicorn-cart-block'], { forceArray: true })
);

const [priceEls, [unicornCartBlock]] = result.elements;

document.cookie = 'discount_code=DISCOUNT11; path=/';

init(priceEls);

observeUnicornCart(unicornCartBlock);
