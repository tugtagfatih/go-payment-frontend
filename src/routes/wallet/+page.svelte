<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

    // İşlem tiplerini daha okunaklı hale getirmek için bir yardımcı fonksiyon
    function formatTransactionType(type: string): string {
        const types: { [key: string]: string } = {
            'deposit': 'Para Yatırma',
            'withdrawal': 'Para Çekme',
            'purchase': 'Ürün Alımı',
            'sale': 'Ürün Satışı'
        };
        return types[type] || type;
    }
</script>

<main class="wallet-container">
	<h1>Cüzdanım</h1>

	{#if data.wallet}
		<div class="balance-card">
			<span class="label">Mevcut Bakiye</span>
			<span class="balance">{data.wallet.balance.toFixed(2)} TL</span>
		</div>

		<div class="action-buttons">
			<a href="/wallet/deposit" class="action-button deposit">Para Yükle</a>
			<a href="/wallet/withdraw" class="action-button withdraw">Para Çek</a>
		</div>

        <div class="history-section">
            <h2>Son İşlemler</h2>
            {#if data.transactionHistory && data.transactionHistory.length > 0}
                <ul class="history-list">
                    {#each data.transactionHistory as tx (tx.id)}
                        <li class="history-item" class:completed={tx.status === 'completed'} class:rejected={tx.status === 'rejected'}>
                            <div class="item-details">
                                <span class="item-type">{formatTransactionType(tx.type)}</span>
                                <span class="item-date">{new Date(tx.created_at).toLocaleString()}</span>
                            </div>
                            <div class="item-amount" class:positive={tx.amount > 0} class:negative={tx.amount < 0}>
                                {tx.amount.toFixed(2)} TL
                            </div>
                        </li>
                    {/each}
                </ul>
            {:else}
                <p>Henüz bir işlem geçmişiniz bulunmuyor.</p>
            {/if}
        </div>

	{:else if data.error}
		<p class="error">{data.error}</p>
	{/if}
</main>

<style>
	.wallet-container {
		max-width: 600px;
		margin: 2rem auto;
		padding: 1rem;
	}
	.balance-card {
		background: #fff;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		text-align: center;
		margin-bottom: 2rem;
	}
	.label {
		display: block;
		font-size: 1rem;
		color: #606770;
	}
	.balance {
		display: block;
		font-size: 2.5rem;
		font-weight: bold;
		color: #1c1e21;
		margin-top: 0.5rem;
	}
	.action-buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	.action-button {
		display: block;
		width: 100%;
		padding: 1rem;
		color: white;
		text-align: center;
		text-decoration: none;
		font-size: 1.2rem;
		font-weight: bold;
		border-radius: 6px;
		transition: background-color 0.2s;
	}
	.deposit {
		background-color: #42b72a;
	}
	.deposit:hover {
		background-color: #36a420;
	}
	.withdraw {
		background-color: #f0ad4e;
	}
	.withdraw:hover {
		background-color: #ec971f;
	}

    /* YENİ EKLENEN İŞLEM GEÇMİŞİ STİLLERİ */
    .history-section {
        margin-top: 3rem;
    }
    .history-list {
        list-style: none;
        padding: 0;
    }
    .history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 0.5rem;
        background-color: #f0f2f5;
    }
    .item-details {
        display: flex;
        flex-direction: column;
    }
    .item-type {
        font-weight: 500;
    }
    .item-date {
        font-size: 0.8rem;
        color: #606770;
    }
    .item-amount {
        font-weight: bold;
        font-size: 1.1rem;
    }
    /* Renklendirme */
    .positive { color: #2e7d32; } /* Yeşil */
    .negative { color: #c62828; } /* Kırmızı */

    /* Durum Renkleri */
    .history-item.completed {
        border-left: 5px solid #42b72a; /* Yeşil bar */
    }
    .history-item.rejected {
        border-left: 5px solid #d9534f; /* Kırmızı bar */
        background-color: #fdeeee;
        opacity: 0.8;
    }
</style>