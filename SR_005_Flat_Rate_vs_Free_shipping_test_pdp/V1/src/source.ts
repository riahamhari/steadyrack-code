import { waitForSelectors } from '@utils/ts/promiseModules';
import { waitForAll } from '@utils/ts/waitForAll';
import { variant } from './testConfig.ts';
import { setVariant } from '../../utils/variantStore.ts';
import { init, observeUnicornCart } from '../../utils/functions.ts';

const tagInterval = setInterval(() => {
	if (typeof window?.clarity === 'function') {
		window.clarity('set', 'test-SR005', 'variation-1');
		clearInterval(tagInterval);
	}
}, 300);
let v = variant;
setVariant(v);

const result = await waitForAll(
	waitForSelectors(
		[
			'#product .l-product-benefits.l-grid .l-product-benefits__text:has([href="/pages/shipping"])',
			'#product .l-product__collapsible-content-inner [href="/pages/shipping"]',
			'#unicorn-cart-block',
		],
		{ forceArray: true }
	)
);

const [[uspText], [shippingText], [unicornCartBlock]] = result.elements as HTMLElement[][];

init(uspText, shippingText, unicornCartBlock);

observeUnicornCart(unicornCartBlock);
