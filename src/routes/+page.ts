import type { PageLoad } from './$types';
import type { Listing } from '$lib/types';
import { API_BASE_URL } from '$lib/constants';

// 'load' fonksiyonu artık SvelteKit'in { fetch }'ini parametre olarak alıyor
export const load: PageLoad = async ({ fetch }) => {
	try {
		// İstek atarken global fetch yerine parametre olarak gelen fetch'i kullanıyoruz
		const response = await fetch(`${API_BASE_URL}/listings`);

		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}`);
		}

		const listings: Listing[] = await response.json();

		return {
			listings: listings
		};
	} catch (error) {
		console.error('Failed to load listings:', error);
		return {
			status: 500,
			error: 'Could not fetch listings from the server.',
			listings: []
		};
	}
};