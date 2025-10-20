<script lang="ts">
	import type { PageData } from './$types';
	import { apiFetch } from '$lib/api';
	import { onMount } from 'svelte';
	export let data: PageData;

	// Banka listesi (veritabanına eklemeye gerek yok, frontend'de tutabiliriz)
	const withdrawalBankNames = [
		'T.C. Ziraat Bankası A.Ş.', 'Türkiye Halk Bankası A.Ş.', 'Türkiye Vakıflar Bankası T.A.O.',
		'Türkiye İş Bankası A.Ş.', 'Akbank T.A.Ş.', 'Yapı ve Kredi Bankası A.Ş.',
		'Türkiye Garanti Bankası A.Ş.', 'QNB Finansbank A.Ş.', 'Denizbank A.Ş.',
		'Türk Ekonomi Bankası A.Ş.', 'ING Bank A.Ş.', 'HSBC Bank A.Ş.', 'Odea Bank A.Ş.',
		'Alternatifbank A.Ş.', 'Fibabanka A.Ş.', 'Şekerbank T.A.Ş.', 'Anadolubank A.Ş.',
		'Burgan Bank A.Ş.', 'Citibank A.Ş.', 'ICBC Turkey Bank A.Ş.', 'Arap Türk Bankası A.Ş.',
		'MUFG Bank Turkey A.Ş.', 'Turkish Bank A.Ş.', 'Turkland Bank A.Ş.', 'Bank of China Turkey A.Ş.',
		'Albaraka Türk Katılım Bankası A.Ş.', 'Kuveyt Türk Katılım Bankası A.Ş.', 'Türkiye Finans Katılım Bankası A.Ş.',
		'Ziraat Katılım Bankası A.Ş.', 'Vakıf Katılım Bankası A.Ş.', 'Türkiye Emlak Katılım Bankası A.Ş.',
		'Hayat Finans Katılım Bankası A.Ş.', 'Dünya Katılım Bankası A.Ş.', 'Aktif Yatırım Bankası A.Ş.',
		'Türkiye Sınai Kalkınma Bankası A.Ş.', 'Türkiye Kalkınma ve Yatırım Bankası A.Ş.',
		'İller Bankası A.Ş.', 'Türk Eximbank', 'Pasha Yatırım Bankası A.Ş.', 'GSD Yatırım Bankası A.Ş.'
	].sort(); // Alfabetik sıralama

	// Banka Bilgileri Formu için değişkenler
	let iban: string = '';
	let selectedWithdrawalBank: string = '';
	let bankInfoLoading = false;
	let bankInfoError = '';
	let bankInfoSuccess = '';

	// Şifre Değiştirme Formu için değişkenler
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let passwordLoading = false;
	let passwordError = '';
	let passwordSuccess = '';

	// Sayfa yüklendiğinde, `data.profile`'dan gelen bilgileri form alanlarına ata
	onMount(() => {
		if (data.profile) {
			iban = data.profile.iban ?? '';
            selectedWithdrawalBank = data.profile.withdrawal_bank_name ?? '';
		}
	});

	async function handleUpdateBankInfo() {
		bankInfoLoading = true;
		bankInfoError = '';
		bankInfoSuccess = '';
		try {
			const response = await apiFetch('/api/profile/bank-info', {
				method: 'PUT',
				body: JSON.stringify({
					iban: iban.trim() || null, // Boş ise null gönder
					withdrawal_bank_name: selectedWithdrawalBank || null // Boş ise null gönder
				})
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Banka bilgileri güncellenemedi.');
			}
			bankInfoSuccess = 'Banka bilgileriniz başarıyla güncellendi.';
		} catch (error: any) {
			bankInfoError = error.message;
		} finally {
			bankInfoLoading = false;
		}
	}

	async function handleChangePassword() {
		if (newPassword !== confirmPassword) {
			passwordError = 'Yeni şifreler uyuşmuyor.';
			return;
		}
		passwordLoading = true;
		passwordError = '';
		passwordSuccess = '';
		try {
			const response = await apiFetch('/api/profile/change-password', {
				method: 'PUT',
				body: JSON.stringify({
					current_password: currentPassword,
					new_password: newPassword
				})
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Şifre güncellenemedi.');
			}
			passwordSuccess = 'Şifreniz başarıyla güncellendi.';
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
		} catch (error: any) {
			passwordError = error.message;
		} finally {
			passwordLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Profilim - GoPay</title>
</svelte:head>

<main class="container mx-auto p-4 md:p-8">
	<h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Profilim</h1>

	{#if data.error}
		<p class="error">{data.error}</p>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Banka Bilgileri Formu -->
			<div class="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-md">
				<h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Banka Bilgileri</h2>
				<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
					Para çekme işlemlerinde kullanılacak banka hesabınızı buradan güncelleyebilirsiniz.
				</p>
				<form on:submit|preventDefault={handleUpdateBankInfo} class="space-y-6">
					<div>
						<label for="withdrawal-bank" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Banka Adı
						</label>
						<select id="withdrawal-bank" bind:value={selectedWithdrawalBank} class="input mt-1">
							<option value="">-- Banka Seçin --</option>
							{#each withdrawalBankNames as bankName}
								<option value={bankName}>{bankName}</option>
							{/each}
						</select>
					</div>
					<div>
						<label for="iban" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							IBAN
						</label>
						<input type="text" id="iban" bind:value={iban} class="input mt-1" placeholder="TR..." />
						<small class="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
							Para çekme talebi oluşturmak için zorunludur.
						</small>
					</div>

					{#if bankInfoSuccess}
						<p class="success text-sm text-green-600">{bankInfoSuccess}</p>
					{/if}
					{#if bankInfoError}
						<p class="error text-sm text-red-600">{bankInfoError}</p>
					{/if}

					<button type="submit" disabled={bankInfoLoading} class="btn-primary w-full">
						{#if bankInfoLoading} Kaydediliyor... {:else} Banka Bilgilerini Güncelle {/if}
					</button>
				</form>
			</div>

			<!-- Şifre Değiştirme Formu -->
			<div class="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-md">
				<h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Şifre Değiştir</h2>
				<form on:submit|preventDefault={handleChangePassword} class="space-y-6">
					<div>
						<label for="current-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Mevcut Şifre
						</label>
						<input type="password" id="current-password" bind:value={currentPassword} class="input mt-1" required />
					</div>
					<div>
						<label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Yeni Şifre
						</label>
						<input type="password" id="new-password" bind:value={newPassword} class="input mt-1" minlength="6" required />
					</div>
					<div>
						<label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Yeni Şifre (Tekrar)
						</label>
						<input type="password" id="confirm-password" bind:value={confirmPassword} class="input mt-1" minlength="6" required />
					</div>
					
					{#if passwordSuccess}
						<p class="success text-sm text-green-600">{passwordSuccess}</p>
					{/if}
					{#if passwordError}
						<p class="error text-sm text-red-600">{passwordError}</p>
					{/if}

					<button type="submit" disabled={passwordLoading} class="btn-primary w-full">
						{#if passwordLoading} Güncelleniyor... {:else} Şifreyi Güncelle {/if}
					</button>
				</form>
			</div>
		</div>

		<!-- İşlem Geçmişi -->
		<div class="mt-12">
			<h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">İşlem Geçmişi</h2>
			<div class="bg-surface-light dark:bg-surface-dark p-4 sm:p-6 rounded-xl shadow-md overflow-x-auto">
				{#if data.transactionHistory && data.transactionHistory.length > 0}
					<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead class="bg-gray-50 dark:bg-gray-800">
							<tr>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tarih</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">İşlem Türü</th>
								<th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tutar</th>
							</tr>
						</thead>
						<tbody class="bg-white dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-700">
							{#each data.transactionHistory as tx (tx.id)}
								<tr>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(tx.created_at).toLocaleString()}</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 capitalize">{tx.type}</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium"
										class:text-green-600={tx.amount > 0}
										class:dark:text-green-400={tx.amount > 0}
										class:text-red-600={tx.amount < 0}
										class:dark:text-red-400={tx.amount < 0}
									>
										{tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} TL
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{:else}
					<p class="text-center py-4 text-gray-500 dark:text-gray-400">Henüz bir cüzdan hareketiniz bulunmuyor.</p>
				{/if}
			</div>
		</div>
	{/if}
</main>

<style>
	/* Tailwind'in @apply direktifi ile özel yardımcı sınıflar oluşturuyoruz */
	.input {
		@apply w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 
               focus:outline-none focus:ring-primary focus:border-primary 
               dark:bg-background-dark dark:border-gray-600 dark:text-white;
	}
	.btn-primary {
		@apply w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
               disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
	}
</style>

