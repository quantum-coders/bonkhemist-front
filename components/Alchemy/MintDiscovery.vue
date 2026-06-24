<template>
	<div class="mint-discovery-wrapper">
		<div class="mint-discovery-modal" :class="{ 'minting': isMinting, 'success': mintSuccess }">
			<a href="#" class="close" @click.prevent="closeModal" v-if="!isMinting">
				<img src="/images/close.png" alt="">
			</a>

			<!-- Pixelated Frame -->
			<div class="frame-top"></div>
			<div class="frame-bottom"></div>
			<div class="frame-left"></div>
			<div class="frame-right"></div>
			<img class="frame-lb" src="/images/combining-left-bottom.png" alt="">
			<img class="frame-rb" src="/images/combining-right-bottom.png" alt="">
			<img class="frame-lt" src="/images/combining-left-top.png" alt="">
			<img class="frame-rt" src="/images/combining-right-top.png" alt="">

			<div class="modal-content text-center">
				<!-- Initial State: First Discovery Available -->
				<template v-if="!isMinting && !mintSuccess && !mintError">
					<div class="discovery-badge">
						<span class="badge-glow"></span>
						<span class="badge-text">{{ $t('mintDiscovery.firstDiscovery') }}</span>
					</div>

					<h4 class="title-animated">
						<alchemy-animated-text :text="$t('mintDiscovery.beTheFirst')"/>
					</h4>

					<i18n-t keypath="mintDiscovery.youDiscovered" tag="p" class="subtitle">
						<template #name>
							<strong>{{ element?.name }}</strong>
						</template>
					</i18n-t>

					<p class="element-preview">
						<alchemy-element class="d-inline-block element-bounce" :element="{ name: element?.name }"/>
					</p>

					<div class="price-section" v-if="priceInfo">
						<p class="price-label">{{ $t('mintDiscovery.selectPaymentToken', { usd: priceInfo.usd }) }}</p>
						<div class="token-options">
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
					</div>

					<div class="info-box">
						<p>{{ $t('mintDiscovery.nftWillFeature') }}</p>
						<ul>
							<li>{{ $t('mintDiscovery.featurePixelArt') }}</li>
							<li>{{ $t('mintDiscovery.featureWatermark') }}</li>
							<li>{{ $t('mintDiscovery.featureDiscovererBadge') }}</li>
							<li>{{ $t('mintDiscovery.featureBlockchain') }}</li>
						</ul>
					</div>

					<button
						@click="startMinting"
						class="mint-button pulse-animation"
						:disabled="loading"
					>
						<span v-if="!loading">{{ $t('mintDiscovery.mintNow') }}</span>
						<div v-else class="spinner-border text-primary" role="status">
							<span class="visually-hidden">{{ $t('common.loading') }}</span>
						</div>
					</button>
				</template>

				<!-- Minting State: Progress Animation -->
				<template v-if="isMinting">
					<div class="minting-progress">
						<div class="progress-icon">
							<div class="spinner-large"></div>
						</div>
						<h4 class="minting-title">
							<alchemy-animated-text :text="currentStep"/>
						</h4>
						<div class="progress-steps">
							<div class="step" :class="{ active: stepIndex >= 1, done: stepIndex > 1 }">
								<span class="step-dot"></span>
								<span class="step-label">{{ $t('mintDiscovery.stepPreparing') }}</span>
							</div>
							<div class="step" :class="{ active: stepIndex >= 2, done: stepIndex > 2 }">
								<span class="step-dot"></span>
								<span class="step-label">{{ $t('mintDiscovery.stepSigning', { token: selectedToken }) }}</span>
							</div>
							<div class="step" :class="{ active: stepIndex >= 3, done: stepIndex > 3 }">
								<span class="step-dot"></span>
								<span class="step-label">{{ $t('mintDiscovery.stepGenerating') }}</span>
							</div>
							<div class="step" :class="{ active: stepIndex >= 4, done: stepIndex > 4 }">
								<span class="step-dot"></span>
								<span class="step-label">{{ $t('mintDiscovery.stepCreating') }}</span>
							</div>
						</div>
					</div>
				</template>

				<!-- Success State -->
				<template v-if="mintSuccess">
					<div class="success-content">
						<div class="success-badge">
							<span class="checkmark">&#10003;</span>
						</div>
						<h4 class="success-title">
							<alchemy-animated-text :text="$t('mintDiscovery.nftMinted')"/>
						</h4>
						<p class="success-subtitle">{{ $t('mintDiscovery.firstOwner') }}</p>

						<div class="nft-preview" v-if="mintResult?.image">
							<img :src="mintResult.image" :alt="mintResult?.element?.name" class="nft-image">
						</div>

						<p class="nft-name">{{ mintResult?.element?.name }}</p>

						<!-- Marketplace Links -->
						<div class="marketplace-section" v-if="mintResult?.mintAddress">
							<p class="marketplace-label">{{ $t('mintDiscovery.tradeOn') }}</p>
							<div class="marketplace-links">
								<a
									:href="`https://magiceden.io/item-details/${mintResult.mintAddress}`"
									target="_blank"
									class="marketplace-link magic-eden"
								>
									{{ $t('mintDiscovery.magicEden') }}
								</a>
								<a
									:href="`https://www.tensor.trade/item/${mintResult.mintAddress}`"
									target="_blank"
									class="marketplace-link tensor"
								>
									{{ $t('mintDiscovery.tensor') }}
								</a>
							</div>
						</div>

						<div class="success-actions">
							<a
								v-if="mintResult?.transactionSignature"
								:href="`https://solscan.io/tx/${mintResult.transactionSignature}`"
								target="_blank"
								class="action-button secondary"
							>
								{{ $t('mintDiscovery.viewTransaction') }}
							</a>
							<button @click="closeModal" class="action-button primary">
								{{ $t('mintDiscovery.continuePlaying') }}
							</button>
						</div>
					</div>
				</template>

				<!-- Error State -->
				<template v-if="mintError">
					<div class="error-content">
						<div class="error-icon">!</div>
						<h4>{{ $t('mintDiscovery.mintingFailed') }}</h4>
						<p class="error-message">{{ mintError }}</p>
						<button @click="resetState" class="mint-button">
							{{ $t('mintDiscovery.tryAgain') }}
						</button>
					</div>
				</template>
			</div>
		</div>

		<!-- Backdrop with particles -->
		<div class="backdrop" :class="{ 'celebrating': mintSuccess }">
			<div class="particle" v-for="n in 20" :key="n" :style="getParticleStyle(n)"></div>
		</div>
	</div>
