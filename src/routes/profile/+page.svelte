<script lang="ts">
	import type { PageData } from './$types';
	import { apiFetch } from '$lib/api';
	import { onMount } from 'svelte';
	export let data: PageData;

	// Banka listesi (veritabanına eklemeye gerek yok, frontend'de tutabiliriz)
	const withdrawalBankNames = [
        `T.C.
Ziraat Bankası A.Ş.', 'Türkiye Halk Bankası A.Ş.', 'Türkiye Vakıflar Bankası T.A.O.',
        'Türkiye İş Bankası A.Ş.', 'Akbank T.A.Ş.', 'Yapı ve Kredi Bankası A.Ş.',
        'Türkiye Garanti Bankası A.Ş.', 'QNB Finansbank A.Ş.', 'Denizbank A.Ş.',
        'Türk Ekonomi Bankası A.Ş.', 'ING Bank A.Ş.', 'HSBC Bank A.Ş.', 'Odea Bank A.Ş.',
        'Alternatifbank A.Ş.', 'Fibabanka A.Ş.', 'Şekerbank T.A.Ş.', 'Anadolubank A.Ş.',
        'Burgan Bank A.Ş.', 'Citibank A.Ş.', 'ICBC Turkey Bank A.Ş.', 'Arap Türk Bankası A.Ş.',
 
        'MUFG Bank Turkey A.Ş.', 'Turkish Bank A.Ş.', 'Turkland Bank A.Ş.', 'Bank of China Turkey A.Ş.',
        'Albaraka Türk Katılım Bankası A.Ş.', 'Kuveyt Türk Katılım Bankası A.Ş.', 'Türkiye Finans Katılım Bankası A.Ş.',
        'Ziraat Katılım Bankası A.Ş.', 'Vakıf Katılım Bankası A.Ş.', 'Türkiye Emlak Katılım Bankası A.Ş.',
        'Hayat Finans Katılım Bankası A.Ş.', 'Dünya Katılım Bankası A.Ş.', 'Aktif Yatırım Bankası A.Ş.',
        'Türkiye Sınai Kalkınma Bankası A.Ş.', 'Türkiye Kalkınma ve Yatırım 
Bankası A.Ş.',
        'İller Bankası A.Ş.', 'Türk Eximbank', 'Pasha Yatırım Bankası A.Ş.', 'GSD Yatırım Bankası A.Ş.`
	].sort(); // Alfabetik sıralama

	// Banka Bilgileri Formu için değişkenler
	let iban: string = '';
    let selectedWithdrawalBank: string = '';
	// YENİ EKLENDİ
	let bankInfoLoading = false;
	let bankInfoError = '';
	let bankInfoSuccess = '';
	// Şifre Değiştirme Formu için değişkenler
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let passwordLoading = false;
	let passwordError = '';
	let passwordSuccess = '';
	// Sayfa yüklendiğinde, `data.profile`'dan gelen IBAN bilgisini form alanına ata
	onMount(() => {
		if (data.profile && data.profile.iban) {
			iban = data.profile.iban;
		}
	});
	async function handleUpdateBankInfo() {
		bankInfoLoading = true;
		bankInfoError = '';
		bankInfoSuccess = '';
		try {
			const response = await apiFetch('/api/profile/bank-info', {
				method: 'PUT',
				body: JSON.stringify({
                    iban: iban.trim() || null, // Boş ise null gönder
                    withdrawal_bank_name: selectedWithdrawalBank || null // Boş ise null gönder
                })
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Banka bilgileri güncellenemedi.');
			}

			bankInfoSuccess = 'Banka bilgileriniz başarıyla güncellendi.';
		} catch (error: any) {
			bankInfoError = error.message;
		} finally {
			bankInfoLoading = false;
		}
	}

	async function handleChangePassword() {
		if (newPassword !== confirmPassword) {
			passwordError = 'Yeni şifreler uyuşmuyor.';
			return;
		}

		passwordLoading = true;
		passwordError = '';
		passwordSuccess = '';

		try {
			const response = await apiFetch('/api/profile/change-password', {
				method: 'PUT',
				body: JSON.stringify({
					current_password: currentPassword,
					new_password: newPassword
				})
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Şifre güncellenemedi.');
			}
			
			passwordSuccess = 'Şifreniz başarıyla güncellendi.';
			// Formu temizle
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';

		} catch (error: any) {
			passwordError = error.message;
		} finally {
			passwordLoading = false;
		}
	}
</script>

<div class="profile-container">
	<h1>Profilim</h1>

	{#if data.error}
		<p class="error">{data.error}</p>
	{/if}

	<section class="profile-section">
		<h2>İşlem Geçmişi</h2>
		{#if data.transactionHistory && data.transactionHistory.length > 0}
			<table class="history-table">
				<thead>
					<tr>
						<th>Tarih</th>
						<th>İşlem Türü</th>
						<th>Tutar</th>
					</tr>
				</thead>
				<tbody>
					{#each data.transactionHistory as tx (tx.id)}
						<tr class:positive={tx.amount > 0} class:negative={tx.amount < 0}>
							<td>{new Date(tx.created_at).toLocaleString()}</td>
							<td>{tx.type}</td>
							<td>{tx.amount.toFixed(2)} TL</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<p>Henüz bir cüzdan hareketiniz bulunmuyor.</p>
		{/if}
	</section>

	<section class="profile-section">
        <h2>Banka Bilgileri</h2>
        <p>Para çekme işlemlerinde kullanılacak olan banka ve IBAN adresinizi giriniz.</p>
        <form on:submit|preventDefault={handleUpdateBankInfo} class="bank-form">
            <div class="form-group">
                <label 
for="withdrawal-bank">Banka Adı</label>
                <select id="withdrawal-bank" bind:value={selectedWithdrawalBank}>
                    <option value="">-- Banka Seçin (İsteğe Bağlı) --</option>
                    {#each withdrawalBankNames as bankName}
                        <option value={bankName}>{bankName}</option>
       
             {/each}
                </select>
            </div>
            <div class="form-group">
                <label for="iban">IBAN</label>
                <input type="text" id="iban" bind:value={iban} placeholder="TR..." />
        
        <small>IBAN girmeniz para çekme talebi oluşturmak için zorunludur.</small>
            </div>
            <button type="submit" disabled={bankInfoLoading}>
                {#if bankInfoLoading} Kaydediliyor... {:else} Kaydet {/if}
            </button>
        </form>
		{#if bankInfoError}
			<p class="error">{bankInfoError}</p>
		{/if}
		{#if bankInfoSuccess}
			<p class="success">{bankInfoSuccess}</p>
		{/if}
    </section>

    <section class="profile-section">
     
    <h2>Şifre Değiştir</h2>
		<form on:submit|preventDefault={handleChangePassword} class="password-form">
			<div class="form-group">
				<label for="current-password">Mevcut Şifre</label>
				<input type="password" id="current-password" bind:value={currentPassword} required />
			</div>
			<div class="form-group">
				<label for="new-password">Yeni Şifre</label>
				<input type="password" id="new-password" bind:value={newPassword} minlength="6" required />
			</div>
			<div class="form-group">
				<label for="confirm-password">Yeni Şifre (Tekrar)</label>
				<input type="password" id="confirm-password" bind:value={confirmPassword} minlength="6" required />
			</div>
			<button type="submit" disabled={passwordLoading}>
				{#if passwordLoading}
					Güncelleniyor...
				{:else}
					Şifreyi Güncelle
				{/if}
			</button>
		</form>
		{#if passwordError}
			<p class="error">{passwordError}</p>
		{/if}
		{#if passwordSuccess}
			<p class="success">{passwordSuccess}</p>
		{/if}
    </section>

</div>

<style>
	.profile-container {
		max-width: 900px;
margin: 2rem auto;
		padding: 1rem;
	}
	.profile-section {
		background-color: #fff;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		margin-bottom: 2rem;
	}
	.history-table {
		width: 100%;
		border-collapse: collapse;
	}
	.history-table th, .history-table td {
		padding: 0.8rem;
		text-align: left;
		border-bottom: 1px solid #ddd;
	}
	.history-table th {
		background-color: #f2f2f2;
	}
	.positive td:last-child {
		color: #2e7d32; /* Yeşil */
		font-weight: bold;
	}
	.negative td:last-child {
		color: #c62828; /* Kırmızı */
		font-weight: bold;
	}
    .form-grid {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1rem;
align-items: flex-end;
    }
    .form-group {
        display: flex;
        flex-direction: column;
	}
    label {
        margin-bottom: 0.5rem;
        font-weight: 500;
	}
    input {
        padding: 0.7rem;
        border: 1px solid #ddd;
border-radius: 6px;
    }
    button {
		padding: 0.7rem 1.5rem;
		border: none;
		background-color: #1877f2;
		color: white;
		border-radius: 6px;
		cursor: pointer;
	}
    button:disabled {
        background-color: #ccc;
    }
	.error {
		color: #d32f2f;
        margin-top: 1rem;
	}
	.success {
		color: #388e3c;
        margin-top: 1rem;
	}
    .password-form {
        display: flex;
flex-direction: column;
        gap: 1rem;
        max-width: 400px;
    }
    .password-form button {
        align-self: flex-start;
	}

	.bank-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 500px;
/* Veya istediğiniz bir genişlik */
    }
    .bank-form button {
        align-self: flex-start;
/* Buton sola yaslansın */
    }
    .form-group small {
        font-size: 0.8rem;
color: #606770;
        margin-top: 0.25rem;
    }
    /* Select kutusu için stil */
    select {
        padding: 0.7rem;
border: 1px solid #ddd;
        border-radius: 6px;
        background-color: white; /* Arka plan rengi */
        width: 100%;
/* Tam genişlik */
        box-sizing: border-box;
    }
</style>
