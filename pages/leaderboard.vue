<template>
	<div class="leaderboard-page">
		<!-- Background particles -->
		<div class="particles">
			<div class="particle" v-for="n in 30" :key="n" :style="getParticleStyle(n)"></div>
		</div>

		<!-- Header -->
		<header class="page-header">
			<NuxtLink to="/" class="back-btn">
				<span>&larr;</span> Back to Game
			</NuxtLink>
			<div class="logo-section">
				<img src="/images/bonk.png" class="logo" alt="Bonkhemist">
				<h1><alchemy-animated-text text="LEADERBOARD" /></h1>
			</div>
		</header>

		<!-- Main Content -->
		<main class="page-content" v-if="!loading">
			<!-- Hero Stats -->
			<section class="hero-section" v-if="myPosition">
				<div class="hero-card">
					<div class="hero-rank">
						<span class="rank-label">YOUR RANK</span>
						<span class="rank-value">#{{ myPosition.ranking || '?' }}</span>
					</div>
					<div class="hero-score">
						<span class="score-value">{{ myPosition.totalScore || 0 }}</span>
						<span class="score-label">TOTAL POINTS</span>
					</div>
					<div class="hero-stats">
						<div class="stat">
							<span class="value">{{ myPosition.totalElements || 0 }}</span>
							<span class="label">Elements</span>
						</div>
						<div class="stat">
							<span class="value">{{ myPosition.firstDiscoveries || 0 }}</span>
							<span class="label">First Discoveries</span>
						</div>
						<div class="stat">
							<span class="value">{{ myPosition.mintedNfts || 0 }}</span>
							<span class="label">NFTs Minted</span>
						</div>
						<div class="stat">
							<span class="value">{{ myPosition.completedChallenges || 0 }}</span>
							<span class="label">Quests Done</span>
						</div>
					</div>
				</div>
			</section>

			<!-- Connect Wallet Message -->
			<section class="connect-section" v-else>
				<div class="connect-card">
					<img src="/images/bonk.png" class="connect-icon" alt="">
					<p>Connect your wallet to see your ranking</p>
					<NuxtLink to="/" class="connect-btn">Go to Game</NuxtLink>
				</div>
			</section>

			<!-- Scoring Info -->
			<section class="scoring-section">
				<h2>How Scoring Works</h2>
				<div class="scoring-grid">
					<div class="scoring-item">
						<span class="points">+1</span>
						<span class="action">Element Discovered</span>
					</div>
					<div class="scoring-item highlight">
						<span class="points">+10</span>
						<span class="action">First Discovery</span>
					</div>
					<div class="scoring-item gold">
						<span class="points">+50</span>
						<span class="action">NFT Minted</span>
					</div>
					<div class="scoring-item">
						<span class="points">+5</span>
						<span class="action">Quest Completed</span>
					</div>
				</div>
			</section>

			<!-- Podium Section -->
			<section class="podium-section" v-if="leaderboard.length >= 3">
				<h2>Top Alchemists</h2>
				<div class="podium-container">
					<!-- Second Place -->
					<div class="podium-place second">
						<div class="place-card">
							<div class="medal silver">2</div>
							<div class="wallet">{{ formatWallet(leaderboard[1]?.user?.login) }}</div>
							<div class="score">{{ leaderboard[1]?.totalScore || 0 }} pts</div>
							<div class="stats-mini">
								<span>{{ leaderboard[1]?.totalElements || 0 }} elements</span>
								<span>{{ leaderboard[1]?.mintedNfts || 0 }} NFTs</span>
							</div>
						</div>
						<div class="pedestal silver"></div>
					</div>

					<!-- First Place -->
					<div class="podium-place first">
						<div class="crown">👑</div>
						<div class="place-card gold-glow">
							<div class="medal gold">1</div>
							<div class="wallet">{{ formatWallet(leaderboard[0]?.user?.login) }}</div>
							<div class="score">{{ leaderboard[0]?.totalScore || 0 }} pts</div>
							<div class="stats-mini">
								<span>{{ leaderboard[0]?.totalElements || 0 }} elements</span>
								<span>{{ leaderboard[0]?.mintedNfts || 0 }} NFTs</span>
							</div>
						</div>
						<div class="pedestal gold"></div>
					</div>

					<!-- Third Place -->
					<div class="podium-place third">
						<div class="place-card">
							<div class="medal bronze">3</div>
							<div class="wallet">{{ formatWallet(leaderboard[2]?.user?.login) }}</div>
							<div class="score">{{ leaderboard[2]?.totalScore || 0 }} pts</div>
							<div class="stats-mini">
								<span>{{ leaderboard[2]?.totalElements || 0 }} elements</span>
								<span>{{ leaderboard[2]?.mintedNfts || 0 }} NFTs</span>
							</div>
						</div>
						<div class="pedestal bronze"></div>
					</div>
				</div>
			</section>

			<!-- Full Rankings Table -->
			<section class="rankings-section">
				<h2>Full Rankings</h2>
				<div class="rankings-table">
					<div class="table-header">
						<span class="col-rank">Rank</span>
						<span class="col-wallet">Wallet</span>
						<span class="col-elements">Elements</span>
						<span class="col-first">First Disc.</span>
						<span class="col-nfts">NFTs</span>
						<span class="col-quests">Quests</span>
						<span class="col-score">Score</span>
					</div>
					<div
						v-for="(entry, index) in leaderboard"
						:key="entry.id"
						class="table-row"
						:class="{
							'is-me': entry.idUser === myUserId,
							'top-3': index < 3
						}"
					>
						<span class="col-rank">
							<span class="rank-badge" :class="getRankClass(index)">#{{ index + 1 }}</span>
						</span>
						<span class="col-wallet">{{ formatWallet(entry.user?.login) }}</span>
						<span class="col-elements">{{ entry.totalElements || 0 }}</span>
						<span class="col-first">{{ entry.firstDiscoveries || 0 }}</span>
						<span class="col-nfts">{{ entry.mintedNfts || 0 }}</span>
						<span class="col-quests">{{ entry.completedChallenges || 0 }}</span>
						<span class="col-score">{{ entry.totalScore || 0 }}</span>
					</div>
				</div>

				<!-- Load More -->
				<div class="load-more" v-if="hasMore">
					<button @click="loadMore" :disabled="loadingMore">
						{{ loadingMore ? 'Loading...' : 'Load More' }}
					</button>
				</div>
			</section>
		</main>

		<!-- Loading State -->
		<main class="page-loading" v-else>
			<img src="/images/bonk.png" class="loading-icon" alt="">
			<p>Loading leaderboard...</p>
		</main>
	</div>
