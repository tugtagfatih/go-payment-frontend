import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    try {
        const response = await apiFetch('/admin/withdrawals?status=pending');
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