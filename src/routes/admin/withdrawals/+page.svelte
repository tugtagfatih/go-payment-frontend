<script lang="ts">
    import type { PageData } from './$types';
    import { apiFetch } from '$lib/api';
	import { invalidateAll } from '$app/navigation';

    export let data: PageData;

    let isLoading = false;

    async function handleAction(requestId: string, action: 'approve' | 'reject') {
        isLoading = true;
        try {
            const response = await apiFetch(`/admin/withdrawals/${requestId}/${action}`, { method: 'POST' });
            if (!response.ok) {
                const errorData = await response.json();
                alert(`İşlem başarısız: ${errorData.error}`);
            }
        } catch (error) {
            alert('Bir hata oluştu.');
        } finally {
            isLoading = false;
            // Aksiyon sonrası listeyi tazelemek için sayfanın verisini yeniden yükle
            invalidateAll();
        }
    }
</script>

<h1>Onay Bekleyen Para Çekme Talepleri</h1>

{#if data.requests && data.requests.length > 0}
    <table>
        <thead>
            <tr>
                <th>Kullanıcı</th>
                <th>Tutar</th>
                <th>IBAN</th>
                <th>Talep Tarihi</th>
                <th>İşlemler</th>
            </tr>
        </thead>
        <tbody>
            {#each data.requests as req (req.id)}
                <tr>
                    <td>{req.username}</td>
                    <td>{req.amount} TL</td>
                    <td>{req.target_iban}</td>
                    <td>{new Date(req.created_at).toLocaleString()}</td>
                    <td>
                        <button on:click={() => handleAction(req.id, 'approve')} disabled={isLoading}>Onayla</button>
                        <button on:click={() => handleAction(req.id, 'reject')} disabled={isLoading}>Reddet</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{:else if data.error}
    <p class="error">{data.error}</p>
{:else}
    <p>Onay bekleyen para çekme talebi bulunmuyor.</p>
{/if}

<style>
    /* Bir önceki admin sayfasındaki tablo stilleri buraya eklenebilir. */
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.8rem; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
    button { margin-right: 0.5rem; }
</style>