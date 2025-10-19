<script lang="ts">
	import type { PageData } from './$types';
	import { apiFetch } from '$lib/api';
	import { invalidateAll } from '$app/navigation';
	export let data: PageData;
	let searchTerm = data.searchQuery || '';
    let loadingAction: string | null = null;
	// Ban/Unban butonu için

	async function handleAction(userId: string, action: 'ban' | 'unban') {
		const confirmMessage = action === 'ban'
			?
'Bu kullanıcıyı banlamak istediğinizden emin misiniz?'
			: 'Bu kullanıcının banını kaldırmak istediğinizden emin misiniz?';
		if (confirm(confirmMessage)) {
            loadingAction = `${action}-${userId}`;
			try {
                await apiFetch(`/admin/users/${userId}/${action}`, { method: 'POST' });
			//
			    invalidateAll(); //
            } catch (error) {
                console.error(`Error ${action}ning user:`, error);
				alert(`Kullanıcı işlemi (${action}) sırasında bir hata oluştu.`);
            } finally {
                loadingAction = null;
			}
		}
	}
</script>

<svelte:head>
	<title>Kullanıcı Yönetimi - Admin</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">Kullanıcı Yönetimi</h1>

{#if data.error}
	<div class="bg-danger/10 text-danger p-4 rounded-lg mb-6">
		<p>Kullanıcılar yüklenirken bir hata oluştu: {data.error}</p>
	</div>
{/if}

<form action="/admin/users" method="GET" class="flex items-center gap-2 mb-6">
	<input
		type="search"
		name="q"
		bind:value={searchTerm}
		placeholder="Kullanıcı adı ile ara..."
        class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
	/>
	<button
        type="submit"
        class="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 whitespace-nowrap"
    >Ara</button>
</form>

{#if data.users && data.users.length > 0}
	<div class="overflow-x-auto bg-surface-light dark:bg-surface-dark rounded-lg 
shadow">
		<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-700">
				<tr>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Kullanıcı Adı </th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Email </th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Rol </th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Durum </th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> İşlemler </th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each data.users as user (user.id)}
					<tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">{user.username}</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">{user.email}</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{user.role}</td>
						<td class="px-6 py-4 whitespace-nowrap 
text-sm">
                            <span class:text-success={user.account_status === 'active'} class:text-danger={user.account_status === 'banned'}>
                                {user.account_status}
                            </span>
      
                  </td>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
							{#if user.role !== 'master_admin'}
								{#if user.account_status === 'active'}
									<button
                                        on:click={() => handleAction(user.id, 'ban')}
                           
             disabled={!!loadingAction}
                                        class="px-3 py-1 text-xs font-semibold rounded-md text-white bg-danger hover:bg-danger/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger disabled:opacity-50 disabled:cursor-not-allowed"
                                  
  >
                                        {loadingAction === `ban-${user.id}` ?
'...' : 'Banla'}
                                    </button>
								{:else if user.account_status === 'banned'}
									<button
                                        on:click={() => handleAction(user.id, 'unban')}
               
                         disabled={!!loadingAction}
                                        class="px-3 py-1 text-xs font-semibold rounded-md text-white bg-warning hover:bg-warning/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning disabled:opacity-50 disabled:cursor-not-allowed"
                      
              >
                                        {loadingAction === `unban-${user.id}` ?
'...' : 'Banı Kaldır'}
                                    </button>
								{/if}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else if !data.error}
	<div class="text-center py-10 bg-surface-light dark:bg-surface-dark rounded-xl shadow">
        {#if data.searchQuery}
		    <p class="text-subtle-light dark:text-subtle-dark">"{data.searchQuery}" ile eşleşen kullanıcı bulunamadı.</p>
        {:else}
            <p class="text-subtle-light dark:text-subtle-dark">Gösterilecek kullanıcı bulunamadı.</p>
        {/if}
	</div>
{/if}