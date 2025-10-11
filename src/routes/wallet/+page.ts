import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	try {
		const response = await apiFetch('/api/wallet');
		if (!response.ok) {
			throw new Error('Cüzdan bilgileri alınamadı.');
		}
		const wallet = await response.json();
		return { wallet };
	} catch (error) {
		return { wallet: null, error: (error as Error).message };
	}
};