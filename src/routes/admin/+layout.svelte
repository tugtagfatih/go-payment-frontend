<div class="admin-layout">
	<aside class="admin-sidebar">
		<div>
			<h2>Admin Paneli</h2>
			<nav>
				<a href="/admin/notifications">Ödeme Bildirimleri</a>
				<a href="/admin/withdrawals">Para Çekme Talepleri</a>
				<a href="/admin/roles">Rol Yönetimi</a>
				<a href="/admin/users">Kullanıcı Banlama</a>
				<a href="/admin/banks">Banka Hesapları</a>
			
			

		
			<hr class="nav-hr" />
			<a href="/" class="back-to-site">← Ana Siteye Dön</a>
		</nav>
		</aside>
	<main class="admin-content">
		<slot />
	</main>
</div>

<style>
	.admin-layout {
		display: flex;
		min-height: 100vh;
		background-color: #fff;
	}
	.admin-sidebar {
		width: 250px;
		background: #f0f2f5;
		padding: 1.5rem;
		border-right: 1px solid #ddd;
		/* --- YENİ EKLENEN STILLER --- */
		display: flex;
		flex-direction: column;
		justify-content: space-between; /* Bu, üst ve alt bölümü ayırır */
		/* --- YENİ STILLER SONU --- */
	}
	.admin-sidebar h2 {
		font-size: 1.2rem;
		margin-top: 0;
		margin-bottom: 2rem;
		color: #1c1e21;
	}
	.admin-sidebar nav {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}
	.admin-sidebar nav a {
		text-decoration: none;
		color: #333;
		padding: 0.7rem;
		border-radius: 6px;
		font-weight: 500;
	}
	.admin-sidebar nav a:hover {
		background-color: #e4e6eb;
	}

	/* --- GÜNCELLENEN STILLER --- */
	.sidebar-footer {
		margin-top: 1.5rem; /* Üstteki menü ile arayı açar */
	}
	
	.admin-sidebar .back-to-site {
		text-decoration: none;
		color: #606770; /* Diğerlerinden biraz daha soluk renk */
		padding: 0.7rem; /* Diğer linklerle aynı padding */
		border-radius: 6px; /* Diğer linklerle aynı köşe yuvarlatma */
		font-weight: 500; /* Diğer linklerle aynı font ağırlığı */
		display: block; /* Padding'in düzgün uygulanması için */
	}

	.admin-sidebar .nav-hr {
		border: none;
		border-top: 1px solid #ddd;
		/* Linkler arası boşluk (gap) ile hizalanması için ayar */
		margin: 0.8rem 0 0 0; 
	}

	.admin-sidebar .back-to-site {
		/* padding-top: 2rem; stilini kaldırın */
		text-decoration: none;
		color: #606770;
		padding: 0.7rem; /* Diğerleriyle aynı */
		border-radius: 6px; /* Diğerleriyle aynı */
		font-weight: 500; /* Diğerleriyle aynı */
		display: block; /* Padding'in uygulanması için */
	}

	.admin-sidebar .back-to-site:hover {
		background-color: #e4e6eb; /* Diğer linklerle aynı hover efekti */
	}
	/* --- GÜNCELLEME SONU --- */

	.admin-content {
		flex-grow: 1;
		padding: 2rem;
		overflow-y: auto;
	}
</style>
