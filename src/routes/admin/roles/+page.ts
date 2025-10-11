import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => { // { fetch } eklendi
	try {
		const response = await apiFetch('/admin/manageable-users', {}, fetch); // fetch gönderildi
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Failed to fetch manageable users');
		}
		const manageableUsers = await response.json();
		return { manageableUsers };
	} catch (error) {
		return { manageableUsers: [], error: (error as Error).message };
	}
};