<script lang="ts">
    import type { PageData } from './$types';
    import { apiFetch } from '$lib/api';
	import { invalidateAll } from '$app/navigation';

    export let data: PageData;
    let searchTerm = data.searchQuery;

    async function handleBan(userId: string) {
        if (confirm('Bu kullanıcıyı banlamak istediğinizden emin misiniz?')) {
            await apiFetch(`/admin/users/${userId}/ban`, { method: 'POST' });
            invalidateAll();
        }
    }
    async function handleUnban(userId: string) {
        await apiFetch(`/admin/users/${userId}/unban`, { method: 'POST' });
        invalidateAll();
    }
</script>

<h1>Kullanıcı Yönetimi</h1>

<form action="/admin/users" method="GET">
    <input type="search" name="q" bind:value={searchTerm} placeholder="Kullanıcı adı ile ara..." />
    <button type="submit">Ara</button>
</form>

{#if data.users && data.users.length > 0}
    <table>
        <thead>
            <tr>
                <th>Kullanıcı Adı</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Durum</th>
                <th>İşlemler</th>
            </tr>
        </thead>
        <tbody>
            {#each data.users as user (user.id)}
                <tr>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.account_status}</td>
                    <td>
                        {#if user.role !== 'master_admin'}
                            {#if user.account_status === 'active'}
                                <button on:click={() => handleBan(user.id)}>Banla</button>
                            {:else if user.account_status === 'banned'}
                                <button on:click={() => handleUnban(user.id)}>Banı Kaldır</button>
                            {/if}
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{:else}
    <p>Arama kriterleriyle eşleşen kullanıcı bulunamadı.</p>
{/if}

<style>
    /* ... tablo stilleri ... */
</style>