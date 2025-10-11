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
			<a href="/wallet">Cüzdanım</a>
			<a href="/profile">Profilim</a>

            <div class="nav-right">
                <div class="user-info">
                    <strong>{$authStore.username}</strong>
                    <span>{$authStore.email}</span>
                </div>
                <button on:click={logout}>Çıkış Yap</button>
            </div>
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

    /* YENİ VE GÜNCELLENEN STİLLER */
    .nav-right {
        margin-left: auto; /* Bu grup en sağa yaslanır */
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .user-info {
        display: flex;
        flex-direction: column;
        color: white;
        text-align: right;
        line-height: 1.2;
    }

    .user-info span {
        font-size: 0.8rem;
        font-weight: normal;
        opacity: 0.85;
    }

	nav button {
		margin-left: 0; /* Otomatik yaslamayı kaldırıyoruz */
		background: none;
		border: 1px solid white;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}
</style>