</template>

<script setup>
import { useWallet } from 'solana-wallets-vue';
import { Connection, Transaction } from '@solana/web3.js';

const props = defineProps({
	element: {
		type: Object,
		required: true
	}
});

const emit = defineEmits(['close', 'minted']);

const { t } = useI18n();
const config = useRuntimeConfig();
const alchemy = useAlchemyStore();
const { errorToast, successToast } = usePrettyToast();

// State
const loading = ref(false);
const isMinting = ref(false);
const mintSuccess = ref(false);
const mintError = ref(null);
const mintResult = ref(null);
const priceInfo = ref(null);
const stepIndex = ref(0);
const currentStep = ref('');
const selectedToken = ref('BONK');

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
onMounted(async () => {
	await fetchMintPrice();
});

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

const startMinting = async () => {
	const accessToken = localStorage.getItem('accessToken');
	const provider = getWalletProvider();

	if (!provider) {
		errorToast(t('mint.connectWalletFirst'));
		return;
	}

	loading.value = true;
	isMinting.value = true;
	mintError.value = null;
	stepIndex.value = 1;
	currentStep.value = t('mintDiscovery.stepPreparing');

	try {
		// Step 1: Prepare the token transfer transaction
		const prepareRes = await fetch(`${config.public.apiUrl}/nfts/mint-discovery/prepare`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				elementSlug: props.element.slug,
				paymentToken: selectedToken.value
			})
		});

		if (!prepareRes.ok) {
			const errorData = await prepareRes.json();
			throw new Error(errorData.message || t('mint.failedToPrepare'));
		}

		const prepareData = await prepareRes.json();

		// Step 2: Sign transaction with wallet
		stepIndex.value = 2;
		currentStep.value = t('mintDiscovery.stepSigning', { token: selectedToken.value });

		const { Buffer } = await import('buffer');
		window.Buffer = Buffer;

		const connection = new Connection(config.public.SOLANA_RPC_URL, 'confirmed');
		const transaction = Transaction.from(Buffer.from(prepareData.data.transaction, 'base64'));

		const signedTx = await provider.signAndSendTransaction(transaction);
		const signature = signedTx.signature || signedTx;

		await connection.confirmTransaction(signature, 'confirmed');

		// Step 3: Complete the mint (image generation happens here)
		stepIndex.value = 3;
		currentStep.value = t('mintDiscovery.stepGenerating');

		// Give it a moment for visual feedback
		await new Promise(resolve => setTimeout(resolve, 1000));

		stepIndex.value = 4;
		currentStep.value = t('mintDiscovery.stepCreating');

		const completeRes = await fetch(`${config.public.apiUrl}/nfts/mint-discovery/complete`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				elementSlug: props.element.slug,
				transactionSignature: signature
			})
		});

		if (!completeRes.ok) {
			const errorData = await completeRes.json();
			throw new Error(errorData.message || t('mint.failedToComplete'));
		}

		const completeData = await completeRes.json();
		mintResult.value = completeData.data;

		// Success!
		isMinting.value = false;
		mintSuccess.value = true;
		successToast(t('mint.mintedSuccessfully'));

		// Refresh NFTs and leaderboard
		await alchemy.fetchNFTs();

		emit('minted', mintResult.value);

	} catch (error) {
		console.error('Minting error:', error);
		isMinting.value = false;
		mintError.value = error.message || t('mintDiscovery.unexpectedError');
		errorToast(error.message || t('mint.mintingFailed'));
	} finally {
		loading.value = false;
	}
};

