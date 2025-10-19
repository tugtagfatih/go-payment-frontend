<script lang="ts">
    import type { PageData } from './$types';
    import { apiFetch } from '$lib/api';
	import { invalidateAll } from '$app/navigation';

    export let data: PageData;

    let editingBankId: string | null = null;
	let editIban: string | null = null;
    let editAccountHolder: string | null = null;
    let isLoading = false;
	let errorMessage = '';

    function startEditing(bank: any) {
        editingBankId = bank.id;
		editIban = bank.iban ?? ''; // Null ise boş string ata
        editAccountHolder = bank.account_holder_name ??
''; // Null ise boş string ata
        errorMessage = '';
	}

    function cancelEditing() {
        editingBankId = null;
        editIban = null;
		editAccountHolder = null;
        errorMessage = '';
    }

    async function handleSave(bankId: string) {
        isLoading = true;
		errorMessage = '';
        try {
            const response = await apiFetch(`/admin/banks/${bankId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    iban: editIban || null, // Boş string ise null gönder
                
    account_holder_name: editAccountHolder || null // Boş string ise null gönder
                 }),
            });
			if (!response.ok) {
                const errorData = await response.json();
				throw new Error(errorData.error || 'Banka bilgisi güncellenemedi.');
            }
            editingBankId = null;
			// Düzenleme modundan çık
            await invalidateAll();
			// Listeyi yenile
        } catch (error: any) {
            errorMessage = error.message;
		} finally {
            isLoading = false;
		}
    }

    async function handleToggleStatus(bankId: string) {
        isLoading = true;
		try {
            await apiFetch(`/admin/banks/${bankId}/toggle`, { method: 'POST' });
			await invalidateAll(); // Listeyi yenile
        } catch (error) {
             alert('Durum güncellenirken hata oluştu.');
		} finally {
             isLoading = false;
		}
    }
</script>

<h1>Banka Hesapları Yönetimi</h1>

{#if data.error}
    <p class="error">Hata: {data.error}</p>
{/if}

{#if errorMessage}
    <p class="error">{errorMessage}</p>
{/if}

<table>
    <thead>
        <tr>
            <th>Banka Adı</th>
            <th>IBAN</th>
            <th>Hesap Sahibi</th>
            <th>Durum</th>
            <th>İşlemler</th>
       
 </tr>
    </thead>
    <tbody>
        {#each data.banks as bank (bank.id)}
            <tr>
                <td>{bank.bank_name}</td>
                {#if editingBankId === bank.id}
                    <td><input type="text" bind:value={editIban} placeholder="TR..." /></td>
        
            <td><input type="text" bind:value={editAccountHolder} placeholder="Ad Soyad" /></td>
                    <td>{bank.is_active ?
'Aktif' : 'Pasif'}</td>
                    <td>
                        <button on:click={() => handleSave(bank.id)} disabled={isLoading}>Kaydet</button>
                        <button on:click={cancelEditing} disabled={isLoading}>İptal</button>
                    </td>
    
            {:else}
                    <td>{bank.iban ??
'-'}</td>
                    <td>{bank.account_holder_name ??
'-'}</td>
                    <td>{bank.is_active ?
'Aktif' : 'Pasif'}</td>
                    <td>
                        <button on:click={() => startEditing(bank)}>Düzenle</button>
                        <button on:click={() => handleToggleStatus(bank.id)} disabled={isLoading}>
                       
     {bank.is_active ? 'Pasif Yap' : 'Aktif Et'}
                        </button>
                    </td>
                {/if}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    /* Basit tablo ve form stilleri eklenebilir */
    table { width: 100%; border-collapse: collapse; margin-top: 1rem;
}
    th, td { padding: 0.8rem; text-align: left; border-bottom: 1px solid #ddd;
}
    th { background-color: #f2f2f2; }
    input[type="text"] { padding: 0.4rem; border: 1px solid #ccc;
border-radius: 4px; }
    button { margin-right: 0.5rem; padding: 0.4rem 0.8rem; cursor: pointer;
}
    .error { color: red; margin-top: 1rem; }
</style>