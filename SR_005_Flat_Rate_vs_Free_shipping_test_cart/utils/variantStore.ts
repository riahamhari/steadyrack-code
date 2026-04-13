// utils/variantStore.ts
let _variant: string | undefined;

export const setVariant = (v: string) => {
	_variant = v;
};

export const getVariant = (): string => _variant;
