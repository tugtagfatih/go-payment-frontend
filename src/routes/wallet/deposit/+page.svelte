<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/authStore';
	import { apiFetch } from '$lib/api';
	import { get } from 'svelte/store';
	import { API_BASE_URL } from '$lib/constants'; // API_BASE_URL import edildi

	// Gerekli tipleri tanımlayalım
	interface ActiveBank {
		id: string;
		bank_name: string;
		iban: string | null;
		account_holder_name: string | null;
	}

	let activeBanks: ActiveBank[] = [];
	let selectedBank: ActiveBank | null = null;
	let amount: number | null = null;
	let senderName: string = ''; // Yeni alan: Ad Soyad
	let notes: string = ''; // Boş string olabilir
	let isLoading = false;
	let isLoadingBanks = true; // Bankaları yükleme durumu
	let errorMessage = '';
	let successMessage = '';
	let bankLoadError = ''; // Banka yükleme hatası

	onMount(async () => {
		if (!get(authStore).isAuthenticated) {
			goto('/login');
			return; // Giriş yapmamışsa bankaları yüklemeye çalışma
		}

		// Aktif bankaları yükle
		try {
			// Public endpoint'e istek atılıyor
			const response = await fetch(`${API_BASE_URL}/deposit-banks`);
			if (!response.ok) {
				throw new Error('Aktif banka bilgileri alınamadı.');
			}
			activeBanks = await response.json();
			// IBAN'ı olmayan veya null olan bankaları filtrele
			activeBanks = activeBanks.filter((bank) => bank.iban && bank.iban.trim() !== '');
		} catch (error: any) {
			bankLoadError = error.message;
		} finally {
			isLoadingBanks = false;
		}
	});

	function handleBankSelection(event: Event) {
		const target = event.target as HTMLSelectElement;
		const bankId = target.value;
		selectedBank = activeBanks.find((b) => b.id === bankId) || null;
		errorMessage = ''; // Banka değiştiğinde hatayı temizle
	}

	async function handleSubmitNotification() {
		if (!selectedBank) {
			errorMessage = 'Lütfen para yatırdığınız bankayı seçin.';
			return;
		}
		if (!senderName.trim()) {
			errorMessage = 'Lütfen adınızı ve soyadınızı girin.';
			return;
		}

		isLoading = true;
		errorMessage = '';
		successMessage = '';

		try {
			const response = await apiFetch('/api/wallet/notifications', {
				method: 'POST',
				body: JSON.stringify({
					amount,
					notes: notes || null, // Boş ise null gönder
					deposit_bank_id: selectedBank.id,
					sender_name: senderName.trim()
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Bildirim oluşturulamadı.');
			}

			successMessage = 'Ödeme bildiriminiz alındı. Admin onayı sonrası bakiyenize yansıyacaktır.';
			amount = null;
			notes = '';
			senderName = '';
			selectedBank = null;
			// Selectbox'ı sıfırla
			const selectElement = document.getElementById('bank-select') as HTMLSelectElement;
			if (selectElement) selectElement.value = '';
		} catch (error: any) {
			errorMessage = error.message;
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Para Yükle - GoPay</title>
</svelte:head>

<main class="flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
	<div class="w-full max-w-lg space-y-8">
		<div class="text-center">
			<h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">Para Yükle</h2>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
				Banka havalesi/EFT ile yaptığınız ödemeyi bildirin.
			</p>
		</div>

		<form
			class="mt-8 space-y-6 bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-md"
			on:submit|preventDefault={handleSubmitNotification}
		>
			{#if isLoadingBanks}
				<p class="text-center text-subtle-light dark:text-subtle-dark">Bankalar yükleniyor...</p>
			{:else if bankLoadError}
				<p class="error text-center p-4 bg-danger/10 rounded-md">
					Bankalar yüklenirken hata oluştu: {bankLoadError}
				</p>
			{:else if activeBanks.length === 0}
				<p class="warning text-center p-4 bg-warning/10 rounded-md">
					Şu anda para yatırabileceğiniz aktif bir banka hesabı bulunmamaktadır.
				</p>
			{:else}
				<div class="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
					<div>
						<label for="bank-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>Hangi Bankaya Para Yatırdınız?</label
						>
						<select
							id="bank-select"
							on:change={handleBankSelection}
							required
							class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
						>
							<option value="" disabled selected={!selectedBank}>-- Banka Seçin --</option>
							{#each activeBanks as bank (bank.id)}
								<option value={bank.id}>{bank.bank_name}</option>
							{/each}
						</select>
					</div>

					{#if selectedBank}
						<div class="iban-info bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border border-primary/20">
							<p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Lütfen aşağıdaki hesaba havale/EFT yapın:
							</p>
							<p class="text-sm">
								<strong>Banka:</strong>
								{selectedBank.bank_name}
							</p>
							<p class="text-sm">
								<strong>Alıcı Adı:</strong>
								{selectedBank.account_holder_name ?? 'Belirtilmemiş'}
							</p>
							<p class="text-sm flex items-center gap-2">
								<strong>IBAN:</strong>
								<span class="iban font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded"
									>{selectedBank.iban}</span
								>
								<button
									type="button"
									on:click={() => navigator.clipboard.writeText(selectedBank?.iban ?? '')}
									class="text-xs text-primary hover:underline focus:outline-none"
									title="IBAN'ı Kopyala"
								>
									Kopyala
								</button>
							</p>
						</div>

						<div>
							<label for="senderName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
								>Adınız Soyadınız (Dekonttaki Gibi)</label
							>
							<input
								type="text"
								id="senderName"
								bind:value={senderName}
								required
								placeholder="Ad Soyad"
								class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
							/>
						</div>

						<div>
							<label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
								>Yatırdığınız Tutar (TL)</label
							>
							<input
								type="number"
								step="0.01"
								min="0.01"
								id="amount"
								bind:value={amount}
								required
								placeholder="Örn: 250.00"
								class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
							/>
						</div>

						<div>
							<label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
								>Açıklama (İsteğe Bağlı)</label
							>
							<textarea
								id="notes"
								rows="3"
								bind:value={notes}
								placeholder="Örn: Sipariş no, ek bilgi vb."
								class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm resize-vertical"
							/>
						</div>
					{:else}
						<p class="text-center text-sm text-subtle-light dark:text-subtle-dark py-4">
							Lütfen yukarıdan bir banka seçerek devam edin.
						</p>
					{/if}
				</div>

				{#if errorMessage}
					<p class="error text-sm text-red-600 dark:text-red-400 mt-2">{errorMessage}</p>
				{/if}
				{#if successMessage}
					<p class="success text-sm text-green-600 dark:text-green-400 mt-2">{successMessage}</p>
				{/if}

				{#if selectedBank}
					<div>
						<button
							type="submit"
							disabled={isLoading || !selectedBank}
							class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{#if isLoading}
								Gönderiliyor...
							{:else}
								Bildirimi Gönder
							{/if}
						</button>
					</div>
				{/if}
			{/if}
		</form>
	</div>
</main>

<style>
	/* Tailwind sınıfları kullanıldığı için stil bloğu genellikle boş kalır */
	.iban {
		user-select: all; /* IBAN'ın kolayca seçilip kopyalanmasını sağlar */
	}
	/* Responsive tasarım için Tailwind sınıfları yeterli olmalı */
</style>