</template>

<script setup>
const config = useRuntimeConfig();

const leaderboard = ref([]);
const myPosition = ref(null);
const myUserId = ref(null);
const loading = ref(true);
const loadingMore = ref(false);
const page = ref(1);
const hasMore = ref(true);
const limit = 50;

const formatWallet = (wallet) => {
	if (!wallet) return '???';
	return wallet.slice(0, 6) + '...' + wallet.slice(-4);
};

const getRankClass = (index) => {
	if (index === 0) return 'gold';
	if (index === 1) return 'silver';
	if (index === 2) return 'bronze';
	return '';
};

const getParticleStyle = (n) => {
	return {
		'--x': `${Math.random() * 100}%`,
		'--y': `${Math.random() * 100}%`,
		'--delay': `${Math.random() * 5}s`,
		'--size': `${Math.random() * 4 + 2}px`,
		'--duration': `${Math.random() * 3 + 2}s`
	};
};

const fetchLeaderboard = async (reset = false) => {
	if (reset) {
		page.value = 1;
		leaderboard.value = [];
	}

	loading.value = reset || leaderboard.value.length === 0;
	loadingMore.value = !reset && leaderboard.value.length > 0;

	try {
		// Fetch leaderboard
		const res = await fetch(`${config.public.apiUrl}/leaderboard?limit=${limit}&page=${page.value}`);
		if (res.ok) {
			const data = await res.json();
			if (reset) {
				leaderboard.value = data.data || [];
			} else {
				leaderboard.value.push(...(data.data || []));
			}
			hasMore.value = (data.data?.length || 0) === limit;
		}

		// Fetch my position if logged in
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			const myRes = await fetch(`${config.public.apiUrl}/leaderboard/me`, {
				headers: { 'Authorization': `Bearer ${accessToken}` }
			});
			if (myRes.ok) {
				const myData = await myRes.json();
				myPosition.value = myData.data?.user || null;
				myUserId.value = myData.data?.user?.idUser || null;
			}
		}
	} catch (error) {
		console.error('Error fetching leaderboard:', error);
	} finally {
		loading.value = false;
		loadingMore.value = false;
	}
};

