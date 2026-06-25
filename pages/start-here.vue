<template>
	<div class="landing">
		<header class="lnav">
			<NuxtLink to="/" class="lnav__brand" aria-label="Bonkhemist">
				<img src="/images/logo.png" alt="Bonkhemist" />
			</NuxtLink>
			<nav class="lnav__right">
				<LanguageSwitcher />
				<PixelButton to="/" variant="primary" size="md">{{ $t('landing.nav.play') }}</PixelButton>
			</nav>
		</header>

		<main>
			<LandingHero />
			<LandingWhatIs />
			<LandingHowToPlay />
			<LandingCombos />
			<LandingMint />
			<LandingCta />
		</main>

		<footer class="lfoot">
			<img class="lfoot__logo" src="/images/logo.png" alt="Bonkhemist" />
			<p class="lfoot__tag">{{ $t('landing.footer.tagline') }}</p>
			<nav class="lfoot__links">
				<NuxtLink to="/">{{ $t('landing.footer.play') }}</NuxtLink>
				<NuxtLink to="/leaderboard">{{ $t('landing.footer.leaderboard') }}</NuxtLink>
			</nav>
			<p class="lfoot__rights">© {{ $t('landing.footer.rights') }}</p>
		</footer>
	</div>
</template>

<script setup>
import LandingHero from '~/components/Landing/LandingHero.vue';
import LandingWhatIs from '~/components/Landing/LandingWhatIs.vue';
import LandingHowToPlay from '~/components/Landing/LandingHowToPlay.vue';
import LandingCombos from '~/components/Landing/LandingCombos.vue';
import LandingMint from '~/components/Landing/LandingMint.vue';
import LandingCta from '~/components/Landing/LandingCta.vue';
import PixelButton from '~/components/Landing/PixelButton.vue';

definePageMeta({ layout: false });

const { t } = useI18n();
useHead({
	title: 'Bonkhemist — Start Here',
	meta: [
		{ name: 'description', content: t('landing.hero.subhead') },
	],
});
</script>

<style scoped lang="sass">
.landing
	// ---- design tokens (inherited by all children via CSS custom properties) ----
	--ll-yellow: #FFC627
	--ll-ink: #141210
	--ll-green: #0EDCA4
	--ll-violet: #8A5BFF
	--ll-ember: #FF5A2C
	--ll-paper: #FFFFFF
	--ll-paper-warm: #FFFDF3
	--ll-font-display: 'Bungee', cursive
	--ll-font-pixel: 'Silkscreen', monospace
	--ll-font-body: 'Inter', system-ui, sans-serif
	--ll-border: 3px solid var(--ll-ink)
	--ll-shadow: 6px 6px 0 var(--ll-ink)
	--ll-shadow-sm: 4px 4px 0 var(--ll-ink)

	min-height: 100dvh
	background-color: var(--ll-yellow)
	background-image: url('/images/yellow-pattern.png')
	background-repeat: repeat
	color: var(--ll-ink)
	font-family: var(--ll-font-body)

.lnav
	position: sticky
	top: 0
	z-index: 50
	display: flex
	align-items: center
	justify-content: space-between
	gap: 1rem
	padding: 0.7rem clamp(1rem, 5vw, 2.5rem)
	background: rgba(255, 198, 39, 0.92)
	backdrop-filter: blur(5px)
	border-bottom: var(--ll-border)

	&__brand img
		display: block
		height: clamp(30px, 5vw, 40px)
		width: auto
		image-rendering: pixelated

	&__right
		display: flex
		align-items: center
		gap: clamp(0.6rem, 2vw, 1.1rem)

.lfoot
	text-align: center
	padding: clamp(2.5rem, 5vw, 4rem) 1.5rem
	background: var(--ll-ink)
	border-top: var(--ll-border)
	color: var(--ll-paper)

	&__logo
		height: 34px
		width: auto
		image-rendering: pixelated

	&__tag
		font-family: var(--ll-font-pixel)
		font-size: 0.72rem
		text-transform: uppercase
		letter-spacing: 0.08em
		color: var(--ll-green)
		margin: 0.9rem 0 0

	&__links
		display: flex
		justify-content: center
		gap: 1.4rem
		margin: 1.3rem 0 0
		a
			font-family: var(--ll-font-pixel)
			font-size: 0.72rem
			text-transform: uppercase
			letter-spacing: 0.04em
			color: var(--ll-paper)
			text-decoration: none
			border-bottom: 2px solid transparent
			padding-bottom: 2px
			&:hover
				border-bottom-color: var(--ll-green)
			&:focus-visible
				outline: 2px solid var(--ll-green)
				outline-offset: 3px

	&__rights
		font-family: var(--ll-font-body)
		font-size: 0.8rem
		color: #9b988f
		margin: 1.6rem 0 0
</style>
