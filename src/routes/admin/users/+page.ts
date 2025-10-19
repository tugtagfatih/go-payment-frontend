import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => { // fetch eklendi
	const searchQuery = url.searchParams.get('q') || '';
	try {
		// apiFetch'e fetch eklendi
		const response = await apiFetch(`/admin/users?username=${searchQuery}`, {}, fetch); 
		
		if (!response.ok) {
			// Hata mesajını JSON olarak değil, metin olarak al (Güvenli yöntem)
			const errorText = await response.text();
			throw new Error(errorText || 'Failed to fetch users');
		}

		// Sadece burada .json() çağır
		const users = await response.json();
		return { users, searchQuery };
	} catch (error) {
		return { users: [], error: (error as Error).message };
	}
};
