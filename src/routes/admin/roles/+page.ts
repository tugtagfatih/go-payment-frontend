import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await apiFetch('/admin/manageable-users', {}, fetch);

		if (!response.ok) {
			// Hata mesajını JSON olarak değil, metin olarak al (Güvenli yöntem)
			const errorText = await response.text();
			throw new Error(errorText || 'Failed to fetch manageable users');
		}

		// Sadece burada .json() çağır
		const manageableUsers = await response.json();
		return { manageableUsers };
	} catch (error) {
		return { manageableUsers: [], error: (error as Error).message };
	}
};
