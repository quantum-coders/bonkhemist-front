<template>
	<div class="leaderboard-container" :class="{ 'is-expanded': isExpanded }">
		<!-- Toggle Button - Always visible -->
		<button
			class="leaderboard-toggle"
			@click="toggleLeaderboard"
			:class="{ 'is-expanded': isExpanded }"
		>
			<img src="/images/bonk.png" class="toggle-icon" alt="">
			<span class="toggle-rank" v-if="myPosition && !isExpanded">
				#{{ myPosition.ranking || '?' }}
			</span>
		</button>

		<!-- Expandable Panel -->
		<transition name="slide">
			<div class="leaderboard-panel" v-show="isExpanded">
				<div class="leaderboard-header">
					<img src="/images/bonk.png" class="trophy" alt="">
					<h2>
						<alchemy-animated-text text="Leaderboard" />
					</h2>
					<button class="close-btn" @click="isExpanded = false">
						<img src="/images/close.png" alt="Close">
					</button>
				</div>

				<div class="leaderboard-content" v-if="!loading">
					<!-- My Stats Card -->
					<div class="my-stats-card" v-if="myPosition">
						<div class="my-rank">
							<span class="rank-number">#{{ myPosition.ranking || '?' }}</span>
							<span class="rank-label">Your Rank</span>
						</div>
						<div class="my-score">
							<span class="score-number">{{ formatScore(myPosition.totalScore) }}</span>
							<span class="score-label">points</span>
						</div>
					</div>

					<!-- Stats Grid -->
					<div class="stats-grid" v-if="myPosition">
						<div class="stat-item">
							<span class="stat-value">{{ myPosition.totalElements || 0 }}</span>
							<span class="stat-label">Elements</span>
						</div>
						<div class="stat-item">
							<span class="stat-value">{{ myPosition.firstDiscoveries || 0 }}</span>
							<span class="stat-label">First Disc.</span>
						</div>
						<div class="stat-item">
							<span class="stat-value">{{ myPosition.mintedNfts || 0 }}</span>
							<span class="stat-label">NFTs</span>
						</div>
						<div class="stat-item">
							<span class="stat-value">{{ myPosition.completedChallenges || 0 }}</span>
							<span class="stat-label">Quests</span>
						</div>
					</div>

					<!-- Top Players Section -->
					<div class="top-players-section">
						<div class="section-title">Top Alchemists</div>

						<!-- Podium for Top 3 -->
						<div class="podium" v-if="leaderboard.length >= 3">
							<div class="podium-place second">
								<div class="podium-avatar silver">2</div>
								<div class="podium-name">{{ truncateWallet(leaderboard[1]?.user?.login) }}</div>
								<div class="podium-score">{{ formatScore(leaderboard[1]?.totalScore) }}</div>
							</div>
							<div class="podium-place first">
								<div class="crown-icon">👑</div>
								<div class="podium-avatar gold">1</div>
								<div class="podium-name">{{ truncateWallet(leaderboard[0]?.user?.login) }}</div>
								<div class="podium-score">{{ formatScore(leaderboard[0]?.totalScore) }}</div>
							</div>
							<div class="podium-place third">
								<div class="podium-avatar bronze">3</div>
								<div class="podium-name">{{ truncateWallet(leaderboard[2]?.user?.login) }}</div>
								<div class="podium-score">{{ formatScore(leaderboard[2]?.totalScore) }}</div>
							</div>
						</div>

						<!-- Rest of leaderboard -->
						<div class="leaderboard-list">
							<div
								v-for="(entry, index) in leaderboard.slice(3, 10)"
								:key="entry.id"
								class="leaderboard-row"
								:class="{ 'is-me': entry.idUser === myUserId }"
							>
								<span class="row-rank">#{{ index + 4 }}</span>
								<span class="row-name">{{ truncateWallet(entry.user?.login) }}</span>
								<span class="row-score">{{ formatScore(entry.totalScore) }}</span>
							</div>
						</div>

						<!-- View Full Leaderboard Link -->
						<NuxtLink to="/leaderboard" class="view-full-link">
							View Full Leaderboard &rarr;
						</NuxtLink>
					</div>
				</div>

				<div class="leaderboard-loading" v-else>
					<img src="/images/bonk.png" class="bonk-loading" alt="">
					<p>Loading...</p>
				</div>
			</div>
		</transition>

		<!-- Backdrop -->
		<div
			class="leaderboard-backdrop"
			v-if="isExpanded"
			@click="isExpanded = false"
		></div>
	</div>
</template>

<script setup>
const config = useRuntimeConfig();
const alchemy = useAlchemyStore();

const isExpanded = ref(false);
const leaderboard = ref([]);
const myPosition = ref(null);
const myUserId = ref(null);
const loading = ref(true);

