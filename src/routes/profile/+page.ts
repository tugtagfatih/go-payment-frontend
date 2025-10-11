import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Promise.all'a profil bilgisini çekecek isteği ekliyoruz.
		const [historyResponse, profileResponse] = await Promise.all([
			apiFetch('/api/wallet/history', {}, fetch),
			apiFetch('/api/profile', {}, fetch) // YENİ EKLENDİ
		]);

		if (!historyResponse.ok) {
			const error = await historyResponse.json();
			throw new Error(error.message || 'İşlem geçmişi alınamadı.');
		}
        if (!profileResponse.ok) {
			const error = await profileResponse.json();
			throw new Error(error.message || 'Profil bilgileri alınamadı.');
		}
		
		const transactionHistory = await historyResponse.json();
		const profile = await profileResponse.json(); // YENİ EKLENDİ

		return { 
			transactionHistory,
			profile // YENİ EKLENDİ
		};

	} catch (error) {
		return { 
			transactionHistory: [],
			profile: null, // YENİ EKLENDİ
			error: (error as Error).message 
		};
	}
};