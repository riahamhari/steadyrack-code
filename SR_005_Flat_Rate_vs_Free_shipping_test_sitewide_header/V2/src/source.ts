import { waitForSelectors } from '@utils/ts/promiseModules';
import { waitForAll } from '@utils/ts/waitForAll';
import { variant } from './testConfig.ts';
import { setVariant } from '../../utils/variantStore.ts';
import { init } from '../../utils/functions.ts';

const tagInterval = setInterval(() => {
	if (typeof window?.clarity === 'function') {
		window.clarity('set', 'test-SR005', 'variation-2');
		clearInterval(tagInterval);
	}
}, 300);

let v = variant;
setVariant(v);

const result = await waitForAll(
	waitForSelectors(
		['.announcement .announcement__block:has([href="/pages/shipping"])  .announcement__scale .text-highlight__break'],
		{ forceArray: true }
	)
);

const [[shippingAnnouncement]] = result.elements as HTMLElement[][];
init(shippingAnnouncement);
