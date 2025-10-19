import { authStore } from '$lib/authStore';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

const ADMIN_ROLES = ['approver', 'admin', 'master_admin'];

export const load: LayoutLoad = async () => {
    const authState = get(authStore); // Tüm state'i al
    const { isAuthenticated, role } = authState;

    // --- DEBUG KODU ---
    console.log('Admin Layout Kontrolü:', { isAuthenticated, role });
    // --- DEBUG KODU SONU ---

    if (!isAuthenticated || !role || !ADMIN_ROLES.includes(role)) {
        console.error('!!! YÖNLENDİRME BLOKUNA GİRİLDİ !!!', { isAuthenticated, role });
	console.log('Admin layout\'tan yönlendiriliyor...'); // Yönlendirme logu
        throw redirect(307, '/');
    }

    // Yetkiliyse, sayfanın yüklenmesine izin ver.
    return {};
};