const loadMore = () => {
	page.value++;
	fetchLeaderboard(false);
};

onMounted(() => {
	fetchLeaderboard(true);
});
</script>

<style lang="sass" scoped>
.leaderboard-page
	min-height: 100vh
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)
	position: relative
	overflow-x: hidden

// Particles
.particles
	position: fixed
	top: 0
	left: 0
	width: 100%
	height: 100%
	pointer-events: none
	z-index: 0

	.particle
		position: absolute
		left: var(--x)
		top: var(--y)
		width: var(--size)
		height: var(--size)
		background: rgba(89, 207, 147, 0.3)
		border-radius: 50%
		animation: float-particle var(--duration) ease-in-out infinite
		animation-delay: var(--delay)

@keyframes float-particle
	0%, 100%
		transform: translateY(0) scale(1)
		opacity: 0.3
	50%
		transform: translateY(-20px) scale(1.2)
		opacity: 0.6

// Header
.page-header
	position: relative
	z-index: 10
	padding: 1.5rem 2rem
	display: flex
	justify-content: space-between
	align-items: center

	.back-btn
		font-family: Silkscreen, sans-serif
		font-size: 12px
		color: #59CF93
		text-decoration: none
		padding: 8px 16px
		border: 2px solid #59CF93
		border-radius: 8px
		transition: all 0.2s

		&:hover
			background: #59CF93
			color: #1a1a2e

	.logo-section
		display: flex
		align-items: center
		gap: 1rem

		.logo
			width: 48px
			height: 48px
			image-rendering: pixelated
			animation: bounce 1s ease-in-out infinite

		h1
			font-family: Silkscreen, sans-serif
			font-size: 24px
			color: #FFD002
			text-shadow: 3px 3px 0 rgba(0,0,0,0.3)

@keyframes bounce
	0%, 100%
		transform: translateY(0)
	50%
		transform: translateY(-8px)

// Main Content
.page-content
	position: relative
	z-index: 10
	max-width: 1200px
	margin: 0 auto
	padding: 2rem

// Hero Section
.hero-section
	margin-bottom: 2rem

.hero-card
	background: linear-gradient(135deg, rgba(89, 207, 147, 0.2) 0%, rgba(89, 207, 147, 0.1) 100%)
	border: 3px solid #59CF93
	border-radius: 16px
	padding: 2rem
	display: grid
	grid-template-columns: 1fr 1fr 2fr
	gap: 2rem
	align-items: center
	box-shadow: 0 8px 32px rgba(89, 207, 147, 0.2)

	.hero-rank, .hero-score
		text-align: center

	.rank-label, .score-label
		font-family: Silkscreen, sans-serif
		font-size: 10px
		color: #888
		text-transform: uppercase
		display: block

	.rank-value
		font-family: Silkscreen, sans-serif
		font-size: 48px
		color: #FFD002
		text-shadow: 3px 3px 0 rgba(0,0,0,0.3)

	.score-value
		font-family: Silkscreen, sans-serif
		font-size: 36px
		color: #59CF93

	.hero-stats
		display: flex
		gap: 1rem
		justify-content: space-around

		.stat
			text-align: center
			padding: 1rem
			background: rgba(255,255,255,0.05)
			border-radius: 8px
			min-width: 100px

			.value
				font-family: Silkscreen, sans-serif
				font-size: 24px
				color: white
				display: block

			.label
				font-family: Silkscreen, sans-serif
				font-size: 9px
				color: #888

