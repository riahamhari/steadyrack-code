import { waitForSelectors } from '@utils/ts/promiseModules';
import { waitForAll } from '@utils/ts/waitForAll';
import { init, observeUnicornCart } from '../../utils/functions.ts';

const tagInterval = setInterval(() => {
	if (typeof window?.clarity === 'function') {
		window.clarity('set', 'test-AU003', 'variation-1');
		clearInterval(tagInterval);
	}
}, 300);

const result = await waitForAll(
	waitForSelectors(['#variant-selects-template--20532675346477__a_main_product_xHy6Mr', '#unicorn-cart-block'], {
		forceArray: true,
	})
);

const [[variantSelects], [unicornCartBlock]] = result.elements as HTMLElement[][];

init(variantSelects);

observeUnicornCart(unicornCartBlock);
