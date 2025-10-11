import type { PageLoad } from './$types';
import type { Listing } from '$lib/types';
import { API_BASE_URL } from '$lib/constants';

export const load: PageLoad = async ({ fetch, params }) => {
	// 'params' objesi, URL'deki dinamik kısımları içerir.
	// Klasörümüzün adı [id] olduğu için, params.id diyerek ID'yi alabiliyoruz.
	const id = params.id;

	try {
		// Yeni backend endpoint'imize ID ile istek atıyoruz.
		const response = await fetch(`${API_BASE_URL}/listings/${id}`);

		if (!response.ok) {
			if (response.status === 404) {
				return { status: 404, error: 'Listing not found', listing: null };
			}
			throw new Error(`API request failed with status ${response.status}`);
		}

		const listing: Listing = await response.json();

		return {
			listing: listing
		};
	} catch (error) {
		console.error('Failed to load listing:', error);
		return {
			status: 500,
			error: 'Could not fetch listing from the server.',
			listing: null
		};
	}
};