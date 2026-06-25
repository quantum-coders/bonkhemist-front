<template>
	<section class="hero">
		<!-- ambient floating element tiles -->
		<div class="hero__ambient" aria-hidden="true">
			<ElementTile class="amb amb--1" icon="🌍" :label="$t('landing.combos.earth')" tone="earth" floating :delay="0" />
			<ElementTile class="amb amb--2" icon="💨" :label="$t('landing.combos.air')" tone="air" floating :delay="0.8" />
			<ElementTile class="amb amb--3" icon="⚡" :label="$t('landing.combos.zeus')" tone="legend" floating :delay="1.6" />
			<ElementTile class="amb amb--4" icon="🐉" :label="$t('landing.combos.dragon')" tone="fire" floating :delay="0.4" />
		</div>

		<div class="hero__inner">
			<div class="hero__copy">
				<p class="eyebrow">{{ $t('landing.hero.eyebrow') }}</p>
				<h1 class="hero__title">
					<span class="w w--green">{{ $t('landing.hero.title1') }}</span>
					<span class="w w--violet">{{ $t('landing.hero.title2') }}</span>
					<span class="w w--ink">{{ $t('landing.hero.title3') }}</span>
				</h1>
				<p class="hero__sub">{{ $t('landing.hero.subhead') }}</p>
				<div class="hero__cta">
					<PixelButton to="/" variant="primary" size="lg">{{ $t('landing.hero.cta') }}</PixelButton>
					<PixelButton variant="ghost" size="lg" @click="scrollToHow">{{ $t('landing.hero.scrollHint') }} ↓</PixelButton>
				</div>
			</div>

			<!-- THE SIGNATURE: a live combine equation -->
			<div class="hero__lab">
				<div class="equation">
					<ElementTile icon="💧" :label="$t('landing.combos.water')" tone="water" />
					<span class="op">{{ $t('landing.equation.plus') }}</span>
					<ElementTile icon="🔥" :label="$t('landing.combos.fire')" tone="fire" />
					<span class="op">{{ $t('landing.equation.equals') }}</span>
					<ElementTile class="result" icon="💨" :label="$t('landing.combos.steam')" tone="steam" />
				</div>
				<span class="bonk-tag">BONK!</span>
			</div>
		</div>
	</section>
</template>

<script setup>
import ElementTile from './ElementTile.vue';
import PixelButton from './PixelButton.vue';

const scrollToHow = () => {
	document.getElementById('how')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>

<style scoped lang="sass">
.hero
	position: relative
	overflow: hidden
	padding: clamp(2rem, 6vw, 5rem) clamp(1rem, 5vw, 4rem) clamp(3rem, 7vw, 6rem)

	&__inner
		position: relative
		z-index: 2
		max-width: 1180px
		margin: 0 auto
		display: grid
		grid-template-columns: 1.1fr 0.9fr
		gap: clamp(2rem, 5vw, 4rem)
		align-items: center

	&__title
		font-family: var(--ll-font-display)
		font-size: clamp(3rem, 9vw, 6.2rem)
		line-height: 0.95
		margin: 0.4rem 0 0
		text-shadow: var(--ll-shadow-sm)
		.w
			display: block
		.w--green
			color: var(--ll-green)
		.w--violet
			color: var(--ll-violet)
		.w--ink
			color: var(--ll-ink)

	&__sub
		font-family: var(--ll-font-body)
		font-size: clamp(1rem, 1.6vw, 1.2rem)
		line-height: 1.6
		font-weight: 500
		max-width: 30ch
		margin: 1.4rem 0 0
		color: var(--ll-ink)

	&__cta
		display: flex
		flex-wrap: wrap
		gap: 0.9rem
		margin-top: 2rem

	&__lab
		display: flex
		flex-direction: column
		align-items: center
		gap: 0.6rem

	&__ambient
		position: absolute
		inset: 0
		z-index: 1
		pointer-events: none
		.amb
			position: absolute
			opacity: 0.85
		.amb--1
			top: 8%
			right: 6%
		.amb--2
			bottom: 14%
			left: 3%
		.amb--3
			top: 18%
			left: 8%
		.amb--4
			bottom: 8%
			right: 12%

.eyebrow
	display: inline-block
	font-family: var(--ll-font-pixel)
	font-size: 0.72rem
	text-transform: uppercase
	letter-spacing: 0.14em
	color: var(--ll-ink)
	background: var(--ll-green)
	border: 2px solid var(--ll-ink)
	padding: 0.35em 0.7em
	margin: 0
	box-shadow: var(--ll-shadow-sm)

.equation
	display: flex
	align-items: center
	gap: clamp(0.4rem, 1.5vw, 1rem)
	flex-wrap: wrap
	justify-content: center
	background: var(--ll-paper-warm)
	border: var(--ll-border)
	box-shadow: var(--ll-shadow)
	padding: clamp(1rem, 3vw, 1.8rem)
	border-radius: 6px
	transform: rotate(-1.2deg)
	.op
		font-family: var(--ll-font-display)
		font-size: 1.6rem
		color: var(--ll-ink)
	.result
		animation: pop 2.4s ease-in-out infinite

.bonk-tag
	font-family: var(--ll-font-display)
	font-size: 1rem
	color: var(--ll-paper)
	background: var(--ll-ember)
	border: 2px solid var(--ll-ink)
	box-shadow: var(--ll-shadow-sm)
	padding: 0.25em 0.7em
	transform: rotate(4deg)
	animation: nudge 2.4s ease-in-out infinite

@keyframes pop
	0%, 70%, 100%
		transform: scale(1)
	78%
		transform: scale(1.12) rotate(3deg)
	86%
		transform: scale(0.98)

@keyframes nudge
	0%, 70%, 100%
		transform: rotate(4deg) translateY(0)
	80%
		transform: rotate(4deg) translateY(-6px) scale(1.1)

@media (max-width: 820px)
	.hero__inner
		grid-template-columns: 1fr
		text-align: center
	.hero__sub
		margin-left: auto
		margin-right: auto
	.hero__cta
		justify-content: center
	.hero__ambient .amb--3, .hero__ambient .amb--1
		display: none

@media (prefers-reduced-motion: reduce)
	.equation .result, .bonk-tag
		animation: none
</style>
