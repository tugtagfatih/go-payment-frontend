<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/authStore';
	import { apiFetch } from '$lib/api';
	import { get } from 'svelte/store';

	// Bu sayfa sadece giriş yapmış kullanıcılar içindir.
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
		isLoading = true;
		errorMessage = '';
		successMessage = '';

		try {
			const response = await apiFetch('/api/wallet/notifications', {
				method: 'POST',
				body: JSON.stringify({ amount, notes })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Bildirim oluşturulamadı.');
			}

			successMessage = 'Ödeme bildiriminiz alındı. Admin onayı sonrası bakiyenize yansıyacaktır.';
			amount = null;
			notes = '';
		} catch (error: any) {
			errorMessage = error.message;
		} finally {
			isLoading = false;
		}
	}
</script>

<main>
	<div class="form-container">
		<form class="form" on:submit|preventDefault={handleSubmitNotification}>
			<h2>Ödeme Bildirimi Yap</h2>
			<p>Banka havalesi/EFT ile yaptığınız ödemeyi bu form aracılığıyla bildirebilirsiniz.</p>
			
			<div class="form-group">
				<label for="amount">Yatırdığınız Tutar (TL)</label>
				<input type="number" step="0.01" id="amount" bind:value={amount} required placeholder="Örn: 250.00" />
			</div>
			
			<div class="form-group">
				<label for="notes">Açıklama (İsteğe Bağlı)</label>
				<textarea id="notes" rows="3" bind:value={notes} placeholder="Örn: Ziraat Bankası hesabımdan gönderdim."></textarea>
			</div>

			{#if errorMessage}
				<p class="error">{errorMessage}</p>
			{/if}
			{#if successMessage}
				<p class="success">{successMessage}</p>
			{/if}

			<button type="submit" disabled={isLoading}>
				{#if isLoading}
					Gönderiliyor...
				{:else}
					Bildirimi Gönder
				{/if}
			</button>
		</form>
	</div>
</main>

<style>
	/* ... (Form stilleri önceki mesajlardan alınabilir) ... */
</style>