import { waitForSelectors } from '@utils/ts/promiseModules';
import { waitForAll } from '@utils/ts/waitForAll';
import { variant } from './testConfig.ts';
import { setVariant } from '../../utils/variantStore.ts';
import { observeUnicornCart } from '../../utils/functions.ts';

const tagInterval = setInterval(() => {
	if (typeof window?.clarity === 'function') {
		window.clarity('set', 'test-SR005', 'variation-2');
		clearInterval(tagInterval);
	}
}, 300);
let v = variant;
setVariant(v);

const result = await waitForAll(waitForSelectors(['#unicorn-cart-block'], { forceArray: true }));

const [[unicornCartBlock]] = result.elements as HTMLElement[][];

observeUnicornCart(unicornCartBlock);
