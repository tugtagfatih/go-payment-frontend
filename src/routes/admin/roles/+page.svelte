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

	// --- Rol Yönetimi Mantığı ---
	// Giriş yapmış adminin rolüne göre, hangi rolleri atayabileceğini belirleyen dinamik liste.
	let assignableRoles: string[] = [];
	$: if ($authStore.role === 'master_admin') {
		assignableRoles = ['admin', 'approver', 'user'];
	} else if ($authStore.role === 'admin') {
		assignableRoles = ['approver', 'user'];
	}

	async function handleRoleChange(userId: string, newRole: string) {
		if (!confirm(`Bu kullanıcının rolünü '${newRole}' olarak değiştirmek istediğinizden emin misiniz?`)) {
			// Kullanıcı iptal ederse, selectbox'ın eski değerine dönmesi için sayfayı yenile.
			invalidateAll();
			return;
		}

		try {
			const response = await apiFetch(`/admin/users/${userId}/role`, {
				method: 'PUT',
				body: JSON.stringify({ role: newRole })
			});

			if (!response.ok) {
				const errorData = await response.json();
				alert(`Hata: ${errorData.error}`);
			}
		} catch (error) {
			alert('Bir hata oluştu.');
		} finally {
			// Her durumda sayfanın verisini yenileyerek güncel listeyi al.
			invalidateAll();
		}
	}

	async function handleUserSearch() {
		if (!searchTerm.trim()) return;
		isSearching = true;
		try {
			const response = await apiFetch(`/admin/users?username=${searchTerm}`);
			searchResults = await response.json();
		} catch (error) {
			alert('Arama sırasında bir hata oluştu.');
		} finally {
			isSearching = false;
		}
	}
</script>

<h1>Rol Yönetimi</h1>

<section>
	<h2>Yönetilebilen Yetkililer</h2>
	<p>Bu liste, yetki seviyenize göre yönetebileceğiniz mevcut admin ve onaylayıcıları gösterir.</p>

	{#if data.manageableUsers && data.manageableUsers.length > 0}
		<table>
			<thead>
				<tr>
					<th>Kullanıcı Adı</th>
					<th>Email</th>
					<th>Mevcut Rol</th>
					<th>Yeni Rol Ata</th>
				</tr>
			</thead>
			<tbody>
				{#each data.manageableUsers as user (user.id)}
					<tr>
						<td>{user.username}</td>
						<td>{user.email}</td>
						<td>{user.role}</td>
						<td>
							<select
								value={user.role}
								on:change={(e) => handleRoleChange(user.id, e.currentTarget.value)}
							>
								{#each assignableRoles as role}
									<option value={role}>{role}</option>
								{/each}
							</select>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p>Yönetebileceğiniz yetkili kullanıcı bulunmuyor.</p>
	{/if}
</section>

<section>
	<h2>Kullanıcı Ara ve Yetki Ver</h2>
	<form on:submit|preventDefault={handleUserSearch}>
		<input type="search" bind:value={searchTerm} placeholder="Kullanıcı adı ile ara..." />
		<button type="submit" disabled={isSearching}>
			{#if isSearching}Aranıyor...{:else}Kullanıcı Ara{/if}
		</button>
	</form>

	{#if searchResults.length > 0}
		<h3>Arama Sonuçları</h3>
		<table>
			<tbody>
				{#each searchResults as user (user.id)}
					{#if user.role === 'user' || user.role === 'approver'}
						<tr>
							<td>{user.username}</td>
							<td>{user.email}</td>
							<td>{user.role}</td>
							<td>
								<select
									value={user.role}
									on:change={(e) => handleRoleChange(user.id, e.currentTarget.value)}
								>
									{#each assignableRoles as role}
										<option value={role}>{role}</option>
									{/each}
								</select>
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	{/if}
</section>

<style>
	/* ... (Daha önceki admin sayfalarındaki tablo stilleri buraya eklenebilir) ... */
</style>