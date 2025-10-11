<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/authStore';
	import { apiFetch } from '$lib/api'; // Yeni apiFetch fonksiyonumuzu import ediyoruz
	import { get } from 'svelte/store';

	// Bu sayfa sadece giriş yapmış kullanıcılar için.
	// Sayfa yüklendiğinde (onMount) kullanıcının giriş durumunu kontrol ediyoruz.
	onMount(() => {
		if (!get(authStore).isAuthenticated) {
			goto('/login'); // Eğer giriş yapmamışsa, login sayfasına yönlendir.
		}
	});

	let itemName = '';
	let description = '';
	let price: number | null = null;
	let errorMessage = '';
	let successMessage = '';

	async function handleCreateListing() {
		errorMessage = '';
		successMessage = '';

		try {
			// Korumalı endpoint'e istek atmak için apiFetch kullanıyoruz.
			const response = await apiFetch('/api/listings', {
				method: 'POST',
				body: JSON.stringify({
					item_name: itemName,
					description: description,
					price: price
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Listing could not be created.');
			}
			
			successMessage = "İlan başarıyla oluşturuldu! Ana sayfaya yönlendiriliyorsunuz...";
			
			// Formu temizle
			itemName = '';
			description = '';
			price = null;
			
			// 2 saniye sonra ana sayfaya yönlendir.
			setTimeout(() => {
				goto('/');
			}, 2000);

		} catch (error: any) {
			errorMessage = error.message;
		}
	}
</script>

<div class="form-container">
	<form class="form" on:submit|preventDefault={handleCreateListing}>
		<h2>Yeni İlan Oluştur</h2>
		
		<div class="form-group">
			<label for="itemName">İlan Başlığı</label>
			<input type="text" id="itemName" bind:value={itemName} required />
		</div>
		
		<div class="form-group">
			<label for="description">Açıklama</label>
			<textarea id="description" rows="4" bind:value={description}></textarea>
		</div>

		<div class="form-group">
			<label for="price">Fiyat (TL)</label>
			<input type="number" step="0.01" id="price" bind:value={price} required />
		</div>

		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}

		{#if successMessage}
			<p class="success">{successMessage}</p>
		{/if}

		<button type="submit">İlanı Yayınla</button>
	</form>
</div>

<style>
	.form-container { display: flex; justify-content: center; padding-top: 3rem; }
	.form { width: 100%; max-width: 500px; padding: 2rem; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px; }
	/* ... Diğer stil kodları ... */
	.error { color: red; }
	.success { color: green; }
</style>