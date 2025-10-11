import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

// load fonksiyonuna { fetch } parametresini ekleyin
export const load: PageLoad = async ({ fetch }) => {
    try {
        // apiFetch'e fetch'i üçüncü parametre olarak gönderin
        const response = await apiFetch('/admin/withdrawals?status=pending', {}, fetch);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch withdrawal requests');
        }
        const requests = await response.json();
        return { requests };
    } catch (error) {
        return { requests: [], error: (error as Error).message };
    }
};