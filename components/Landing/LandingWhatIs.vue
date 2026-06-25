<template>
	<section class="whatis">
		<div class="whatis__inner">
			<p class="eyebrow eyebrow--violet">{{ $t('landing.whatIs.eyebrow') }}</p>
			<h2 class="whatis__heading">{{ $t('landing.whatIs.heading') }}</h2>
			<p class="whatis__body">{{ $t('landing.whatIs.body') }}</p>

			<ul class="chips">
				<li class="chip"><span class="chip__dot" style="--c: var(--ll-violet)" />{{ $t('landing.whatIs.chip1') }}</li>
				<li class="chip"><span class="chip__dot" style="--c: var(--ll-green)" />{{ $t('landing.whatIs.chip2') }}</li>
				<li class="chip"><span class="chip__dot" style="--c: var(--ll-ember)" />{{ $t('landing.whatIs.chip3') }}</li>
			</ul>
		</div>
	</section>
</template>

<script setup></script>

<style scoped lang="sass">
.whatis
	padding: clamp(3rem, 7vw, 6rem) clamp(1rem, 5vw, 4rem)
	background: var(--ll-ink)
	color: var(--ll-paper)
	border-top: var(--ll-border)
	border-bottom: var(--ll-border)

	&__inner
		max-width: 880px
		margin: 0 auto
		text-align: center

	&__heading
		font-family: var(--ll-font-display)
		font-size: clamp(1.7rem, 4.4vw, 3rem)
		line-height: 1.05
		margin: 1rem auto 0
		max-width: 18ch
		color: var(--ll-paper)

	&__body
		font-family: var(--ll-font-body)
		font-size: clamp(1.05rem, 1.8vw, 1.3rem)
		line-height: 1.7
		font-weight: 400
		max-width: 56ch
		margin: 1.3rem auto 0
		color: #EDEAE2

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
	&--violet
		background: var(--ll-violet)
		color: var(--ll-paper)
		border-color: var(--ll-paper)

.chips
	list-style: none
	display: flex
	flex-wrap: wrap
	justify-content: center
	gap: 0.7rem
	padding: 0
	margin: 2.2rem 0 0

.chip
	display: inline-flex
	align-items: center
	gap: 0.5em
	font-family: var(--ll-font-pixel)
	font-size: 0.72rem
	text-transform: uppercase
	letter-spacing: 0.04em
	color: var(--ll-ink)
	background: var(--ll-paper)
	border: 2px solid var(--ll-ink)
	box-shadow: var(--ll-shadow-sm)
	padding: 0.55em 0.9em
	border-radius: 3px

	&__dot
		width: 12px
		height: 12px
		background: var(--c)
		border: 2px solid var(--ll-ink)
		display: inline-block
</style>
