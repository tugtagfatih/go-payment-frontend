import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        // Admin paneli için tüm bankaları çekiyoruz
        const response = await apiFetch('/admin/banks', {}, fetch);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch deposit banks');
        }
        const banks = await response.json();
        return { banks };
    } catch (error) {
        return { banks: [], error: (error as Error).message };
    }
};