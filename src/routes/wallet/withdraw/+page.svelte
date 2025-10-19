<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiFetch } from '$lib/api';
	import { onMount } from 'svelte'; // onMount eklendi
	import { authStore } from '$lib/authStore'; // authStore eklendi
	import { get } from 'svelte/store'; // get eklendi

	let amount: number | null = null;
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';

	// Giriş yapmamış kullanıcıları login sayfasına yönlendir
	onMount(() => {
		if (!get(authStore).isAuthenticated) {
			goto('/login');
		}
	});


	async function handleWithdrawalRequest() {
		isLoading = true;
		errorMessage = '';
		successMessage = '';

		try {
			const response = await apiFetch('/api/wallet/withdraw', {
				method: 'POST',
				body: JSON.stringify({ amount })
			});
			if (!response.ok) {
				const errorData = await response.json();
				// Backend'den gelen IBAN veya bakiye hatasını kullanıcıya gösteriyoruz.
				throw new Error(errorData.error || 'Para çekme talebi oluşturulamadı.');
			}

			successMessage = 'Para çekme talebiniz alındı. Admin onayı sonrası işleme alınacaktır.';
			amount = null; // Formu temizle
		} catch (error: any) {
			errorMessage = error.message;
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Para Çek - GoPay</title>
</svelte:head>

<main class="flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
	<div class="w-full max-w-lg space-y-8">
		<div class="text-center">
			<h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">Para Çekme Talebi</h2>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
				Çekmek istediğiniz tutarı girin.
			</p>
			<p class="mt-1 text-xs text-subtle-light dark:text-subtle-dark">
				Talebinizin işleme alınabilmesi için
				<a href="/profile" class="text-primary hover:underline font-medium">profil sayfanızda</a>
				IBAN bilginizin kayıtlı olması gerekmektedir.
			</p>
		</div>

		<form
			class="mt-8 space-y-6 bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-md"
			on:submit|preventDefault={handleWithdrawalRequest}
		>
			<div class="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
				<div>
					<label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>Çekilecek Tutar (TL)</label
					>
					<input
						type="number"
						step="0.01"
						min="0.01"
						id="amount"
						bind:value={amount}
						required
						placeholder="Örn: 150.00"
						class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
					/>
				</div>
			</div>

			{#if errorMessage}
				<p class="error text-sm text-red-600 dark:text-red-400 mt-2">{errorMessage}</p>
			{/if}
			{#if successMessage}
				<p class="success text-sm text-green-600 dark:text-green-400 mt-2">{successMessage}</p>
			{/if}

			<div>
				<button
					type="submit"
					disabled={isLoading}
					class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-warning hover:bg-warning/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isLoading}
						Gönderiliyor...
					{:else}
						Para Çekme Talebi Gönder
					{/if}
				</button>
			</div>
		</form>
	</div>
</main>

<style>
	/* Tailwind sınıfları kullanıldığı için stil bloğu genellikle boş kalır */
</style>