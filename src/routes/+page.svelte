<script lang="ts">
	// Bu satır, +page.ts'den gelen verileri bu bileşene aktarır.
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<main>
	<h1>Aktif İlanlar</h1>

	{#if data.error}
		<p class="error">{data.error}</p>
	{/if}

	{#if data.listings && data.listings.length > 0}
        <div class="listings-grid">
            {#each data.listings as listing (listing.id)}
                <a href="/listings/{listing.id}" class="card-link">
                    <div class="card">
                        <h2>{listing.item_name}</h2>
                        <p>{listing.description}</p>
                        <div class="price">{listing.price} TL</div>
                    </div>
                </a>
            {/each}
        </div>
	{:else}
		<p>Şu anda gösterilecek aktif bir ilan bulunmuyor.</p>
	{/if}
</main>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: #f0f2f5;
		color: #1c1e21;
		margin: 0;
	}

	main {
		max-width: 900px;
		margin: 2rem auto;
		padding: 1rem;
	}

	h1 {
		color: #1877f2;
		border-bottom: 2px solid #ccc;
		padding-bottom: 0.5rem;
	}

	.listings-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}

	.card {
		background-color: #fff;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
	}

	.card h2 {
		font-size: 1.1rem;
		margin: 0 0 0.5rem 0;
	}
	
	.card p {
		flex-grow: 1;
		font-size: 0.9rem;
		color: #606770;
		margin-bottom: 1rem;
	}

    .card-link {
        text-decoration: none;
        color: inherit;
    }

	.price {
		font-size: 1.2rem;
		font-weight: bold;
		color: #333;
		align-self: flex-end;
	}

	.error {
		color: red;
		background-color: #ffebee;
		padding: 1rem;
		border-radius: 8px;
	}
</style>