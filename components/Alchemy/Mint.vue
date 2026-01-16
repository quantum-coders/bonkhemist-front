<template>
	<div class="mint-wrapper">
		<div class="mint-modal">
			<a href="#" class="close" @click="ready">
				<img src="/images/close.png" alt="">
			</a>

			<div class="frame-top"></div>
			<div class="frame-bottom"></div>
			<div class="frame-left"></div>
			<div class="frame-right"></div>
			<img class="frame-lb" src="/images/combining-left-bottom.png" alt="">
			<img class="frame-rb" src="/images/combining-right-bottom.png" alt="">
			<img class="frame-lt" src="/images/combining-left-top.png" alt="">
			<img class="frame-rt" src="/images/combining-right-top.png" alt="">

			<div class="modal-content text-center">

				<template v-if="!alchemy.justMinted">

					<h4>Mint your NFT right now!</h4>

					<p>Select your payment token <strong>(~${{ priceInfo?.usd || 5 }} USD)</strong></p>

					<div class="token-options" v-if="priceInfo">
						<button
							v-for="token in ['SOL', 'BONK', 'WIF']"
							:key="token"
							class="token-option"
							:class="{ selected: selectedToken === token }"
							@click="selectedToken = token"
						>
							<img :src="getTokenIcon(token)" class="token-icon" :alt="token">
							<span class="token-amount">{{ priceInfo.allPrices?.[token]?.formatted || '...' }}</span>
						</button>
					</div>

					<p class="mt-3">Hurry, this element can only be minted once!</p>
					<p class="mb-4">Element to mint:</p>
					<p class="element-to-mint">
						<alchemy-element class="d-inline-block" :element="{ name: alchemy.elementToMint.name }"/>
					</p>
					<a href="#" @click.prevent="mintElement" :class="{'mint-button': true, 'mint-button disabled-button': loading}" class="mint-button">
						<span v-if="!loading">Mint with {{ selectedToken }}</span>
						<div v-if="loading" class="spinner-border text-primary loading-effect" role="status"
							>
							<span class="visually-hidden">Loading...</span>
						</div>
					</a>
				</template>

				<template v-else>
					<h4>Minted!</h4>
					<p>Your <strong>
						<alchemy-animated-text text="incredible, alchemical NFT"/>
					</strong> has been minted!
					</p>

					<!-- NFT Card Display -->
					<div class="nft-card" v-if="mintedNft">
						<div class="nft-card-inner">
							<div class="nft-image-wrapper">
								<img :src="mintedNft.image" :alt="mintedNft.name" class="nft-image" />
							</div>
							<div class="nft-info">
								<h5 class="nft-name">{{ mintedNft.name }}</h5>
								<span class="nft-badge">First Discovery</span>
							</div>
						</div>
					</div>

					<div class="mint-actions">
						<a v-if="mintedNft?.mintAddress" :href="`https://solscan.io/token/${mintedNft.mintAddress}`" target="_blank" class="mint-button">View NFT</a>
						<a :href="mintedTransaction" target="_blank" class="mint-button secondary">View TX</a>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	Connection,
	Transaction,
} from '@solana/web3.js';
import {useWallet} from "solana-wallets-vue";

const emit = defineEmits(['ready']);
const alchemy = useAlchemyStore();
const config = useRuntimeConfig();
const {errorToast, successToast} = usePrettyToast();
const mintedTransaction = ref(null);
const mintedNft = ref(null);
const loading = ref(false);
const priceInfo = ref(null);
const selectedToken = ref('BONK');

const ready = () => {
	alchemy.mintSuggestions = [];
	emit('ready');
};

// Token icons
const getTokenIcon = (token) => {
	const icons = {
		SOL: '/images/solana.png',
		BONK: '/images/bonk.png',
		WIF: '/images/dogwifhat-wif-logo.png'
	};
	return icons[token] || '/images/bonk.png';
};

// Fetch mint price on mount
const fetchMintPrice = async () => {
	try {
		const res = await fetch(`${config.public.apiUrl}/nfts/mint-price`);
		if (res.ok) {
			const data = await res.json();
			priceInfo.value = data.data;
		}
	} catch (error) {
		console.error('Error fetching mint price:', error);
	}
};

