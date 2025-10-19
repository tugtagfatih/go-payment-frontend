<script lang="ts">
	import type { PageData } from './$types';
	import { apiFetch } from '$lib/api';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;
	let loadingAction: string | null = null;

	async function handleAction(requestId: string, action: 'approve' | 'reject') {
		// ... (fonksiyon içeriği notifications sayfasıyla aynı) ...
		loadingAction = `${action}-${requestId}`; //
		try { //
			const response = await apiFetch(`/admin/withdrawals/${requestId}/${action}`, { method: 'POST' }); //
			if (!response.ok) { //
				const errorData = await response.json(); //
				alert(`İşlem başarısız: ${errorData.error}`); //
			} //
		} catch (error) { //
			alert('Bir hata oluştu.'); //
		} finally { //
			loadingAction = null; //
			invalidateAll(); //
		} //
	}
</script>

<svelte:head>
	<title>Para Çekme Talepleri - Admin</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">Onay Bekleyen Para Çekme Talepleri</h1>

{#if data.error}
	<div class="bg-danger/10 text-danger p-4 rounded-lg mb-6">
		<p>Talepler yüklenirken bir hata oluştu: {data.error}</p>
	</div>
{/if}

{#if data.requests && data.requests.length > 0}
	<div class="overflow-x-auto bg-surface-light dark:bg-surface-dark rounded-lg shadow">
		<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-700">
				<tr>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Kullanıcı </th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Tutar </th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> IBAN </th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Talep Tarihi </th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> İşlemler </th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each data.requests as req (req.id)}
					<tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">{req.username}</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{req.amount.toFixed(2)} TL</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">{req.target_iban}</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">{new Date(req.created_at).toLocaleString()}</td>
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
{:else if !data.error}
	<div class="text-center py-10 bg-surface-light dark:bg-surface-dark rounded-xl shadow">
		<p class="text-subtle-light dark:text-subtle-dark">Onay bekleyen para çekme talebi bulunmuyor.</p>
	</div>
{/if}