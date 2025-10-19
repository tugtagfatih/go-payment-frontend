<script lang="ts">
    import type { PageData } from './$types';
    import { apiFetch } from '$lib/api';
    import { invalidateAll } from '$app/navigation';

    export let data: PageData;

    async function handleApprove(notificationId: string) {
        // ... (fonksiyon aynı kalır)
    }

    async function handleReject(notificationId: string) {
        // ... (fonksiyon aynı kalır)
    }
</script>

<h1>Onay Bekleyen Ödeme Bildirimleri</h1>

{#if data.notifications.length > 0}
    <table>
        <thead>
            <tr>
                <th>Kullanıcı</th>
                <th>Gönderen Adı</th> <th>Banka</th>       <th>Tutar</th>
                <th>Notlar</th>
                <th>Tarih</th>
                <th>İşlemler</th>
            </tr>
        </thead>
        <tbody>
            {#each data.notifications as notif (notif.id)}
                <tr>
                    <td>{notif.username ?? '-'}</td>
                    <td>{notif.sender_name ?? '-'}</td>         <td>{notif.deposit_bank_name ?? '-'}</td> <td>{notif.amount} TL</td>
                    <td>{notif.notes ?? '-'}</td>
                    <td>{new Date(notif.created_at).toLocaleString()}</td>
                    <td>
                        <button on:click={() => handleApprove(notif.id)}>Onayla</button>
                        <button on:click={() => handleReject(notif.id)}>Reddet</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{:else}
    <p>Onay bekleyen bildirim bulunmuyor.</p>
{/if}

<style>
    /* Basit tablo stilleri */
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.8rem; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
    button { margin-right: 0.5rem; }
</style>