const getWalletProvider = () => {
	const walletName = useWallet().wallet.value?.adapter?.name?.toLowerCase();
	if (walletName === 'backpack') return window.backpack;
	if (walletName === 'solana' || walletName === 'phantom') return window.solana;
	if (walletName === 'solflare') return window.solflare;
	return null;
};

// Mint element using selected token
const mintElement = async () => {
	const accessToken = localStorage.getItem('accessToken');
	const provider = getWalletProvider();

	if (!provider) {
		errorToast('Please connect your wallet first');
		return;
	}

	loading.value = true;
	mintedTransaction.value = null;

	try {
		// Step 1: Prepare the token transfer transaction
		const prepareRes = await fetch(`${config.public.apiUrl}/nfts/mint-discovery/prepare`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				elementSlug: alchemy.elementToMint.slug,
				paymentToken: selectedToken.value
			})
		});

		if (!prepareRes.ok) {
			const errorData = await prepareRes.json();
			throw new Error(errorData.message || 'Failed to prepare transaction');
		}

		const prepareData = await prepareRes.json();

		// Step 2: Sign transaction with wallet
		const { Buffer } = await import('buffer');
		window.Buffer = Buffer;

		const connection = new Connection(config.public.SOLANA_RPC_URL, 'confirmed');
		const transaction = Transaction.from(Buffer.from(prepareData.data.transaction, 'base64'));

		const signedTx = await provider.signAndSendTransaction(transaction);
		const signature = signedTx.signature || signedTx;

		await connection.confirmTransaction(signature, 'confirmed');

		// Step 3: Complete the mint
		const completeRes = await fetch(`${config.public.apiUrl}/nfts/mint-discovery/complete`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				elementSlug: alchemy.elementToMint.slug,
				transactionSignature: signature
			})
		});

		if (!completeRes.ok) {
			const errorData = await completeRes.json();
			throw new Error(errorData.message || 'Failed to complete mint');
		}

		const completeData = await completeRes.json();

		// Success! Store the minted NFT data
		alchemy.justMinted = true;
		// Use mint signature for Solscan link (the actual NFT mint tx)
		const mintSig = completeData.data?.mintSignature || completeData.data?.nft?.transactionHash;
		mintedTransaction.value = `https://solscan.io/tx/${mintSig}`;
		mintedNft.value = {
			name: completeData.data?.nft?.name || `Bonkhemist: ${alchemy.elementToMint.name}`,
			image: completeData.data?.image || completeData.data?.nft?.image,
			element: completeData.data?.element,
			mintAddress: completeData.data?.mintAddress || completeData.data?.nft?.mintAddress
		};
		successToast('NFT minted successfully!');

		// Refresh NFTs
		await alchemy.fetchNFTs();

	} catch (error) {
		console.error('Minting error:', error);
		errorToast(error.message || 'Minting failed');
	} finally {
		loading.value = false;
	}
};

onMounted(async () => {
	await fetchMintPrice();
});
</script>

<style lang="sass" scoped>
.loading-effect
	width: 1rem
	height: 1rem
	border-width: 2px
	margin: 0 auto
	display: block
.element-to-mint
	transform: scale(1.5)

// NFT Card Styles
.nft-card
	margin: 1rem 0
	perspective: 1000px

.nft-card-inner
	background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)
	border: 3px solid #59CF93
	border-radius: 12px
	padding: 0.75rem
	box-shadow: 0 0 20px rgba(89, 207, 147, 0.3), inset 0 0 20px rgba(89, 207, 147, 0.1)
	max-width: 200px
	margin: 0 auto
	animation: cardAppear 0.5s ease-out

@keyframes cardAppear
	0%
		transform: scale(0.8) rotateY(-10deg)
		opacity: 0
	100%
		transform: scale(1) rotateY(0deg)
		opacity: 1

.nft-image-wrapper
	background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)
	border: 2px solid #333
	border-radius: 8px
	padding: 4px
	margin-bottom: 0.5rem

.nft-image
	width: 100%
	height: auto
	border-radius: 4px
	image-rendering: pixelated
	display: block

.nft-info
	text-align: center

.nft-name
	color: #59CF93
	font-size: 10px
	margin: 0 0 0.25rem 0
	text-shadow: 0 0 10px rgba(89, 207, 147, 0.5)

.nft-badge
	display: inline-block
	background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%)
	color: #1a1a2e
	font-size: 7px
	padding: 2px 6px
	border-radius: 4px
	font-weight: bold
	text-transform: uppercase

