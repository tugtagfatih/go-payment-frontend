<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	// İşlem tiplerini daha okunaklı hale getirmek için bir yardımcı fonksiyon
	function formatTransactionType(type: string): string {
		const types: { [key: string]: string } = {
			deposit: 'Para Yatırma',
			withdrawal: 'Para Çekme',
			purchase: 'Ürün Alımı',
			sale: 'Ürün Satışı'
		};
		return types[type] || type;
	}
</script>

<svelte:head>
	<title>Cüzdanım - GoPay</title>
	<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
</svelte:head>

<main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="max-w-4xl mx-auto">
		{#if data.wallet}
			<div class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6 md:p-8 mb-8">
				<p class="text-subtle-light dark:text-subtle-dark text-sm font-medium mb-2">
					Mevcut Bakiye
				</p>
				<p class="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
					{data.wallet.balance.toFixed(2)} ₺
				</p>
				<div class="flex flex-col sm:flex-row gap-4">
					<a
						href="/wallet/deposit"
						class="flex-1 flex items-center justify-center gap-2 bg-success hover:bg-success/90 text-white font-bold py-3 px-4 rounded-lg transition-colors"
					>
						<span class="material-symbols-outlined">add_circle</span>
						<span>Para Yükle</span>
					</a>
					<a
						href="/wallet/withdraw"
						class="flex-1 flex items-center justify-center gap-2 bg-warning hover:bg-warning/90 text-white font-bold py-3 px-4 rounded-lg transition-colors"
					>
						<span class="material-symbols-outlined">remove_circle</span>
						<span>Para Çek</span>
					</a>
				</div>
			</div>

			<h2 class="text-2xl font-bold tracking-tight mb-4">Son İşlemler</h2>
			<div class="space-y-4">
				{#if data.transactionHistory && data.transactionHistory.length > 0}
					{#each data.transactionHistory as tx (tx.id)}
						<div class="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm relative overflow-hidden">
							<div class="flex items-center gap-4">
								{#if tx.amount > 0}
									<div
										class="bg-success/10 text-success size-10 rounded-full flex items-center justify-center shrink-0"
									>
										<span class="material-symbols-outlined">south_west</span>
									</div>
								{:else if tx.type === 'withdrawal'}
									<div
										class="bg-warning/10 text-warning size-10 rounded-full flex items-center justify-center shrink-0"
									>
										<span class="material-symbols-outlined">north_east</span>
									</div>
								{:else}
									<div
										class="bg-danger/10 text-danger size-10 rounded-full flex items-center justify-center shrink-0"
									>
										<span class="material-symbols-outlined">north_east</span>
									</div>
								{/if}

								<div class="flex-grow">
									<p class="font-semibold">{formatTransactionType(tx.type)}</p>
									<p class="text-sm text-subtle-light dark:text-subtle-dark">
										{new Date(tx.created_at).toLocaleString()}
									</p>
								</div>

								<p
									class="font-semibold"
									class:text-success={tx.amount > 0}
									class:text-danger={tx.amount < 0 && tx.type !== 'withdrawal'}
									class:text-warning={tx.type === 'withdrawal'}
								>
									{tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} ₺
								</p>
							</div>
							{#if ['pending', 'rejected', 'completed', 'approved'].includes(tx.status)}
								<div class="absolute bottom-0 left-0 right-0 h-1">
									<div
										class="h-full rounded-b-lg"
										class:bg-success={tx.status === 'completed' || tx.status === 'approved'}
										class:bg-danger={tx.status === 'rejected'}
										class:bg-warning={tx.status === 'pending'}
										style="width: 100%;"
									/>
								</div>
							{/if}
						</div>
					{/each}
				{:else}
					<p class="text-subtle-light dark:text-subtle-dark text-center py-4">
						Henüz bir işlem geçmişiniz bulunmuyor.
					</p>
				{/if}
			</div>
		{:else if data.error}
			<div class="bg-danger/10 text-danger p-4 rounded-lg">
				<p>{data.error}</p>
			</div>
		{:else}
			<p class="text-subtle-light dark:text-subtle-dark text-center py-10">
				Cüzdan bilgileri yükleniyor...
			</p>
		{/if}
	</div>
</main>

<style>
	/* Önceki stiller Tailwind ile değiştirildiği için kaldırıldı */
</style>