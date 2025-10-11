<script lang="ts">
	import { goto } from '$app/navigation';
	import { API_BASE_URL } from '$lib/constants';

	let username = '';
	let email = '';
	let password = '';
	let errorMessage = '';
	let successMessage = '';
	let isLoading = false;

	async function handleRegister() {
		isLoading = true;
		errorMessage = '';
		successMessage = '';

		try {
			const response = await fetch(`${API_BASE_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, email, password })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Kayıt işlemi başarısız oldu.');
			}

			successMessage = 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...';
			
			// Başarılı kayıt sonrası 2 saniye bekleyip giriş sayfasına yönlendir
			setTimeout(() => {
				goto('/login');
			}, 2000);

		} catch (error: any) {
			errorMessage = error.message;
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="container">
	<form class="form" on:submit|preventDefault={handleRegister}>
		<h2>Kayıt Ol</h2>
		
		<div class="form-group">
			<label for="username">Kullanıcı Adı</label>
			<input type="text" id="username" bind:value={username} required />
		</div>
		
		<div class="form-group">
			<label for="email">E-posta</label>
			<input type="email" id="email" bind:value={email} required />
		</div>

		<div class="form-group">
			<label for="password">Şifre (en az 6 karakter)</label>
			<input type="password" id="password" bind:value={password} minlength="6" required />
		</div>

		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}

		{#if successMessage}
			<p class="success">{successMessage}</p>
		{/if}

		<button type="submit" disabled={isLoading}>
			{#if isLoading}
				Kayıt Olunuyor...
			{:else}
				Kayıt Ol
			{/if}
		</button>
	</form>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 5rem;
	}
	.form {
		width: 100%;
		max-width: 400px;
		padding: 2rem;
		background: #fff;
		box-shadow: 0 4px 12px rgba(0,0,0,0.1);
		border-radius: 8px;
	}
	.form-group {
		margin-bottom: 1.5rem;
	}
    /* Diğer stil tanımlamaları (input, label, button vb.) login sayfasından kopyalanabilir. */
	.error {
		color: #d32f2f;
		margin-bottom: 1rem;
	}
	.success {
		color: #388e3c;
		margin-bottom: 1rem;
	}
</style>