// Connect Section
.connect-section
	margin-bottom: 2rem

.connect-card
	background: rgba(255,255,255,0.05)
	border: 2px dashed #59CF93
	border-radius: 16px
	padding: 3rem
	text-align: center

	.connect-icon
		width: 64px
		height: 64px
		image-rendering: pixelated
		opacity: 0.5
		margin-bottom: 1rem

	p
		font-family: Silkscreen, sans-serif
		font-size: 14px
		color: #888
		margin-bottom: 1rem

	.connect-btn
		font-family: Silkscreen, sans-serif
		font-size: 12px
		color: #59CF93
		text-decoration: none
		padding: 10px 24px
		border: 2px solid #59CF93
		border-radius: 8px
		display: inline-block
		transition: all 0.2s

		&:hover
			background: #59CF93
			color: #1a1a2e

// Scoring Section
.scoring-section
	margin-bottom: 3rem

	h2
		font-family: Silkscreen, sans-serif
		font-size: 14px
		color: white
		margin-bottom: 1rem
		text-align: center

.scoring-grid
	display: flex
	justify-content: center
	gap: 1rem
	flex-wrap: wrap

	.scoring-item
		background: rgba(255,255,255,0.05)
		border: 2px solid #333
		border-radius: 8px
		padding: 1rem 1.5rem
		text-align: center
		min-width: 120px
		transition: transform 0.2s

		&:hover
			transform: translateY(-4px)

		&.highlight
			border-color: #59CF93
			background: rgba(89, 207, 147, 0.1)

		&.gold
			border-color: #FFD002
			background: rgba(255, 208, 2, 0.1)

		.points
			font-family: Silkscreen, sans-serif
			font-size: 24px
			color: #59CF93
			display: block

		.action
			font-family: Silkscreen, sans-serif
			font-size: 10px
			color: #888

// Podium Section
.podium-section
	margin-bottom: 3rem

	h2
		font-family: Silkscreen, sans-serif
		font-size: 14px
		color: white
		margin-bottom: 2rem
		text-align: center

.podium-container
	display: flex
	justify-content: center
	align-items: flex-end
	gap: 1rem
	padding: 2rem 0