const resetState = () => {
	isMinting.value = false;
	mintSuccess.value = false;
	mintError.value = null;
	mintResult.value = null;
	stepIndex.value = 0;
};

const closeModal = () => {
	alchemy.resetMint();
	emit('close');
};

const getParticleStyle = (n) => {
	return {
		'--delay': `${Math.random() * 2}s`,
		'--x': `${Math.random() * 100}%`,
		'--size': `${Math.random() * 8 + 4}px`,
		'--duration': `${Math.random() * 3 + 2}s`
	};
};
</script>

<style lang="sass" scoped>
.mint-discovery-wrapper
	position: fixed
	top: 0
	left: 0
	width: 100%
	height: 100%
	z-index: 1000
	display: flex
	justify-content: center
	align-items: center

.backdrop
	position: absolute
	top: 0
	left: 0
	width: 100%
	height: 100%
	background: rgba(0, 0, 0, 0.7)
	backdrop-filter: blur(4px)

	&.celebrating
		.particle
			animation: particle-rise var(--duration) ease-out infinite
			animation-delay: var(--delay)

	.particle
		position: absolute
		bottom: -20px
		left: var(--x)
		width: var(--size)
		height: var(--size)
		background: #FFD700
		border-radius: 50%
		opacity: 0

@keyframes particle-rise
	0%
		opacity: 1
		transform: translateY(0) scale(1)
	100%
		opacity: 0
		transform: translateY(-100vh) scale(0)

.mint-discovery-modal
	position: relative
	width: 90%
	max-width: 450px
	min-height: 400px
	padding: 2rem
	background: #1a1a2e
	z-index: 10
	display: flex
	flex-direction: column
	justify-content: center
	align-items: center
	border: 3px solid #59CF93
	animation: modal-appear 0.3s ease-out

	&.success
		border-color: #FFD700
		box-shadow: 0 0 30px rgba(255, 215, 0, 0.3)

@keyframes modal-appear
	from
		opacity: 0
		transform: scale(0.9)
	to
		opacity: 1
		transform: scale(1)

.close
	position: absolute
	right: 1rem
	top: 1rem
	cursor: pointer
	z-index: 100
	opacity: 0.7
	transition: opacity 0.2s

	&:hover
		opacity: 1

	img
		width: 12px
		height: 12px
		image-rendering: pixelated
		filter: invert(1)

// Frame styles (pixel art border)
.frame-top, .frame-bottom, .frame-left, .frame-right
	position: absolute
	image-rendering: pixelated
	z-index: 0
	opacity: 0.3

.frame-top
	top: 0
	left: 18px
	width: calc(100% - 36px)
	height: 18px
	background: url('/images/combining-top.png') repeat-x
	background-size: auto 100%

.frame-bottom
	bottom: 0
	left: 18px
	width: calc(100% - 36px)
	height: 18px
	background: url('/images/combining-bottom.png') repeat-x
	background-size: auto 100%

.frame-left
	top: 18px
	left: 0
	width: 18px
	height: calc(100% - 36px)
	background: url('/images/combining-left.png') repeat-y
	background-size: 100% auto

.frame-right
	top: 18px
	right: 0
	width: 18px
	height: calc(100% - 36px)
	background: url('/images/combining-right.png') repeat-y
	background-size: 100% auto

.frame-lb, .frame-rb, .frame-lt, .frame-rt
	position: absolute
	width: 18px
	height: 18px
	image-rendering: pixelated
	z-index: 1
	opacity: 0.3

.frame-lb
	bottom: 0
	left: 0

.frame-rb
	bottom: 0
	right: 0

.frame-lt
	top: 0
	left: 0

.frame-rt
	top: 0
	right: 0

