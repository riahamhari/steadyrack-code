import { getVariant } from './variantStore.ts';
import { copy, freeShippingThresholds, siteLocationMap } from './constants.ts';

export const init = (shippingAnnouncement: HTMLElement) => {
	const variant = getVariant();
	const hostName = window.location.hostname;
	const siteLocation = siteLocationMap[hostName as keyof typeof siteLocationMap];
	const threshold = freeShippingThresholds[variant][siteLocation];

	if (!threshold) return;

	shippingAnnouncement.innerHTML = `
                   ${copy.freeShipping} ${threshold}* <span class="announcement__divider"></span>
		<a href="/pages/shipping" title="Shipping">T&amp;Cs Apply</a>`;
};