const toggleLeaderboard = () => {
	isExpanded.value = !isExpanded.value;
};

const truncateWallet = (wallet) => {
	if (!wallet) return '???';
	return wallet.slice(0, 4) + '...' + wallet.slice(-4);
};

const formatScore = (score) => {
	if (!score) return '0';
	if (score >= 1000000) {
		return (score / 1000000).toFixed(1) + 'M';
	}
	if (score >= 1000) {
		return (score / 1000).toFixed(1) + 'k';
	}
	return score.toString();
};

const fetchLeaderboard = async () => {
	loading.value = true;
	try {
		// Fetch top leaderboard (public)
		const topRes = await fetch(`${config.public.apiUrl}/leaderboard?limit=10`);
		if (topRes.ok) {
			const topData = await topRes.json();
			leaderboard.value = topData.data || [];
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
	}
};

// Watch for wallet connection to refresh leaderboard
watch(() => alchemy.connectedWallet, (newVal) => {
	if (newVal) {
		fetchLeaderboard();
	}
});

onMounted(() => {
	fetchLeaderboard();
	// Refresh every 60 seconds (less aggressive)
	setInterval(fetchLeaderboard, 60000);
});
</script>

<style lang="sass" scoped>
.leaderboard-container
	position: fixed
	top: 50%
	right: 0
	transform: translateY(-50%)
	z-index: 1000
	display: flex
	align-items: center

// Toggle Button
.leaderboard-toggle
	position: relative
	width: 48px
	height: 64px
	background: #FFD002
	border: 3px solid #333
	border-right: none
	border-radius: 12px 0 0 12px
	cursor: pointer
	display: flex
	flex-direction: column
	align-items: center
	justify-content: center
	gap: 2px
	transition: all 0.3s ease
	box-shadow: -4px 4px 0 rgba(0,0,0,0.2)
	image-rendering: pixelated

	&:hover
		width: 56px
		background: #ffe34d

	&.is-expanded
		opacity: 0
		pointer-events: none

	.toggle-icon
		width: 28px
		height: 28px
		image-rendering: pixelated
		animation: pulse 2s ease-in-out infinite

	.toggle-rank
		font-family: Silkscreen, sans-serif
		font-size: 10px
		color: #333
		font-weight: bold

@keyframes pulse
	0%, 100%
		transform: scale(1)
	50%
		transform: scale(1.1)

// Panel
.leaderboard-panel
	position: fixed
	top: 50%
	right: 0
	transform: translateY(-50%)
	width: 280px
	max-height: 80vh
	background: white
	border: 3px solid #333
	border-right: none
	border-radius: 16px 0 0 16px
	box-shadow: -8px 8px 0 rgba(0,0,0,0.2)
	display: flex
	flex-direction: column
	overflow: hidden
	z-index: 1001

// Slide transition
.slide-enter-active, .slide-leave-active
	transition: transform 0.3s ease, opacity 0.3s ease

.slide-enter-from, .slide-leave-to
	transform: translateY(-50%) translateX(100%)
	opacity: 0

.slide-enter-to, .slide-leave-from
	transform: translateY(-50%) translateX(0)
	opacity: 1

// Header
.leaderboard-header
	background: linear-gradient(135deg, #59CF93 0%, #3ba870 100%)
	padding: 12px 16px
	display: flex
	align-items: center
	gap: 10px
	border-bottom: 3px solid #333

	.trophy
		width: 28px
		height: 28px
		image-rendering: pixelated

	h2
		font-family: Silkscreen, sans-serif
		font-size: 14px
		color: white
		margin: 0
		flex: 1
		text-shadow: 2px 2px 0 rgba(0,0,0,0.2)

	.close-btn
		background: transparent
		border: none
		cursor: pointer
		padding: 4px
		opacity: 0.8
		transition: opacity 0.2s

		&:hover
			opacity: 1

		img
			width: 16px
			height: 16px
			image-rendering: pixelated
			filter: brightness(0) invert(1)

// Content
.leaderboard-content
	flex: 1
	overflow-y: auto
	padding: 16px

	&::-webkit-scrollbar
		width: 6px

	&::-webkit-scrollbar-track
		background: #f0f0f0

	&::-webkit-scrollbar-thumb
		background: #C5C7DD
		border-radius: 3px

// My Stats Card
.my-stats-card
	background: linear-gradient(135deg, #FFD002 0%, #f5c400 100%)
	border: 3px solid #333
	border-radius: 12px
	padding: 12px 16px
	display: flex
	justify-content: space-between
	align-items: center
	margin-bottom: 12px
	box-shadow: 4px 4px 0 rgba(0,0,0,0.15)

	.my-rank, .my-score
		display: flex
		flex-direction: column
		align-items: center

	.rank-number
		font-family: Silkscreen, sans-serif
		font-size: 24px
		color: #333
		font-weight: bold

	.rank-label, .score-label
		font-family: Silkscreen, sans-serif
		font-size: 8px
		color: #666
		text-transform: uppercase

	.score-number
		font-family: Silkscreen, sans-serif
		font-size: 20px
		color: #59CF93
		font-weight: bold

// Stats Grid
.stats-grid
	display: grid
	grid-template-columns: repeat(4, 1fr)
	gap: 8px
	margin-bottom: 16px

	.stat-item
		background: #f8f8f8
		border: 2px solid #e0e0e0
		border-radius: 8px
		padding: 8px 4px
		display: flex
		flex-direction: column
		align-items: center
		transition: transform 0.2s

		&:hover
			transform: translateY(-2px)
			border-color: #59CF93

		.stat-value
			font-family: Silkscreen, sans-serif
			font-size: 14px
			color: #59CF93
			font-weight: bold

		.stat-label
			font-family: Silkscreen, sans-serif
			font-size: 7px
			color: #888
			text-align: center

// Top Players Section
.top-players-section
	.section-title
		font-family: Silkscreen, sans-serif
		font-size: 10px
		color: #666
		text-transform: uppercase
		margin-bottom: 12px
		padding-bottom: 6px
		border-bottom: 2px dashed #e0e0e0

// Podium
.podium
	display: flex
	align-items: flex-end
	justify-content: center
	gap: 8px
	margin-bottom: 16px
	padding: 12px 0

	.podium-place
		display: flex
		flex-direction: column
		align-items: center
		position: relative

		.crown-icon
			font-size: 16px
			margin-bottom: -6px
			animation: float 2s ease-in-out infinite

		.podium-avatar
			width: 32px
			height: 32px
			border-radius: 50%
			display: flex
			align-items: center
			justify-content: center
			font-family: Silkscreen, sans-serif
			font-size: 14px
			font-weight: bold
			color: #333
			border: 3px solid #333
			box-shadow: 2px 2px 0 rgba(0,0,0,0.2)

			&.gold
				background: linear-gradient(135deg, #FFD002 0%, #FFA500 100%)
				width: 40px
				height: 40px
				font-size: 16px

			&.silver
				background: linear-gradient(135deg, #E8E8E8 0%, #B8B8B8 100%)

			&.bronze
				background: linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)

		.podium-name
			font-family: Silkscreen, sans-serif
			font-size: 8px
			color: #666
			margin-top: 4px
			max-width: 70px
			overflow: hidden
			text-overflow: ellipsis
			white-space: nowrap

		.podium-score
			font-family: Silkscreen, sans-serif
			font-size: 10px
			color: #59CF93
			font-weight: bold

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
		transform: translateY(-4px)

// View Full Link
.view-full-link
	display: block
	text-align: center
	margin-top: 16px
	padding: 10px
	font-family: Silkscreen, sans-serif
	font-size: 10px
	color: #59CF93
	text-decoration: none
	border: 2px solid #59CF93
	border-radius: 8px
	transition: all 0.2s

	&:hover
		background: #59CF93
		color: #1a1a2e

// Leaderboard List
.leaderboard-list
	display: flex
	flex-direction: column
	gap: 6px

.leaderboard-row
	display: flex
	align-items: center
	padding: 8px 12px
	background: #f8f8f8
	border: 2px solid transparent
	border-radius: 8px
	font-family: Silkscreen, sans-serif
	transition: all 0.2s

	&:hover
		background: #f0f0f0
		transform: translateX(-4px)

	&.is-me
		background: linear-gradient(135deg, #FFD002 0%, #f5c400 100%)
		border-color: #333

	.row-rank
		width: 28px
		font-size: 10px
		color: #888

	.row-name
		flex: 1
		font-size: 10px
		color: #333
		overflow: hidden
		text-overflow: ellipsis
		white-space: nowrap

	.row-score
		font-size: 10px
		color: #59CF93
		font-weight: bold

// Loading
.leaderboard-loading
	display: flex
	flex-direction: column
	align-items: center
	justify-content: center
	padding: 3rem

	.bonk-loading
		width: 48px
		height: 48px
		image-rendering: pixelated
		animation: bounce 0.6s ease-in-out infinite

	p
		font-family: Silkscreen, sans-serif
		font-size: 10px
		color: #666
		margin-top: 12px

@keyframes bounce
	0%, 100%
		transform: translateY(0)
	50%
		transform: translateY(-10px)

// Backdrop
.leaderboard-backdrop
	position: fixed
	top: 0
	left: 0
	right: 0
	bottom: 0
	background: rgba(0, 0, 0, 0.3)
	z-index: 999
	cursor: pointer
</style>
