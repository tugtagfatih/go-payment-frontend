<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<main class="wallet-container">
	<h1>Cüzdanım</h1>

	{#if data.wallet}
		<div class="balance-card">
			<span class="label">Mevcut Bakiye</span>
			<span class="balance">{data.wallet.balance.toFixed(2)} TL</span>
		</div>
		<a href="/wallet/deposit" class="deposit-button">Para Yükle</a>
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
	.deposit-button {
		display: block;
		width: 100%;
		padding: 1rem;
		background-color: #42b72a;
		color: white;
		text-align: center;
		text-decoration: none;
		font-size: 1.2rem;
		font-weight: bold;
		border-radius: 6px;
		transition: background-color 0.2s;
	}
	.deposit-button:hover {
		background-color: #36a420;
	}
</style>