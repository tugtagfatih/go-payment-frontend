import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await apiFetch('/admin/notifications?status=pending', {}, fetch);

		if (!response.ok) {
			// Hata mesajını JSON olarak değil, metin olarak al (Güvenli yöntem)
			const errorText = await response.text();
			throw new Error(errorText || 'Failed to fetch notifications');
		}

		// Sadece burada .json() çağır
		const notifications = await response.json();
		return { notifications };
	} catch (error) {
		return { notifications: [], error: (error as Error).message };
	}
};
