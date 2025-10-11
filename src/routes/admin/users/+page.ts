import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
    // URL'den arama parametresini alıyoruz
    const searchQuery = url.searchParams.get('q') || '';
    try {
        const response = await apiFetch(`/admin/users?username=${searchQuery}`);
        if (!response.ok) { /* ...hata kontrolü... */ }
        const users = await response.json();
        return { users, searchQuery };
    } catch (error) {
        return { users: [], error: (error as Error).message };
    }
};