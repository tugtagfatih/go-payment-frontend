import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await apiFetch('/admin/banks', {}, fetch);
		
		if (!response.ok) {
			// Hata mesajını JSON olarak değil, metin olarak al (Güvenli yöntem)
			const errorText = await response.text();
			throw new Error(errorText || 'Failed to fetch deposit banks');
		}

		// Sadece burada .json() çağır
		const banks = await response.json();
		return { banks };
	} catch (error) {
		return { banks: [], error: (error as Error).message };
	}
};
