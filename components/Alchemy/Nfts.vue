<template>
	<div class="nft-container">
		<div v-if="alchemy.nfts.length === 0" class="empty">
			<img src="/images/doge.png" alt="Empty" class="doge">
			<p class="wow">{{ $t('nfts.wowEmpty') }}</p>
			<p>{{ $t('nfts.mintToStart') }}</p>
		</div>
		<div v-else class="nft-grid">
			<div class="nft-card" v-for="nft in alchemy.nfts" :key="nft.address">
				<img :src="getNftImage(nft)" class="nft-image" alt="NFT Image">
				<h3>{{ nft.name }}</h3>
				<p>{{ getNftDescription(nft) }}</p>
				<div class="actions">
					<button class="nft-btn solscan" @click="goToSolscan(nft.address)">
						Solscan
					</button>
				</div>
				<div class="marketplace-actions">
					<span class="marketplace-label">{{ $t('nfts.sellOn') }}</span>
					<div class="marketplace-buttons">
						<button class="marketplace-btn magic-eden" @click="goToMagicEden(nft.address)">
							Magic Eden
						</button>
						<button class="marketplace-btn tensor" @click="goToTensor(nft.address)">
							Tensor
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useWallet } from "solana-wallets-vue";

const alchemy = useAlchemyStore();

// Get image URL from NFT on-chain metadata
const getNftImage = (nft) => {
	return nft.metadata?.image || '/images/nft-placeholder.png';
};

// Get description from NFT on-chain metadata
const getNftDescription = (nft) => {
	return nft.metadata?.description || '';
};

const goToSolscan = (address) => {
	window.open(`https://solscan.io/token/${address}`, '_blank');
};

const goToMagicEden = (address) => {
	window.open(`https://magiceden.io/item-details/${address}`, '_blank');
};

const goToTensor = (address) => {
	window.open(`https://www.tensor.trade/item/${address}`, '_blank');
};

onMounted(async () => {
	await alchemy.fetchNFTs();
});

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

	h3
		margin: 10px 0 5px
		font-size: 14px
		color: #333

	p
		font-size: 10px
		color: #666
		margin-bottom: 10px

	.nft-image
		width: 100%
		height: auto
		border-radius: 5px
		image-rendering: pixelated

.actions
	margin-top: 10px
	display: flex
	justify-content: center

.nft-btn
	display: flex
	align-items: center
	justify-content: center
	gap: 6px
	background: #14F195
	border: 2px solid #000
	color: #000
	padding: 8px 12px
	border-radius: 6px
	cursor: pointer
	font-family: 'Silkscreen', sans-serif
	font-size: 10px
	transition: all 0.2s

	&:hover
		background: #0fd17f
		transform: translateY(-2px)

	&.solscan
		background: #14F195

.marketplace-actions
	margin-top: 12px
	padding-top: 12px
	border-top: 2px dashed #0003

	.marketplace-label
		display: block
		font-size: 9px
		color: #666
		margin-bottom: 8px
		text-transform: uppercase

	.marketplace-buttons
		display: flex
		gap: 8px
		justify-content: center

.marketplace-btn
	display: flex
	align-items: center
	justify-content: center
	gap: 5px
	padding: 8px 10px
	border: 2px solid #333
	border-radius: 6px
	cursor: pointer
	font-family: 'Silkscreen', sans-serif
	font-size: 9px
	transition: all 0.2s
	flex: 1

	&.magic-eden
		background: linear-gradient(135deg, #e42575 0%, #a91b60 100%)
		color: white
		border-color: #a91b60

		&:hover
			background: linear-gradient(135deg, #f52d82 0%, #c41f6e 100%)
			transform: translateY(-2px)
			box-shadow: 0 4px 12px rgba(228, 37, 117, 0.4)

	&.tensor
		background: linear-gradient(135deg, #00d18c 0%, #00a06b 100%)
		color: white
		border-color: #00a06b

		&:hover
			background: linear-gradient(135deg, #00e89b 0%, #00b87a 100%)
			transform: translateY(-2px)
			box-shadow: 0 4px 12px rgba(0, 209, 140, 0.4)
</style>
