<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiFetch } from '$lib/api';

	let amount: number | null = null;
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';

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

<main>
	<div class="form-container">
		<form class="form" on:submit|preventDefault={handleWithdrawalRequest}>
			<h2>Para Çekme Talebi Oluştur</h2>
			<p>
                Çekmek istediğiniz tutarı giriniz. Talebinizin işleme alınabilmesi için <a href="/profile">profil sayfanızda</a> IBAN bilginizin kayıtlı olması gerekmektedir.
            </p>
			
			<div class="form-group">
				<label for="amount">Çekilecek Tutar (TL)</label>
				<input type="number" step="0.01" id="amount" bind:value={amount} required placeholder="Örn: 150.00" />
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
					Para Çekme Talebi Gönder
				{/if}
			</button>
		</form>
	</div>
</main>

<style>
	/* Stil kodları deposit sayfasındakine benzer olabilir */
	main {
		display: flex;
		justify-content: center;
		padding-top: 3rem;
	}
	.form-container {
		width: 100%;
		max-width: 500px;
	}
	.form {
		padding: 2rem;
		background: #fff;
		box-shadow: 0 4px 12px rgba(0,0,0,0.1);
		border-radius: 8px;
	}
    .form p {
        margin-bottom: 1.5rem;
        line-height: 1.5;
    }
	.form-group {
		margin-bottom: 1.5rem;
	}
	.error { color: #d32f2f; }
	.success { color: #388e3c; }
</style>