<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/authStore';
	import { apiFetch } from '$lib/api';
	import { get } from 'svelte/store';

	// Gerekli tipleri tanımlayalım
	interface ActiveBank {
		id: string;
		bank_name: string;
		iban: string | null;
        account_holder_name: string | null;
	}

	let activeBanks: ActiveBank[] = [];
	let selectedBank: ActiveBank | null = null;
	let amount: number | null = null;
	let senderName: string = ''; // Yeni alan: Ad Soyad
	let notes: string = ''; // Artık boş string olabilir
	let isLoading = false;
	let isLoadingBanks = true; // Bankaları yükleme durumu
	let errorMessage = '';
	let successMessage = '';
	let bankLoadError = ''; // Banka yükleme hatası

	onMount(async () => {
		if (!get(authStore).isAuthenticated) {
			goto('/login');
			return; // Giriş yapmamışsa bankaları yüklemeye çalışma
		}

		// Aktif bankaları yükle
		try {
			// DİKKAT: Bu istek public endpoint'e yapılıyor, apiFetch gerekmez
            // Eğer auth gerekiyorsa /api/deposit-banks gibi bir endpoint yapıp apiFetch kullanın
			const response = await fetch(`${get(authStore).API_BASE_URL || 'http://localhost:8080'}/deposit-banks`); // API_BASE_URL'i store'dan veya constants'dan alın
			if (!response.ok) {
				throw new Error('Aktif banka bilgileri alınamadı.');
			}
			activeBanks = await response.json();
            // IBAN'ı olmayan veya null olan bankaları filtrele
            activeBanks = activeBanks.filter(bank => bank.iban && bank.iban.trim() !== '');
		} catch (error: any) {
			bankLoadError = error.message;
		} finally {
			isLoadingBanks = false;
		}
	});

	function handleBankSelection(event: Event) {
		const target = event.target as HTMLSelectElement;
		const bankId = target.value;
		selectedBank = activeBanks.find(b => b.id === bankId) || null;
        errorMessage = ''; // Banka değiştiğinde hatayı temizle
	}

	async function handleSubmitNotification() {
		if (!selectedBank) {
			errorMessage = 'Lütfen para yatırdığınız bankayı seçin.';
			return;
		}
        if (!senderName.trim()) {
            errorMessage = 'Lütfen adınızı ve soyadınızı girin.';
            return;
        }

		isLoading = true;
		errorMessage = '';
		successMessage = '';

		try {
			const response = await apiFetch('/api/wallet/notifications', {
				method: 'POST',
				body: JSON.stringify({
                    amount,
                    notes: notes || null, // Boş ise null gönder
                    deposit_bank_id: selectedBank.id,
                    sender_name: senderName.trim()
                })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Bildirim oluşturulamadı.');
			}

			successMessage = 'Ödeme bildiriminiz alındı. Admin onayı sonrası bakiyenize yansıyacaktır.';
			amount = null;
			notes = '';
            senderName = '';
            selectedBank = null;
            // Selectbox'ı sıfırla (gerekirse)
            const selectElement = document.getElementById('bank-select') as HTMLSelectElement;
            if (selectElement) selectElement.value = "";

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

			{#if isLoadingBanks}
				<p>Bankalar yükleniyor...</p>
			{:else if bankLoadError}
				<p class="error">Bankalar yüklenirken hata oluştu: {bankLoadError}</p>
			{:else if activeBanks.length === 0}
                 <p class="warning">Şu anda para yatırabileceğiniz aktif bir banka hesabı bulunmamaktadır.</p>
            {:else}
				<div class="form-group">
					<label for="bank-select">Hangi Bankaya Para Yatırdınız?</label>
					<select id="bank-select" on:change={handleBankSelection} required>
						<option value="" disabled selected={!selectedBank}>-- Banka Seçin --</option>
						{#each activeBanks as bank (bank.id)}
							<option value={bank.id}>{bank.bank_name}</option>
						{/each}
					</select>
				</div>

				{#if selectedBank}
					<div class="iban-info">
						<p>Lütfen aşağıdaki hesaba havale/EFT yapın:</p>
                        <p><strong>Banka:</strong> {selectedBank.bank_name}</p>
						<p><strong>Alıcı Adı:</strong> {selectedBank.account_holder_name ?? 'Belirtilmemiş'}</p>
						<p><strong>IBAN:</strong> <span class="iban">{selectedBank.iban}</span></p>
                        <p><small>(IBAN'ı kopyalayabilirsiniz)</small></p>
					</div>

                    <div class="form-group">
                        <label for="senderName">Adınız Soyadınız (Dekonttaki Gibi)</label>
                        <input type="text" id="senderName" bind:value={senderName} required placeholder="Ad Soyad" />
                    </div>

					<div class="form-group">
						<label for="amount">Yatırdığınız Tutar (TL)</label>
						<input type="number" step="0.01" id="amount" bind:value={amount} required placeholder="Örn: 250.00" />
					</div>

					<div class="form-group">
						<label for="notes">Açıklama (İsteğe Bağlı)</label>
						<textarea id="notes" rows="3" bind:value={notes} placeholder="Örn: Sipariş no, ek bilgi vb."></textarea>
					</div>

					{#if errorMessage}
						<p class="error">{errorMessage}</p>
					{/if}
					{#if successMessage}
						<p class="success">{successMessage}</p>
					{/if}

					<button type="submit" disabled={isLoading || !selectedBank}>
						{#if isLoading}
							Gönderiliyor...
						{:else}
							Bildirimi Gönder
						{/if}
					</button>
                {:else}
                     <p>Lütfen yukarıdan bir banka seçerek devam edin.</p>
				{/if}
			{/if}
		</form>
	</div>
</main>

<style>
	/* ... (Mevcut stiller korunabilir) ... */
    .form-container { max-width: 500px; margin: 2rem auto; }
    .form { padding: 2rem; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
	.form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input[type="number"], input[type="text"], textarea, select {
        width: 100%;
        padding: 0.7rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        box-sizing: border-box; /* Önemli */
    }
    textarea { resize: vertical; }
    button {
        padding: 0.8rem 1.5rem;
		border: none;
		background-color: #1877f2; /* Mavi */
		color: white;
		border-radius: 6px;
		cursor: pointer;
        width: 100%;
        font-size: 1rem;
        font-weight: bold;
    }
    button:disabled { background-color: #ccc; cursor: not-allowed;}
	.error { color: #d32f2f; margin-top: 1rem; font-size: 0.9rem;}
	.success { color: #388e3c; margin-top: 1rem; font-size: 0.9rem;}
    .warning { color: #f97316; margin-top: 1rem; font-size: 0.9rem;}
    .iban-info {
        background-color: #f0f2f5;
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 1.5rem;
        border: 1px solid #ddd;
    }
    .iban-info p { margin-bottom: 0.5rem; line-height: 1.4;}
    .iban { font-family: monospace; user-select: all; /* Kopyalamayı kolaylaştırır */ }
</style>