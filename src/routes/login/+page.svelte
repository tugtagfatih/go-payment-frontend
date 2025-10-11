<script lang="ts">
	import { goto } from '$app/navigation';
	import { login } from '$lib/authStore';

	let email = '';
	let password = '';
	let errorMessage = '';

	async function handleLogin() {
		errorMessage = ''; // Hata mesajını temizle
		try {
			const response = await fetch('https://8080-firebase-go-odeme-bildirimi-1759869459857.cluster-yy7ncoxb5zd4ouvntrhoc3go3k.cloudworkstations.dev/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Login failed');
			}

			const data = await response.json();
			const token = data.token;

			if (token) {
				login(token); // Auth store'daki login fonksiyonunu çağır
				goto('/'); // Kullanıcıyı ana sayfaya yönlendir
			}
		} catch (error: any) {
			errorMessage = error.message;
		}
	}
</script>

<div class="login-container">
	<form class="login-form" on:submit|preventDefault={handleLogin}>
		<h2>Giriş Yap</h2>
		<div class="form-group">
			<label for="email">E-posta</label>
			<input type="email" id="email" bind:value={email} required />
		</div>
		<div class="form-group">
			<label for="password">Şifre</label>
			<input type="password" id="password" bind:value={password} required />
		</div>
		
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}

		<button type="submit">Giriş Yap</button>
	</form>
</div>

<style>
/* ... (Stil kodları buraya eklenebilir, bir önceki mesajdaki gibi) ... */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 5rem;
}
.login-form {
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
/* ... */
</style>