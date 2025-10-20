<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/authStore';
	import { apiFetch } from '$lib/api';
	import { get } from 'svelte/store';
	import { API_BASE_URL } from '$lib/constants';

	// Gerekli tipleri tanımlayalım
	interface ActiveBank {
		id: string;
		bank_name: string;
		iban: string | null;
		account_holder_name: string | null;
	}

	let activeBanks: ActiveBank[] = [];
	let selectedBankId: string | null = null; // Radyo butonu seçimi için ID tutacak
	let amount: number | null = null;
	let senderName: string = '';
	let notes: string = '';
	let isLoading = false;
	let isLoadingBanks = true;
	let errorMessage = '';
	let successMessage = '';
	let bankLoadError = '';

	// Svelte'in reaktif gücü: selectedBankId değiştiğinde, selectedBank otomatik olarak güncellenir.
	$: selectedBank = selectedBankId ? activeBanks.find((b) => b.id === selectedBankId) : null;

	onMount(async () => {
		if (!get(authStore).isAuthenticated) {
			goto('/login');
			return;
		}

		try {
			const response = await fetch(`${API_BASE_URL}/deposit-banks`);
			if (!response.ok) {
				throw new Error('Aktif banka bilgileri alınamadı.');
			}
			let banks: ActiveBank[] = await response.json();
			// Sadece IBAN'ı olan bankaları göster
			activeBanks = banks.filter((bank) => bank.iban && bank.iban.trim() !== '');
		} catch (error: any) {
			bankLoadError = error.message;
		} finally {
			isLoadingBanks = false;
		}
	});

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
					notes: notes || null,
					deposit_bank_id: selectedBank.id,
					sender_name: senderName.trim()
				})
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Bildirim oluşturulamadı.');
			}

			successMessage = `Ödeme bildiriminiz alındı. Admin onayı sonrası bakiyenize yansıyacaktır.`;
			// Formu sıfırla
			amount = null;
			notes = '';
			senderName = '';
			selectedBankId = null; // Sadece ID'yi sıfırlamak yeterli
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
				<div class="flex flex-col gap-4">
					<!-- Banka Seçim Alanı (Radyo Butonları ile Düzeltildi) -->
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Hangi Bankaya Para Yatırdınız?
						</label>
						<!-- Dikey sıralama için flex-col ve aralık için gap-3 -->
						<div class="flex flex-col gap-3">
							{#each activeBanks as bank (bank.id)}
								<label
									class="flex items-center p-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
								>
									<input
										type="radio"
										name="deposit_bank_id"
										value={bank.id}
										bind:group={selectedBankId}
										class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
									/>
									<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
										{bank.bank_name}
									</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Seçilen Bankanın IBAN Bilgisi -->
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
								<span class="iban font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">
									{selectedBank.iban}
								</span>
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

						<!-- Diğer Form Alanları -->
						<div>
							<label for="senderName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Adınız Soyadınız (Dekonttaki Gibi)
							</label>
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
							<label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Yatırdığınız Tutar (TL)
							</label>
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
							<label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Açıklama (İsteğe Bağlı)
							</label>
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
							disabled={isLoading}
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
	.iban {
		user-select: all; /* IBAN'ın kolayca seçilip kopyalanmasını sağlar */
	}
	/* Tailwind sınıfları kullanıldığı için başka özel stile gerek yok */
</style>
