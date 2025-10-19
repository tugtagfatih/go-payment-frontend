<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/authStore';
	import { apiFetch } from '$lib/api';
	import { get } from 'svelte/store';

	onMount(() => {
		if (!get(authStore).isAuthenticated) {
			goto('/login');
		}
	});

	let amount: number | null = null;
	let notes = '';
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';

	async function handleSubmitNotification() {
		// ... (fonksiyon içeriği aynı kalır) ...
		isLoading = true; //
		errorMessage = ''; //
		successMessage = ''; //
		try { //
			const response = await apiFetch('/api/wallet/notifications', { //
				method: 'POST', //
				body: JSON.stringify({ amount, notes }) //
			}); //

			if (!response.ok) { //
				const errorData = await response.json(); //
				throw new Error(errorData.error || 'Bildirim oluşturulamadı.'); //
			} //

			successMessage = 'Ödeme bildiriminiz alındı. Admin onayı sonrası bakiyenize yansıyacaktır.'; //
			amount = null; //
			notes = ''; //
		} catch (error: any) { //
			errorMessage = error.message; //
		} finally { //
			isLoading = false; //
		} //
	}
</script>

<svelte:head>
	<title>Ödeme Bildirimi - GoPay</title>
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-screen px-4 py-8">
	<div class="w-full max-w-lg p-8 space-y-8 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg">
		<div class="text-center">
			<h2 class="text-2xl font-bold text-text-light dark:text-text-dark">Ödeme Bildirimi Yap</h2>
			<p class="text-subtle-light dark:text-subtle-dark mt-2">
				Banka havalesi/EFT ile yaptığınız ödemeyi bu form aracılığıyla bildirebilirsiniz.
			</p>
		</div>

		<form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmitNotification}>
			<div class="rounded-lg space-y-4">
				<div>
					<label for="amount" class="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
						Yatırdığınız Tutar (TL)
					</label>
					<input
						type="number"
						step="0.01"
						id="amount"
						bind:value={amount}
						required
						placeholder="Örn: 250.00"
						class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
					/>
				</div>

				<div>
					<label for="notes" class="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
						Açıklama (İsteğe Bağlı)
					</label>
					<textarea
						id="notes"
						rows="3"
						bind:value={notes}
						placeholder="Örn: Ziraat Bankası hesabımdan gönderdim."
						class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
					></textarea>
				</div>
			</div>

			{#if errorMessage}
				<p class="text-sm text-danger dark:text-danger/90">{errorMessage}</p>
			{/if}
			{#if successMessage}
				<p class="text-sm text-success dark:text-success/90">{successMessage}</p>
			{/if}

			<div>
				<button
					type="submit"
					class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
					disabled={isLoading}
				>
					{#if isLoading}
						Gönderiliyor...
					{:else}
						Bildirimi Gönder
					{/if}
				</button>
			</div>
		</form>
         <div class="mt-4 text-center text-sm">
            <a href="/wallet" class="font-medium text-primary hover:text-primary/90">
                ← Cüzdana Geri Dön
            </a>
        </div>
	</div>
</div>