<script lang="ts">
	import type { PageData } from './$types';
	import { apiFetch } from '$lib/api';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;
	let loadingAction: string | null = null;
	let errorMessage = ''; // Hata mesajı state'i

	async function handleAction(notificationId: string, action: 'approve' | 'reject') {
		loadingAction = `${action}-${notificationId}`;
		errorMessage = '';
		try {
			const response = await apiFetch(`/admin/notifications/${notificationId}/${action}`, {
				method: 'POST'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'İşlem başarısız oldu.');
			}
			await invalidateAll(); // Başarı durumunda veriyi yenile
		} catch (error: any) {
			errorMessage = error.message;
		} finally {
			loadingAction = null;
		}
	}
</script>

<h1 class="text-2xl font-bold tracking-tight mb-6 text-text-light dark:text-text-dark">
	Onay Bekleyen Ödeme Bildirimleri
</h1>

{#if errorMessage}
	<div class="bg-danger/10 text-danger p-4 rounded-lg mb-6">
		<p>{errorMessage}</p>
	</div>
{/if}

{#if data.notifications && data.notifications.length > 0}
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
						Gönderen Adı
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"
					>
						Banka
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
						Notlar
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"
					>
						Tarih
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
				{#each data.notifications as notif (notif.id)}
					<tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark"
						>
							{notif.username ?? '-'}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">
							{notif.sender_name ?? '-'}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">
							{notif.deposit_bank_name ?? '-'}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
							{notif.amount.toFixed(2)} TL
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">
							{notif.notes ?? '-'}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">
							{new Date(notif.created_at).toLocaleString()}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
							<button
								on:click={() => handleAction(notif.id, 'approve')}
								disabled={!!loadingAction}
								class="px-3 py-1 text-xs font-semibold rounded-md text-white bg-success hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loadingAction === `approve-${notif.id}` ? '...' : 'Onayla'}
							</button>
							<button
								on:click={() => handleAction(notif.id, 'reject')}
								disabled={!!loadingAction}
								class="px-3 py-1 text-xs font-semibold rounded-md text-white bg-danger hover:bg-danger/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loadingAction === `reject-${notif.id}` ? '...' : 'Reddet'}
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<div class="text-center py-10 bg-surface-light dark:bg-surface-dark rounded-xl shadow">
		<p class="text-subtle-light dark:text-subtle-dark">Onay bekleyen bildirim bulunmuyor.</p>
	</div>
{/if}

<style>
	/* Tailwind sınıfları stillendirmeyi yaptığı için ek CSS'e gerek kalmadı */
</style>
