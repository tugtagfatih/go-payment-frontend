<script lang="ts">
	import { authStore, logout } from '$lib/authStore';
</script>

<header>
	<nav>
		<a href="/">Ana Sayfa</a>
		
		{#if $authStore.isAuthenticated}
			{#if ['admin', 'master_admin', 'approver'].includes($authStore.role || '')}
				<a href="/admin/notifications">Admin Paneli</a>
			{/if}

			<a href="/listings/new">Yeni İlan Oluştur</a>
			<a href="/wallet">Cüzdanım</a> <button on:click={logout}>Çıkış Yap</button>
		{:else}
			<a href="/login">Giriş Yap</a>
		{/if}
	</nav>
</header>

<main>
	<slot />
</main>

<style>
	header {
		background-color: #1877f2;
		padding: 1rem 2rem;
	}
	nav {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	nav a {
		color: white;
		text-decoration: none;
		font-weight: bold;
	}
	nav button {
		margin-left: auto; /* Çıkış yap butonunu en sağa yaslar */
		background: none;
		border: 1px solid white;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}
</style>

