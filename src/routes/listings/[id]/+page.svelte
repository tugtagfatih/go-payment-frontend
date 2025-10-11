<script lang="ts">
	import type { PageData } from './$types';
	import { authStore } from '$lib/authStore';
	import { apiFetch } from '$lib/api';
	import { goto } from '$app/navigation';

	export let data: PageData;

	// Buton durumunu ve mesajları yönetmek için yeni değişkenler
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';

	async function handlePurchase() {
		// --- 1. Kullanıcı Giriş Yapmış mı Kontrolü ---
		// $authStore diyerek store'un anlık değerini okuyoruz.
		if (!$authStore.isAuthenticated) {
			// Eğer giriş yapmamışsa, login sayfasına yönlendir.
			goto('/login');
			return;
		}
		if (!data.listing) {
        errorMessage = 'İlan verisi bulunamadı, sayfanızı yenileyin.';
        return;
    	}

		// --- 2. Satın Alma İşlemini Başlat ---
		isLoading = true; // Butonu devre dışı bırakmak için
		errorMessage = '';
		successMessage = '';

		try {
			// apiFetch ile korumalı 'buy' endpoint'ine POST isteği atıyoruz.
			// Bu isteğin bir body'si olmasına gerek yok, tüm bilgi URL ve token'da.
			const response = await apiFetch(`/api/listings/${data.listing.id}/buy`, {
				method: 'POST'
			});

			if (!response.ok) {
				// Eğer API hata dönerse (yetersiz bakiye vb.), hatayı yakala.
				const errorData = await response.json();
				throw new Error(errorData.error || 'Satın alma işlemi başarısız oldu.');
			}
			
			// İşlem başarılı!
			successMessage = 'Satın alma başarılı! Profil sayfanıza yönlendiriliyorsunuz...';

			// 2 saniye sonra kullanıcıyı profil sayfasına yönlendir.
			setTimeout(() => {
				goto('/profile'); // Henüz bu sayfayı yapmadık ama yönlendirmeyi ekleyelim.
			}, 2000);

		} catch (error: any) {
			errorMessage = error.message;
		} finally {
			// İşlem başarılı da olsa, başarısız da olsa butonu tekrar aktif et.
			isLoading = false;
		}
	}
</script>

<main>
	{#if data.listing}
		<div class="listing-detail">
			<h1>{data.listing.item_name}</h1>
			<p class="status">Durum: {data.listing.status}</p>
			
			<div class="description">
				<h3>Açıklama</h3>
				<p>{data.listing.description || 'Açıklama bulunmuyor.'}</p>
			</div>

			<div class="price-box">
				<span class="price">{data.listing.price} TL</span>
				
				{#if $authStore.isAuthenticated}
					<button on:click={handlePurchase} disabled={isLoading || data.listing.status !== 'active'}>
						{#if isLoading}
							İşleniyor...
						{:else if data.listing.status !== 'active'}
							Satıldı
						{:else}
							Satın Al
						{/if}
					</button>
				{:else}
					<a href="/login" class="login-button">Satın Almak İçin Giriş Yap</a>
				{/if}
			</div>

			{#if errorMessage}
				<p class="feedback error">{errorMessage}</p>
			{/if}
			{#if successMessage}
				<p class="feedback success">{successMessage}</p>
			{/if}

		</div>
	{:else if data.error}
		<h1 class="error">{data.error}</h1>
		<p>Aradığınız ilan bulunamadı veya kaldırılmış olabilir.</p>
	{/if}
</main>

<style>
	/* ... (Mevcut stiller aynı kalabilir) ... */
	.price-box button, .login-button {
		padding: 0.8rem 1.5rem;
		border: none;
		background-color: #1877f2;
		color: white;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s;
        text-decoration: none;
	}
	.price-box button:hover {
		background-color: #166fe5;
	}
	.price-box button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}
	.feedback {
		margin-top: 1rem;
		padding: 0.8rem;
		border-radius: 6px;
		text-align: center;
	}
	.error {
		color: #d32f2f;
		background-color: #ffcdd2;
	}
	.success {
		color: #388e3c;
		background-color: #c8e6c9;
	}
</style>