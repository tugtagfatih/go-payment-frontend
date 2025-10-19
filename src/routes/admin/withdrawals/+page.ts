import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await apiFetch('/admin/withdrawals?status=pending', {}, fetch);

		if (!response.ok) {
			// Hata mesajını JSON olarak değil, metin olarak al (Güvenli yöntem)
			const errorText = await response.text();
			throw new Error(errorText || 'Failed to fetch withdrawal requests');
		}

		// Sadece burada .json() çağır
		const requests = await response.json();
		return { requests };
	} catch (error) {
		return { requests: [], error: (error as Error).message };
	}
};
