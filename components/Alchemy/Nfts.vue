<template>
	<div class="nft-container">
		<div v-if="alchemy.nfts.length === 0" class="empty">
			<img src="/images/doge.png" alt="Empty" class="doge">
			<p class="wow">Wow, such empty</p>
			<p>Mint any element to start your collection!</p>
		</div>
		<div v-else class="nft-grid">
			<div class="nft-card" v-for="nft in alchemy.nfts" :key="nft.mintAddress">
				<img :src="nft.metadata.image" class="nft-image" alt="NFT Image">
				<h3>{{ nft.name }}</h3>
				<p>{{ nft.metadata.description }}</p>
				<div class="actions">
					<button class="nft-btn" @click="goToSolscan(nft.address)">View on Solscan</button>
<!--
					<button class="nft-btn" @click="addToWallet(nft.mintAddress)">Add to Wallet</button>
-->
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>

import {useWallet} from "solana-wallets-vue";

const alchemy = useAlchemyStore();

const goToSolscan = (mintAddress) => {
	window.open(`https://solscan.io/token/${mintAddress}`, '_blank');
};

const addToWallet = (mintAddress) => {
	const {publicKey, sendTransaction} = useWallet();
	const wallet = publicKey.value.toBase58();

};
</script>

<style scoped lang="sass">
.nft-container
	display: flex
	flex-direction: column
	align-items: center
	justify-content: center
	font-family: 'Silkscreen', sans-serif

.empty
	display: flex
	flex-direction: column
	align-items: center
	justify-content: center

	.doge
		width: 54px
		height: 50px
		image-rendering: pixelated

.nft-grid
	display: grid
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))
	gap: 20px
	padding: 20px

.nft-card
	background: #FFF3
	padding: 20px
	border: 3px solid #000
	border-radius: 10px
	text-align: center

	.nft-image
		width: 100%
		height: auto
		border-radius: 5px
		image-rendering: pixelated

.actions
	margin-top: 10px
	padding: 10px
	display: flex
	justify-content: center
	flex-direction: row

	button
		background: #59CF93
		border: none
		color: white
		padding: 10px
		border-radius: 5px
		cursor: pointer
		margin-right: 10px

		&:hover
			background: #4CB882

.nft-btn
	background: #59CF93
	border: none
	color: white
	padding-bottom: 50px
	cursor: pointer
	margin-right: 10px

	&:hover
		background: #4CB882
</style>
