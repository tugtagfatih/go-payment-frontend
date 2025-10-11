import type { PageLoad } from './$types';
import type { Listing } from '$lib/types'; // Bir önceki adımda oluşturduğumuz tipi import ediyoruz
import { API_BASE_URL } from '$lib/constants';

export const load: PageLoad = async ({ fetch }) => {
	try {
		//const response = await fetch('https://8080-firebase-go-odeme-bildirimi-1759869459857.cluster-yy7ncoxb5zd4ouvntrhoc3go3k.cloudworkstations.dev/listings');
		const response = await fetch(`${API_BASE_URL}/listings`);

		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}`);
		}

		// Gelen cevabı JSON olarak parse ederken, bunun bir Listing dizisi olduğunu belirtiyoruz.
		const listings: Listing[] = await response.json();

		// Bu veriyi sayfaya (component) göndermek için return ediyoruz.
		return {
			listings: listings
		};
	} catch (error) {
		console.error('Failed to load listings:', error);
		// Hata durumunda sayfaya hata mesajı ve boş bir liste gönderiyoruz.
		return {
			status: 500,
			error: 'Could not fetch listings from the server.',
			listings: []
		};
	}
};