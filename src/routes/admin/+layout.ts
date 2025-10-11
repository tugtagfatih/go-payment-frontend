import { authStore } from '$lib/authStore';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

const ADMIN_ROLES = ['approver', 'admin', 'master_admin'];

export const load: LayoutLoad = async () => {
    const { isAuthenticated, role } = get(authStore);

    // Eğer kullanıcı giriş yapmamışsa veya rolü yetkili rollerden biri değilse,
    // ana sayfaya yönlendir ve işlemi durdur.
    if (!isAuthenticated || !role || !ADMIN_ROLES.includes(role)) {
        throw redirect(307, '/'); // 307: Geçici Yönlendirme
    }

    // Eğer yetkiliyse, sayfanın yüklenmesine izin ver.
    return {};
};