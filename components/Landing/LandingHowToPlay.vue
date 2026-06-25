<template>
	<section id="how" class="how">
		<div class="how__inner">
			<header class="how__head">
				<p class="eyebrow">{{ $t('landing.how.eyebrow') }}</p>
				<h2 class="how__heading">{{ $t('landing.how.heading') }}</h2>
			</header>

			<ol class="steps">
				<li v-for="s in steps" :key="s.n" class="step" :style="{ '--accent': s.accent }">
					<span class="step__num">{{ s.n }}</span>
					<span class="step__icon" aria-hidden="true">{{ s.icon }}</span>
					<h3 class="step__title">{{ $t(`landing.how.step${s.n}Title`) }}</h3>
					<p class="step__body">{{ $t(`landing.how.step${s.n}Body`) }}</p>
				</li>
			</ol>
		</div>
	</section>
</template>

<script setup>
const steps = [
	{ n: 1, icon: '👛', accent: 'var(--ll-green)' },
	{ n: 2, icon: '🧪', accent: 'var(--ll-violet)' },
	{ n: 3, icon: '✨', accent: 'var(--ll-ember)' },
	{ n: 4, icon: '🪙', accent: '#3FA9F5' },
];
</script>

<style scoped lang="sass">
.how
	padding: clamp(3rem, 7vw, 6rem) clamp(1rem, 5vw, 4rem)

	&__inner
		max-width: 1080px
		margin: 0 auto

	&__head
		text-align: center
		margin-bottom: clamp(2rem, 4vw, 3rem)

	&__heading
		font-family: var(--ll-font-display)
		font-size: clamp(1.7rem, 4.4vw, 3rem)
		line-height: 1.05
		margin: 1rem auto 0
		max-width: 18ch
		color: var(--ll-ink)

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

.steps
	list-style: none
	padding: 0
	margin: 0
	display: grid
	grid-template-columns: repeat(2, 1fr)
	gap: clamp(1rem, 2.5vw, 1.6rem)

.step
	position: relative
	background: var(--ll-paper)
	border: var(--ll-border)
	box-shadow: var(--ll-shadow)
	border-radius: 6px
	padding: 1.6rem 1.5rem 1.5rem
	// left accent bar = the step's color
	&::before
		content: ''
		position: absolute
		left: 0
		top: 0
		bottom: 0
		width: 10px
		background: var(--accent)
		border-right: 2px solid var(--ll-ink)

	&__num
		position: absolute
		top: -18px
		right: 16px
		font-family: var(--ll-font-display)
		font-size: 1.5rem
		color: var(--ll-paper)
		background: var(--ll-ink)
		border: 2px solid var(--ll-ink)
		width: 44px
		height: 44px
		display: grid
		place-items: center
		box-shadow: var(--ll-shadow-sm)

	&__icon
		font-size: 2.1rem
		line-height: 1
		display: block

	&__title
		font-family: var(--ll-font-display)
		font-size: 1.05rem
		text-transform: uppercase
		margin: 0.7rem 0 0
		color: var(--ll-ink)

	&__body
		font-family: var(--ll-font-body)
		font-size: 1rem
		line-height: 1.6
		font-weight: 450
		margin: 0.5rem 0 0
		color: #2c2a26

@media (max-width: 720px)
	.steps
		grid-template-columns: 1fr
</style>
