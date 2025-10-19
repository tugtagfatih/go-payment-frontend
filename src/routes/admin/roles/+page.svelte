<script lang="ts">
	import type { PageData } from './$types';
	import { apiFetch } from '$lib/api';
	import { invalidateAll } from '$app/navigation';
	import { authStore } from '$lib/authStore';

	export let data: PageData;

	// --- State Değişkenleri ---
	let searchTerm = '';
	let searchResults: any[] = [];
	let isSearching = false;
    let changeLoading: string | null = null;
	// Rol değiştirme butonu için loading

	// --- Rol Yönetimi Mantığı ---
	let assignableRoles: string[] = [];
	$: if ($authStore.role === 'master_admin') { //
		assignableRoles = ['admin', 'approver', 'user'];
	//
	} else if ($authStore.role === 'admin') { //
		assignableRoles = ['approver', 'user'];
	//
	} //

	async function handleRoleChange(userId: string, newRole: string, originalRole: string, eventTarget: HTMLSelectElement) {
		if (!confirm(`Bu kullanıcının rolünü '${newRole}' olarak değiştirmek istediğinizden emin misiniz?`)) {
			// Kullanıcı iptal ederse, selectbox'ı eski değerine döndür.
			eventTarget.value = originalRole;
			return;
		}
        changeLoading = userId;
		try {
			const response = await apiFetch(`/admin/users/${userId}/role`, { //
				method: 'PUT', //
				body: JSON.stringify({ role: newRole }) //
			});
			if (!response.ok) { //
				const errorData = await response.json(); //
				alert(`Hata: ${errorData.error}`);
				//
                eventTarget.value = originalRole;
			// Hata durumunda da eski değere dön
			}
		} catch (error) { //
			alert('Bir hata oluştu.');
			//
             eventTarget.value = originalRole;
			// Hata durumunda da eski değere dön
		} finally { //
			changeLoading = null;
			invalidateAll();
			//
		}
	}

	async function handleUserSearch() {
		// ... (fonksiyon içeriği aynı kalır) ...
		if (!searchTerm.trim()) return; //
		isSearching = true;
		//
		try { //
			const response = await apiFetch(`/admin/users?username=${searchTerm}`); //
			searchResults = await response.json(); //
		} catch (error) { //
			alert('Arama sırasında bir hata oluştu.');
			//
		} finally { //
			isSearching = false; //
		} //
	}
</script>

<svelte:head>
	<title>Rol Yönetimi - Admin</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">Rol Yönetimi</h1>

{#if data.error}
	<div class="bg-danger/10 text-danger p-4 rounded-lg mb-6">
		<p>Veriler yüklenirken bir hata oluştu: {data.error}</p>
	</div>
{/if}

<section class="mb-8">
	<h2 class="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">Yönetilebilen Yetkililer</h2>
	<p class="text-sm text-subtle-light dark:text-subtle-dark mb-4">
        Bu liste, yetki seviyenize göre yönetebileceğiniz mevcut admin ve onaylayıcıları gösterir.
</p>

	{#if data.manageableUsers && data.manageableUsers.length > 0}
		<div class="overflow-x-auto bg-surface-light dark:bg-surface-dark rounded-lg shadow">
			<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
				<thead class="bg-gray-50 dark:bg-gray-700">
					<tr>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Kullanıcı Adı </th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Email </th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Mevcut Rol </th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Yeni Rol Ata </th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
					{#each data.manageableUsers as user (user.id)}
						<tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">{user.username}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">{user.email}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{user.role}</td>
							<td class="px-6 py-4 
whitespace-nowrap text-sm">
								<select
                                    class="py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
									value={user.role}
									on:change={(e) => handleRoleChange(user.id, e.currentTarget.value, user.role, e.currentTarget)}
                                    disabled={changeLoading === user.id}
								>
									{#each assignableRoles as role}
										<option value={role}>{role}</option>
									{/each}
								</select>
  
                               {#if changeLoading === user.id} <span class="ml-2 text-xs">...</span> {/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if !data.error}
		<p class="text-subtle-light dark:text-subtle-dark">Yönetebileceğiniz yetkili kullanıcı bulunmuyor.</p>
	{/if}
</section>

<section>
	<h2 class="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">Kullanıcı Ara ve Yetki Ver</h2>
	<form on:submit|preventDefault={handleUserSearch} class="flex items-center gap-2 mb-4">
		<input
            type="search"
            bind:value={searchTerm}
            placeholder="Kullanıcı adı ile ara..."
   
         class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
		<button
            type="submit"
            disabled={isSearching ||
!searchTerm.trim()}
            class="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
			{#if isSearching}Aranıyor...{:else}Kullanıcı Ara{/if}
		</button>
	</form>

	{#if searchResults.length > 0}
		<h3 class="text-lg font-medium mb-2 text-text-light dark:text-text-dark">Arama Sonuçları</h3>
        <div class="overflow-x-auto bg-surface-light dark:bg-surface-dark rounded-lg shadow">
			<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
					<tr>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Kullanıcı Adı </th>
						<th scope="col" class="px-6 py-3 text-left 
text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Email </th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Mevcut Rol </th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider"> Yeni Rol Ata </th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
					{#each searchResults as user (user.id)}
						{@const canManage = ($authStore.role === 'master_admin' && ['user', 'approver', 'admin'].includes(user.role)) ||
($authStore.role === 'admin' && ['user', 'approver'].includes(user.role))}
                        {#if canManage && user.role !== 'master_admin'}
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <td class="px-6 py-4 
whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">{user.username}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">{user.email}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{user.role}</td>
                    
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        class="py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background-light dark:bg-background-dark 
text-text-light dark:text-text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
                                        value={user.role}
                                        on:change={(e) => handleRoleChange(user.id, e.currentTarget.value, user.role, e.currentTarget)}
         
                                disabled={changeLoading === user.id}
                                    >
                               
         {#each assignableRoles as role}
                                            <option value={role}>{role}</option>
                                        {/each}
   
                                 </select>
                                     {#if changeLoading === user.id} <span class="ml-2 text-xs">...</span> {/if}
                       
         </td>
                            </tr>
                        {/if}
					{/each}
				</tbody>
			</table>
		</div>
    {:else if isSearching}
        <p class="text-subtle-light dark:text-subtle-dark">Kullanıcılar aranıyor...</p>
    {:else if searchTerm.trim()}
         <p class="text-subtle-light dark:text-subtle-dark">Bu kullanıcı adına sahip yönetilebilir 
kullanıcı bulunamadı.</p>
	{/if}
</section>