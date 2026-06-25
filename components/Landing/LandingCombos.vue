<template>
	<section class="combos">
		<div class="combos__inner">
			<header class="combos__head">
				<p class="eyebrow eyebrow--ember">{{ $t('landing.combos.eyebrow') }}</p>
				<h2 class="combos__heading">{{ $t('landing.combos.heading') }}</h2>
				<p class="combos__sub">{{ $t('landing.combos.sub') }}</p>
			</header>

			<ul class="grid">
				<li v-for="(eq, i) in equations" :key="i" class="eq" :class="{ 'eq--mystery': eq.mystery }">
					<ElementTile :icon="eq.a.icon" :label="$t(`landing.combos.${eq.a.key}`)" :tone="eq.a.tone" />
					<span class="op">{{ $t('landing.equation.plus') }}</span>
					<ElementTile :icon="eq.b.icon" :label="$t(`landing.combos.${eq.b.key}`)" :tone="eq.b.tone" />
					<span class="op">{{ $t('landing.equation.equals') }}</span>
					<div class="eq__result">
						<ElementTile :icon="eq.r.icon" :label="$t(`landing.combos.${eq.r.key}`)" :tone="eq.r.tone" />
						<span v-if="eq.mystery" class="eq__hint">{{ $t('landing.combos.mysteryLabel') }}</span>
					</div>
				</li>
			</ul>
		</div>
	</section>
</template>

<script setup>
import ElementTile from './ElementTile.vue';

const equations = [
	{ a: { icon: '💧', key: 'water', tone: 'water' }, b: { icon: '🔥', key: 'fire', tone: 'fire' }, r: { icon: '💨', key: 'steam', tone: 'steam' } },
	{ a: { icon: '💨', key: 'air', tone: 'air' }, b: { icon: '💧', key: 'water', tone: 'water' }, r: { icon: '☁️', key: 'cloud', tone: 'cloud' } },
	{ a: { icon: '🌍', key: 'earth', tone: 'earth' }, b: { icon: '🔥', key: 'fire', tone: 'fire' }, r: { icon: '🌋', key: 'volcano', tone: 'volcano' } },
	{ a: { icon: '🐉', key: 'dragon', tone: 'fire' }, b: { icon: '⚡', key: 'zeus', tone: 'legend' }, r: { icon: '?', key: 'mystery', tone: 'mystery' }, mystery: true },
];
</script>

<style scoped lang="sass">
.combos
	padding: clamp(3rem, 7vw, 6rem) clamp(1rem, 5vw, 4rem)
	background: var(--ll-violet)
	border-top: var(--ll-border)
	border-bottom: var(--ll-border)

	&__inner
		max-width: 1000px
		margin: 0 auto

	&__head
		text-align: center
		margin-bottom: clamp(2rem, 4vw, 3rem)

	&__heading
		font-family: var(--ll-font-display)
		font-size: clamp(1.7rem, 4.4vw, 3rem)
		line-height: 1.05
		margin: 1rem auto 0
		color: var(--ll-paper)
		text-shadow: var(--ll-shadow-sm)

	&__sub
		font-family: var(--ll-font-body)
		font-size: 1.05rem
		font-weight: 500
		line-height: 1.6
		margin: 0.9rem auto 0
		max-width: 44ch
		color: #efe9ff

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
	&--ember
		background: var(--ll-ember)
		color: var(--ll-paper)

.grid
	list-style: none
	padding: 0
	margin: 0
	display: grid
	grid-template-columns: repeat(2, 1fr)
	gap: clamp(1rem, 2.5vw, 1.5rem)

.eq
	display: flex
	align-items: center
	justify-content: center
	gap: clamp(0.3rem, 1vw, 0.7rem)
	flex-wrap: wrap
	background: var(--ll-paper-warm)
	border: var(--ll-border)
	box-shadow: var(--ll-shadow)
	border-radius: 6px
	padding: 1.2rem 0.8rem
	.op
		font-family: var(--ll-font-display)
		font-size: 1.2rem
		color: var(--ll-ink)

	&--mystery
		background: var(--ll-ink)
		.op
			color: var(--ll-paper)

	&__result
		display: flex
		flex-direction: column
		align-items: center
		gap: 0.4rem

	&__hint
		font-family: var(--ll-font-pixel)
		font-size: 0.55rem
		text-transform: uppercase
		letter-spacing: 0.04em
		color: var(--ll-paper)
		background: var(--ll-violet)
		border: 2px solid var(--ll-paper)
		padding: 0.25em 0.5em

@media (max-width: 760px)
	.grid
		grid-template-columns: 1fr
</style>
