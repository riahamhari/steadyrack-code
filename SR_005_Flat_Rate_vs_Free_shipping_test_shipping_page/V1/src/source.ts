import { waitForSelectors } from '@utils/ts/promiseModules';
import { waitForAll } from '@utils/ts/waitForAll';
import { variant } from './testConfig.ts';
import { setVariant } from '../../utils/variantStore.ts';
import { init } from '../../utils/functions.ts';

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
			'#MainContent .l-richtext__text strong',
			'#Specifications--template--25801115009309__a_product_specification_columns_cFhMKA .l-specification-columns__column:first-child .l-specification-columns__column-title',
		],
		{ forceArray: true }
	)
);

const [[shippingAnnouncement], [shippingHeader]] = result.elements as HTMLElement[][];
init(shippingAnnouncement, shippingHeader);
