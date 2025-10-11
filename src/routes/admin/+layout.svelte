<div class="admin-layout">
    <aside class="admin-sidebar">
        <h2>Admin Paneli</h2>
        <nav>
            <a href="/admin/notifications">Ödeme Bildirimleri</a>
            <a href="/admin/withdrawals">Para Çekme Talepleri</a>
            <a href="/admin/roles">Rol Yönetimi</a>
            <a href="/admin/users">Kullanıcı Banlama</a>
        </nav>
        <hr/>
        <a href="/" class="back-to-site">← Ana Siteye Dön</a>
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
    .admin-sidebar .back-to-site {
        padding-top: 2rem;
        text-decoration: none;
        color: #606770;
    }
    .admin-content {
        flex-grow: 1;
        padding: 2rem;
        overflow-y: auto;
    }
</style>