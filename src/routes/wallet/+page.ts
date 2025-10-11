import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Cüzdan ve işlem geçmişini aynı anda çekiyoruz
		const [walletResponse, historyResponse] = await Promise.all([
			apiFetch('/api/wallet', {}, fetch),
			apiFetch('/api/wallet/history', {}, fetch)
		]);

		if (!walletResponse.ok) {
			throw new Error('Cüzdan bilgileri alınamadı.');
		}
		const wallet = await walletResponse.json();

		// İşlem geçmişi olmasa bile sayfanın çalışması için kontrol ekliyoruz
		const transactionHistory = historyResponse.ok ? await historyResponse.json() : [];

		return { wallet, transactionHistory };

	} catch (error) {
		return { 
			wallet: null, 
			transactionHistory: [], 
			error: (error as Error).message 
		};
	}
};