.modal-content
	font-family: 'Silkscreen', sans-serif
	color: white
	width: 100%

	strong
		color: #59CF93

// Discovery Badge
.discovery-badge
	position: relative
	display: inline-block
	padding: 0.25rem 1rem
	margin-bottom: 1rem
	background: linear-gradient(90deg, #FFD700, #FFA500)
	border-radius: 4px
	animation: badge-pulse 2s ease-in-out infinite

	.badge-text
		font-size: 10px
		font-weight: bold
		color: #1a1a2e
		letter-spacing: 2px

	.badge-glow
		position: absolute
		top: -2px
		left: -2px
		right: -2px
		bottom: -2px
		background: linear-gradient(90deg, #FFD700, #FFA500)
		border-radius: 6px
		filter: blur(8px)
		opacity: 0.5
		z-index: -1

@keyframes badge-pulse
	0%, 100%
		transform: scale(1)
	50%
		transform: scale(1.05)

.title-animated
	font-size: 1.2rem
	margin-bottom: 0.5rem
	color: #59CF93
	text-shadow: 0 0 10px rgba(89, 207, 147, 0.5)

.subtitle
	font-size: 12px
	color: #ccc
	margin-bottom: 1rem

.element-preview
	margin: 1rem 0

	:deep(.element)
		color: #1a1a2e

	.element-bounce
		animation: element-bounce 1s ease-in-out infinite

@keyframes element-bounce
	0%, 100%
		transform: translateY(0) scale(1.2)
	50%
		transform: translateY(-10px) scale(1.2)

.price-section
	margin: 1.5rem 0
	padding: 1rem
	background: rgba(255, 255, 255, 0.05)
	border-radius: 8px
	border: 1px solid rgba(89, 207, 147, 0.3)

.price-label
	font-size: 10px
	color: #888
	margin-bottom: 0.75rem

.token-options
	display: flex
	gap: 0.5rem
	justify-content: center

.token-option
	display: flex
	flex-direction: column
	align-items: center
	gap: 0.25rem
	padding: 0.75rem 1rem
	background: rgba(255, 255, 255, 0.05)
	border: 2px solid #444
	border-radius: 8px
	cursor: pointer
	transition: all 0.2s
	min-width: 90px

	&:hover
		border-color: #666
		background: rgba(255, 255, 255, 0.1)

	&.selected
		border-color: #59CF93
		background: rgba(89, 207, 147, 0.15)
		box-shadow: 0 0 10px rgba(89, 207, 147, 0.3)

	.token-icon
		width: 28px
		height: 28px
		image-rendering: pixelated

	.token-amount
		font-family: 'Silkscreen', sans-serif
		font-size: 9px
		color: #FFD700
		text-align: center

.info-box
	margin: 1rem 0
	padding: 0.75rem
	background: rgba(89, 207, 147, 0.1)
	border-radius: 4px
	border-left: 3px solid #59CF93

	p
		font-size: 10px
		margin-bottom: 0.5rem
		color: #59CF93

	ul
		list-style: none
		padding: 0
		margin: 0

		li
			font-size: 9px
			color: #aaa
			padding: 0.25rem 0
			padding-left: 1rem
			position: relative

			&:before
				content: ">"
				position: absolute
				left: 0
				color: #59CF93

.mint-button
	border: 2px solid #59CF93
	padding: 0.75rem 2rem
	cursor: pointer
	text-decoration: none
	color: #59CF93
	background: transparent
	font-size: 14px
	font-family: 'Silkscreen', sans-serif
	transition: all 0.3s
	margin-top: 1rem

	&:hover:not(:disabled)
		background: #59CF93
		color: #1a1a2e

	&:disabled
		opacity: 0.5
		cursor: not-allowed

	&.pulse-animation
		animation: button-pulse 2s ease-in-out infinite

@keyframes button-pulse
	0%, 100%
		box-shadow: 0 0 0 0 rgba(89, 207, 147, 0.4)
	50%
		box-shadow: 0 0 0 15px rgba(89, 207, 147, 0)

// Minting Progress
.minting-progress
	text-align: center
	padding: 2rem 0

.progress-icon
	margin-bottom: 1.5rem

.spinner-large
	width: 60px
	height: 60px
	border: 4px solid rgba(89, 207, 147, 0.2)
	border-top-color: #59CF93
	border-radius: 50%
	animation: spin 1s linear infinite
	margin: 0 auto

@keyframes spin
	to
		transform: rotate(360deg)

.minting-title
	font-size: 14px
	color: #59CF93
	margin-bottom: 2rem

.progress-steps
	display: flex
	flex-direction: column
	gap: 0.75rem
	text-align: left
	max-width: 250px
	margin: 0 auto

.step
	display: flex
	align-items: center
	gap: 0.75rem
	opacity: 0.3
	transition: opacity 0.3s

	&.active
		opacity: 1

	&.done
		opacity: 0.6

		.step-dot
			background: #59CF93

			&:after
				content: "✓"
				position: absolute
				color: #1a1a2e
				font-size: 8px

.step-dot
	width: 16px
	height: 16px
	border-radius: 50%
	background: rgba(89, 207, 147, 0.3)
	position: relative
	display: flex
	align-items: center
	justify-content: center

	.active &
		background: #59CF93
		animation: dot-pulse 1s ease-in-out infinite

@keyframes dot-pulse
	0%, 100%
		transform: scale(1)
	50%
		transform: scale(1.2)

.step-label
	font-size: 10px
	color: #ccc

// Success State
.success-content
	text-align: center
	padding: 1rem 0

.success-badge
	width: 60px
	height: 60px
	background: #59CF93
	border-radius: 50%
	display: flex
	align-items: center
	justify-content: center
	margin: 0 auto 1rem
	animation: success-pop 0.5s ease-out

	.checkmark
		font-size: 32px
		color: #1a1a2e

@keyframes success-pop
	0%
		transform: scale(0)
	50%
		transform: scale(1.2)
	100%
		transform: scale(1)

.success-title
	font-size: 1.2rem
	color: #FFD700
	margin-bottom: 0.5rem
	text-shadow: 0 0 10px rgba(255, 215, 0, 0.5)

.success-subtitle
	font-size: 11px
	color: #aaa
	margin-bottom: 1rem

.nft-preview
	margin: 1rem 0
	padding: 0.5rem
	background: rgba(255, 255, 255, 0.05)
	border-radius: 8px
	border: 2px solid #FFD700

	.nft-image
		max-width: 200px
		width: 100%
		height: auto
		image-rendering: pixelated
		border-radius: 4px

.nft-name
	font-size: 14px
	color: #59CF93
	margin-bottom: 1rem

// Marketplace Section
.marketplace-section
	margin-bottom: 1.5rem
	padding: 1rem
	background: rgba(255, 255, 255, 0.05)
	border-radius: 8px
	border: 1px solid rgba(255, 255, 255, 0.1)

	.marketplace-label
		font-size: 9px
		color: #888
		margin-bottom: 0.75rem
		text-transform: uppercase

	.marketplace-links
		display: flex
		gap: 0.75rem
		justify-content: center

.marketplace-link
	display: flex
	align-items: center
	justify-content: center
	gap: 6px
	padding: 0.5rem 1rem
	border-radius: 6px
	font-family: 'Silkscreen', sans-serif
	font-size: 10px
	text-decoration: none
	transition: all 0.2s
	border: 2px solid

	&.magic-eden
		background: linear-gradient(135deg, #e42575 0%, #a91b60 100%)
		color: white
		border-color: #a91b60

		&:hover
			transform: translateY(-2px)
			box-shadow: 0 4px 15px rgba(228, 37, 117, 0.5)

	&.tensor
		background: linear-gradient(135deg, #00d18c 0%, #00a06b 100%)
		color: white
		border-color: #00a06b

		&:hover
			transform: translateY(-2px)
			box-shadow: 0 4px 15px rgba(0, 209, 140, 0.5)

.success-actions
	display: flex
	gap: 1rem
	justify-content: center
	flex-wrap: wrap

.action-button
	padding: 0.5rem 1rem
	font-size: 11px
	font-family: 'Silkscreen', sans-serif
	border: 2px solid
	border-radius: 4px
	cursor: pointer
	text-decoration: none
	transition: all 0.2s

	&.primary
		background: #59CF93
		border-color: #59CF93
		color: #1a1a2e

		&:hover
			background: #4ab882

	&.secondary
		background: transparent
		border-color: #888
		color: #888

		&:hover
			border-color: #FFD700
			color: #FFD700

// Error State
.error-content
	text-align: center
	padding: 2rem 0

.error-icon
	width: 50px
	height: 50px
	background: #e74c3c
	border-radius: 50%
	display: flex
	align-items: center
	justify-content: center
	margin: 0 auto 1rem
	font-size: 24px
	font-weight: bold
	color: white

.error-message
	font-size: 11px
	color: #e74c3c
	margin-bottom: 1.5rem
	max-width: 300px

// Spinner
.spinner-border
	width: 1rem
	height: 1rem
	border-width: 2px
</style>
