import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    try {
        // Backend'deki admin endpoint'ine istek atıyoruz.
        const response = await apiFetch('/admin/notifications?status=pending');
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch notifications');
        }
        const notifications = await response.json();
        return { notifications };
    } catch (error) {
        return { notifications: [], error: (error as Error).message };
    }
};