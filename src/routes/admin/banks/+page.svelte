<script lang="ts">
	import type { PageData } from './$types';
	import { apiFetch } from '$lib/api';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	let editingBankId: string | null = null;
	let editIban: string | null = null;
	let editAccountHolder: string | null = null;
	let isLoading = false;
	let errorMessage = '';

	function startEditing(bank: any) {
		editingBankId = bank.id;
		editIban = bank.iban ?? ''; // Null ise boş string ata
		editAccountHolder = bank.account_holder_name ?? ''; // Null ise boş string ata
		errorMessage = '';
	}

	function cancelEditing() {
		editingBankId = null;
		editIban = null;
		editAccountHolder = null;
		errorMessage = '';
	}

	async function handleSave(bankId: string) {
		isLoading = true;
		errorMessage = '';
		try {
			const response = await apiFetch(`/admin/banks/${bankId}`, {
				method: 'PUT',
				body: JSON.stringify({
					iban: editIban || null, // Boş string ise null gönder
					account_holder_name: editAccountHolder || null // Boş string ise null gönder
				})
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Banka bilgisi güncellenemedi.');
			}
			editingBankId = null; // Düzenleme modundan çık
			await invalidateAll(); // Listeyi yenile
		} catch (error: any) {
			errorMessage = error.message;
		} finally {
			isLoading = false;
		}
	}

	async function handleToggleStatus(bankId: string) {
		isLoading = true;
		try {
			await apiFetch(`/admin/banks/${bankId}/toggle`, { method: 'POST' });
			await invalidateAll(); // Listeyi yenile
		} catch (error) {
			alert('Durum güncellenirken hata oluştu.');
		} finally {
			isLoading = false;
		}
	}
</script>

<h1 class="text-2xl font-bold tracking-tight mb-6 text-text-light dark:text-text-dark">
	Banka Hesapları Yönetimi
</h1>

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

{#if data.banks && data.banks.length > 0}
	<div class="overflow-x-auto bg-surface-light dark:bg-surface-dark rounded-lg shadow">
		<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-700">
				<tr>
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
						Hesap Sahibi
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"
					>
						Durum
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
				{#each data.banks as bank (bank.id)}
					<tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark"
						>
							{bank.bank_name}
						</td>

						{#if editingBankId === bank.id}
							<td class="px-6 py-4 whitespace-nowrap">
								<input
									type="text"
									bind:value={editIban}
									placeholder="TR..."
									class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
								/>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<input
									type="text"
									bind:value={editAccountHolder}
									placeholder="Ad Soyad"
									class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
								/>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<span class:text-success={bank.is_active} class:text-danger={!bank.is_active}>
									{bank.is_active ? 'Aktif' : 'Pasif'}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
								<button
									on:click={() => handleSave(bank.id)}
									disabled={isLoading}
									class="px-3 py-1 text-xs font-semibold rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
								>
									{isLoading ? '...' : 'Kaydet'}
								</button>
								<button
									on:click={cancelEditing}
									disabled={isLoading}
									class="px-3 py-1 text-xs font-semibold rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50"
								>
									İptal
								</button>
							</td>
						{:else}
							<td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">
								{bank.iban ?? '-'}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">
								{bank.account_holder_name ?? '-'}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<span class:text-success={bank.is_active} class:text-danger={!bank.is_active}>
									{bank.is_active ? 'Aktif' : 'Pasif'}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
								<button
									on:click={() => startEditing(bank)}
									class="px-3 py-1 text-xs font-semibold rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
								>
									Düzenle
								</button>

								<button
									on:click={() => handleToggleStatus(bank.id)}
									disabled={isLoading}
									class="px-3 py-1 text-xs font-semibold rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50
                                    {bank.is_active
										? 'bg-danger hover:bg-danger/90 focus:ring-danger'
										: 'bg-success hover:bg-success/90 focus:ring-success'
									}"
								>
									{bank.is_active ? 'Pasif Yap' : 'Aktif Et'}
								</button>
								</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<div class="text-center py-10 bg-surface-light dark:bg-surface-dark rounded-xl shadow">
		<p class="text-subtle-light dark:text-subtle-dark">Yönetilecek banka hesabı bulunmuyor.</p>
	</div>
{/if}

<style>
	/* Tailwind sınıfları stillendirmeyi yaptığı için ek CSS'e gerek kalmadı */
</style>