.podium-place
	display: flex
	flex-direction: column
	align-items: center

	.crown
		font-size: 32px
		margin-bottom: -8px
		animation: float 2s ease-in-out infinite

	.place-card
		background: rgba(255,255,255,0.05)
		border: 3px solid #333
		border-radius: 12px
		padding: 1.5rem
		text-align: center
		min-width: 160px
		position: relative
		z-index: 1

		&.gold-glow
			box-shadow: 0 0 30px rgba(255, 208, 2, 0.3)

		.medal
			width: 48px
			height: 48px
			border-radius: 50%
			display: flex
			align-items: center
			justify-content: center
			font-family: Silkscreen, sans-serif
			font-size: 20px
			font-weight: bold
			color: #333
			margin: 0 auto 1rem
			border: 3px solid #333

			&.gold
				background: linear-gradient(135deg, #FFD002 0%, #FFA500 100%)
				width: 56px
				height: 56px
				font-size: 24px

			&.silver
				background: linear-gradient(135deg, #E8E8E8 0%, #B8B8B8 100%)

			&.bronze
				background: linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)

		.wallet
			font-family: Silkscreen, sans-serif
			font-size: 11px
			color: white
			margin-bottom: 0.5rem

		.score
			font-family: Silkscreen, sans-serif
			font-size: 16px
			color: #59CF93
			margin-bottom: 0.5rem

		.stats-mini
			display: flex
			flex-direction: column
			gap: 2px

			span
				font-family: Silkscreen, sans-serif
				font-size: 8px
				color: #666

	.pedestal
		width: 100%
		border-radius: 8px 8px 0 0
		margin-top: -8px

		&.gold
			height: 100px
			background: linear-gradient(180deg, #FFD002 0%, #cc9900 100%)

		&.silver
			height: 70px
			background: linear-gradient(180deg, #C0C0C0 0%, #808080 100%)

		&.bronze
			height: 50px
			background: linear-gradient(180deg, #CD7F32 0%, #8B4513 100%)

	&.first
		order: 2

	&.second
		order: 1

	&.third
		order: 3

@keyframes float
	0%, 100%
		transform: translateY(0)
	50%
		transform: translateY(-8px)

// Rankings Section
.rankings-section
	h2
		font-family: Silkscreen, sans-serif
		font-size: 14px
		color: white
		margin-bottom: 1rem

.rankings-table
	background: rgba(255,255,255,0.02)
	border: 2px solid #333
	border-radius: 12px
	overflow: hidden

.table-header
	display: grid
	grid-template-columns: 80px 1fr 80px 80px 60px 60px 100px
	padding: 1rem 1.5rem
	background: rgba(89, 207, 147, 0.1)
	border-bottom: 2px solid #333
	font-family: Silkscreen, sans-serif
	font-size: 10px
	color: #59CF93
	text-transform: uppercase

.table-row
	display: grid
	grid-template-columns: 80px 1fr 80px 80px 60px 60px 100px
	padding: 1rem 1.5rem
	border-bottom: 1px solid rgba(255,255,255,0.05)
	font-family: Silkscreen, sans-serif
	font-size: 12px
	color: #ccc
	transition: background 0.2s

	&:hover
		background: rgba(255,255,255,0.05)

	&.is-me
		background: rgba(255, 208, 2, 0.1)
		border-left: 3px solid #FFD002

	&.top-3
		background: rgba(89, 207, 147, 0.05)

	.rank-badge
		display: inline-block
		padding: 2px 8px
		border-radius: 4px
		font-size: 10px

		&.gold
			background: #FFD002
			color: #333

		&.silver
			background: #C0C0C0
			color: #333

		&.bronze
			background: #CD7F32
			color: white

	.col-score
		color: #59CF93
		font-weight: bold

.load-more
	padding: 2rem
	text-align: center

	button
		font-family: Silkscreen, sans-serif
		font-size: 12px
		color: #59CF93
		background: transparent
		border: 2px solid #59CF93
		padding: 10px 32px
		border-radius: 8px
		cursor: pointer
		transition: all 0.2s

		&:hover:not(:disabled)
			background: #59CF93
			color: #1a1a2e

		&:disabled
			opacity: 0.5
			cursor: not-allowed

// Loading
.page-loading
	display: flex
	flex-direction: column
	align-items: center
	justify-content: center
	min-height: 60vh

	.loading-icon
		width: 64px
		height: 64px
		image-rendering: pixelated
		animation: bounce 0.6s ease-in-out infinite

	p
		font-family: Silkscreen, sans-serif
		font-size: 14px
		color: #888
		margin-top: 1rem

// Responsive
@media (max-width: 768px)
	.hero-card
		grid-template-columns: 1fr
		text-align: center

		.hero-stats
			flex-wrap: wrap

	.table-header, .table-row
		grid-template-columns: 60px 1fr 60px 80px
		font-size: 10px

		.col-first, .col-quests
			display: none

	.podium-container
		flex-direction: column
		align-items: center

		.podium-place
			order: unset !important

			.pedestal
				display: none
</style>