.mint-actions
	margin-top: 1rem
	display: flex
	gap: 0.5rem
	justify-content: center

	.secondary
		background: #333
		color: white
		border-color: #333

		&:hover
			background: #555
			border-color: #555
			outline-color: #555

.token-options
	display: flex
	gap: 0.5rem
	justify-content: center
	margin: 1rem 0

.token-option
	display: flex
	flex-direction: column
	align-items: center
	gap: 0.25rem
	padding: 0.5rem 0.75rem
	background: #f5f5f5
	border: 2px solid #ddd
	border-radius: 8px
	cursor: pointer
	transition: all 0.2s
	min-width: 80px

	&:hover
		border-color: #999
		background: #eee

	&.selected
		border-color: #59CF93
		background: rgba(89, 207, 147, 0.15)
		box-shadow: 0 0 10px rgba(89, 207, 147, 0.3)

	.token-icon
		width: 24px
		height: 24px
		image-rendering: pixelated

	.token-amount
		font-family: 'Silkscreen', sans-serif
		font-size: 8px
		color: #333
		text-align: center

.disabled-button
	pointer-events: none
	opacity: 0.5
.mint-button
	border: 2px solid black
	padding: 0.25rem 1rem
	cursor: pointer
	text-decoration: none
	color: black
	background: white
	font-size: 12px
	font-family: Silkscreen, sans-serif
	transition: background 0.3s, color 0.3s

	&:hover
		background: #59CF93
		color: white
		border-color: white
		outline: 2px solid #59CF93

.modal-content
	strong
		color: #59CF93

.mint-wrapper
	display: flex
	justify-content: center
	align-items: center
	flex-direction: column
	font-family: Silkscreen, sans-serif
	position: absolute
	left: 0
	top: 36px
	width: 100%
	height: calc(100% - 36px)
	z-index: 10
	background: rgba(white, 0.5)

	.close
		position: absolute
		right: 2rem
		top: 1.5rem
		cursor: pointer
		z-index: 100

		img
			width: 10px
			height: 10px
			image-rendering: pixelated

	.mint-modal
		position: absolute
		top: 50%
		left: 50%
		width: 70%
		min-height: 310px
		padding: 2rem
		background: white
		z-index: 1
		margin-left: -35%
		margin-top: -155px
		display: flex
		flex-direction: column
		justify-content: center
		align-items: center

		.frame-top
			position: absolute
			top: 0
			left: 18px
			width: calc(100% - 18px - 18px)
			height: 18px
			background: url('/images/combining-top.png') repeat-x
			background-size: auto 100%
			image-rendering: pixelated
			z-index: 0

		.frame-bottom
			position: absolute
			bottom: 0
			left: 18px
			width: calc(100% - 18px - 18px)
			height: 18px
			background: url('/images/combining-bottom.png') repeat-x
			background-size: auto 100%
			image-rendering: pixelated
			z-index: 0

		.frame-left
			position: absolute
			top: 18px
			left: 0
			width: 18px
			height: calc(100% - 18px - 18px)
			background: url('/images/combining-left.png') repeat-y
			background-size: 100% auto
			image-rendering: pixelated
			z-index: 0

		.frame-right
			position: absolute
			top: 18px
			right: 0
			width: 18px
			height: calc(100% - 18px - 18px)
			background: url('/images/combining-right.png') repeat-y
			background-size: 100% auto
			image-rendering: pixelated
			z-index: 0

		.frame-lb
			position: absolute
			bottom: 0
			left: 0
			z-index: 1
			width: 18px
			height: 18px
			image-rendering: pixelated

		.frame-rb
			position: absolute
			bottom: 0
			right: 0
			z-index: 1
			width: 18px
			height: 18px
			image-rendering: pixelated

		.frame-lt
			position: absolute
			top: 0
			left: 0
			z-index: 1
			width: 18px
			height: 18px
			image-rendering: pixelated

		.frame-rt
			position: absolute
			top: 0
			right: 0
			z-index: 1
			width: 18px
			height: 18px
			image-rendering: pixelated

		.mint
			display: flex
			justify-content: space-around
			flex-wrap: wrap
			gap: 1rem
			margin-top: 1rem

			.element
				flex-basis: calc(50% - 2rem)
</style>