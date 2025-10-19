<script lang="ts">
	import type { PageData } from './$types';
	import { apiFetch } from '$lib/api';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;
	// Use a string to track loading state for specific actions
	let loadingAction: string | null = null;
	let errorMessage = ''; // Add error message state

	async function handleAction(requestId: string, action: 'approve' | 'reject') {
		loadingAction = `${action}-${requestId}`; // Track which specific action is loading
		errorMessage = ''; // Clear previous errors
		try {
			const response = await apiFetch(`/admin/withdrawals/${requestId}/${action}`, {
				method: 'POST'
			});
			if (!response.ok) {
				const errorData = await response.json();
				// Display error more gracefully instead of alert
				errorMessage = `İşlem başarısız: ${errorData.error || 'Bilinmeyen Hata'}`;
				// Don't invalidate if there was an error, let the user see the message
				return;
			}
			await invalidateAll(); // Refresh data on success
		} catch (error: any) {
			errorMessage = `Bir hata oluştu: ${error.message || 'Sunucu hatası'}`;
		} finally {
			loadingAction = null; // Clear loading state
		}
	}
</script>

<h1 class="text-2xl font-bold tracking-tight mb-6">Onay Bekleyen Para Çekme Talepleri</h1>

{#if data.error}
	<div class="bg-danger/10 text-danger p-4 rounded-lg mb-6">
		<p>Hata: {data.error}</p>
	</div>
{/if}

{#if errorMessage}
	<div class="bg-danger/10 text-danger p-4 rounded-lg mb-6">
		<p>{errorMessage}</p>
	</div>
{/if}

{#if data.requests && data.requests.length > 0}
	<div class="overflow-x-auto bg-surface-light dark:bg-surface-dark rounded-lg shadow">
		<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-700">
				<tr>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"
					>
						Kullanıcı
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"
					>
						Banka Adı
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"
					>
						IBAN
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"
					>
						Tutar
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"
					>
						Talep Tarihi
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"
					>
						İşlemler
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each data.requests as req (req.id)}
					<tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark"
						>
							{req.username ?? '-'}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">
							{req.withdrawal_bank_name ?? '-'}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">
							{req.target_iban ?? '-'}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
							{req.amount.toFixed(2)} TL
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">
							{new Date(req.created_at).toLocaleString()}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
							<button
								on:click={() => handleAction(req.id, 'approve')}
								disabled={!!loadingAction}
								class="px-3 py-1 text-xs font-semibold rounded-md text-white bg-success hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loadingAction === `approve-${req.id}` ? '...' : 'Onayla'}
							</button>
							<button
								on:click={() => handleAction(req.id, 'reject')}
								disabled={!!loadingAction}
								class="px-3 py-1 text-xs font-semibold rounded-md text-white bg-danger hover:bg-danger/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loadingAction === `reject-${req.id}` ? '...' : 'Reddet'}
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else if !data.error && !(data.requests && data.requests.length > 0)}
	<div class="text-center py-10 bg-surface-light dark:bg-surface-dark rounded-xl shadow">
		<p class="text-subtle-light dark:text-subtle-dark">Onay bekleyen para çekme talebi bulunmuyor.</p>
	</div>
{/if}

<style>
	/* Tailwind sınıfları kullanıldığı için buraya ek stil yazmaya genellikle gerek yoktur. */
	/* Özel durumlar için gerekirse buraya eklenebilir. */
</style>