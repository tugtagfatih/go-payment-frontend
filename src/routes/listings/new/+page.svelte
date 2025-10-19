<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/authStore';
	import { apiFetch } from '$lib/api';
	import { get } from 'svelte/store';
	// Giriş yapmamış kullanıcıları login sayfasına yönlendir
	onMount(() => {
		if (!get(authStore).isAuthenticated) {
			goto('/login');
		}
	});

	let itemName = '';
	let description = '';
	let price: number | null = null;
	let errorMessage = '';
	let successMessage = '';
    let isLoading = false;
	// Yükleme durumu

	async function handleCreateListing() {
        isLoading = true;
		errorMessage = '';
		successMessage = '';

		try {
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
				throw new Error(errorData.error || 'İlan oluşturulamadı.');
			}

			successMessage = "İlan başarıyla oluşturuldu! Ana sayfaya yönlendiriliyorsunuz...";
			itemName = '';
			description = '';
			price = null;
			setTimeout(() => {
				goto('/');
			}, 2000);

		} catch (error: any) {
			errorMessage = error.message;
		} finally {
            isLoading = false;
		}
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen px-4 py-8">
	<div class="w-full max-w-lg p-8 space-y-8 bg-white dark:bg-surface-dark rounded-xl shadow-lg">
		<div class="text-center">
			<h2 class="text-2xl font-bold text-gray-800 dark:text-white">Yeni İlan Oluştur</h2>
			<p class="text-gray-600 dark:text-gray-400 mt-2">Satmak istediğiniz ürünün bilgilerini girin</p>
		</div>

		<form on:submit|preventDefault={handleCreateListing} class="mt-8 space-y-6">
			<div class="rounded-lg space-y-4">
				<div>
					<label for="itemName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">İlan Başlığı</label>
					<input
						bind:value={itemName}
						type="text"
						required
						class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
						id="itemName"
						placeholder="Örn: Vintage Deri Ceket"
					/>
				</div>
				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama</label>
					<textarea
						bind:value={description}
						id="description"
						rows="4"
						class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
						placeholder="Ürünün durumu, özellikleri vb.
hakkında bilgi verin"
                    ></textarea>
				</div>
                <div>
					<label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fiyat (TL)</label>
					<input
						bind:value={price}
						type="number"
                        step="0.01"
						required
						class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
						id="price"
						placeholder="Örn: 450.00"
					/>
				</div>
			</div>

			{#if errorMessage}
				<p class="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
			{/if}
			{#if successMessage}
				<p class="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
			{/if}

			<div>
				<button
					type="submit"
					class="group relative w-full 
flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
					disabled={isLoading}
				>
					{isLoading ?
'Yayınlanıyor...' : 'İlanı Yayınla'}
				</button>
			</div>
		</form>
	</div>
</div>