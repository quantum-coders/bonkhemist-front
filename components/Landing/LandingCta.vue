<template>
	<section class="final">
		<div class="final__panel">
			<h2 class="final__heading">{{ $t('landing.finalCta.heading') }}</h2>
			<p class="final__body">{{ $t('landing.finalCta.body') }}</p>
			<PixelButton to="/" variant="primary" size="lg">{{ $t('landing.finalCta.cta') }}</PixelButton>
		</div>
	</section>
</template>

<script setup>
import PixelButton from './PixelButton.vue';
</script>

<style scoped lang="sass">
.final
	padding: clamp(3rem, 7vw, 6rem) clamp(1rem, 5vw, 4rem)

	&__panel
		max-width: 820px
		margin: 0 auto
		text-align: center
		background: var(--ll-ink)
		border: var(--ll-border)
		box-shadow: var(--ll-shadow)
		border-radius: 10px
		padding: clamp(2.5rem, 6vw, 4.5rem) clamp(1.5rem, 5vw, 3rem)

	&__heading
		font-family: var(--ll-font-display)
		font-size: clamp(1.9rem, 5vw, 3.4rem)
		line-height: 1.02
		margin: 0
		color: var(--ll-green)

	&__body
		font-family: var(--ll-font-body)
		font-size: clamp(1.05rem, 1.8vw, 1.3rem)
		line-height: 1.6
		font-weight: 500
		margin: 1.2rem auto 2rem
		max-width: 40ch
		color: #EDEAE2
</style>
