<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
    <title>Ana Sayfa - GoPay</title>
    <meta name="description" content="Aktif ilanları görüntüleyin." />
    </svelte:head>

<main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="max-w-4xl mx-auto">

        <h1 class="text-3xl font-bold tracking-tight mb-6">Aktif İlanlar</h1>

        {#if data.error}
            <div class="bg-danger/10 text-danger p-4 rounded-lg mb-6">
                <p>İlanlar yüklenirken bir hata oluştu: {data.error}</p>
            </div>
        {/if}

        <div class="space-y-4">
            {#if data.listings && data.listings.length > 0}
                {#each data.listings as listing (listing.id)}
                    <a href="/listings/{listing.id}" class="block bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                        <div class="p-4 sm:p-6">
                            <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                <h2 class="text-lg font-semibold text-text-light dark:text-text-dark truncate">{listing.item_name}</h2>
                                <span class="text-lg font-bold text-primary whitespace-nowrap">{listing.price.toFixed(2)} ₺</span>
                            </div>
                            <p class="mt-2 text-sm text-subtle-light dark:text-subtle-dark line-clamp-2">{listing.description || 'Açıklama yok.'}</p>
                            <p class="mt-3 text-xs text-subtle-light dark:text-subtle-dark">Yayınlanma: {new Date(listing.created_at).toLocaleDateString()}</p>
                        </div>
                    </a>
                {/each}
            {:else if !data.error}
                <div class="text-center py-10 bg-surface-light dark:bg-surface-dark rounded-xl">
                    <p class="text-subtle-light dark:text-subtle-dark">Gösterilecek aktif ilan bulunmuyor.</p>
                    <a href="/listings/new" class="mt-4 inline-block bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        İlk İlanı Sen Oluştur!
                    </a>
                </div>
            {/if}
        </div>

	</div>
</main>

<style>
/* İsterseniz ek CSS stilleri ekleyebilirsiniz, ancak Tailwind sınıfları çoğu şeyi halletmeli */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>