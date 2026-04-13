import { getVariant } from './variantStore.ts';
import { copy, freeShippingThresholds, siteLocationMap } from './constants.ts';

export const init = (shippingInfo: HTMLElement, shippingHeader: HTMLElement) => {
	const variant = getVariant();
	const hostName = window.location.hostname;
	const siteLocation = siteLocationMap[hostName as keyof typeof siteLocationMap];
	const threshold = freeShippingThresholds[variant][siteLocation];

	if (!threshold) return;

	shippingInfo.textContent = `
				   ${copy.freeShipping} ${threshold}${siteLocation === 'na' ? ' USD' : ''} to selected locations. See below for further information.`;

	shippingHeader.textContent = `Free Shipping Locations`;
};
