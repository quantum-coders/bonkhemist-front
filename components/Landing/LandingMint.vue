<template>
	<section class="mint">
		<div class="mint__inner">
			<div class="mint__copy">
				<p class="eyebrow">{{ $t('landing.mint.eyebrow') }}</p>
				<h2 class="mint__heading">{{ $t('landing.mint.heading') }}</h2>
				<p class="mint__body">{{ $t('landing.mint.body') }}</p>
				<ul class="points">
					<li v-for="n in 4" :key="n" class="point">
						<span class="point__mark" aria-hidden="true">✦</span>
						{{ $t(`landing.mint.point${n}`) }}
					</li>
				</ul>
			</div>

			<div class="mint__art">
				<div class="card">
					<span class="card__badge">{{ $t('landing.whatIs.chip2') }}</span>
					<img class="card__img" src="/images/nft-image.png" alt="" loading="lazy" />
					<div class="card__foot">
						<img class="card__chain" src="/images/solana.png" alt="Solana" loading="lazy" />
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup></script>

<style scoped lang="sass">
.mint
	padding: clamp(3rem, 7vw, 6rem) clamp(1rem, 5vw, 4rem)

	&__inner
		max-width: 1080px
		margin: 0 auto
		display: grid
		grid-template-columns: 1fr 0.8fr
		gap: clamp(2rem, 5vw, 4rem)
		align-items: center

	&__heading
		font-family: var(--ll-font-display)
		font-size: clamp(1.7rem, 4.4vw, 3rem)
		line-height: 1.05
		margin: 1rem 0 0
		max-width: 16ch
		color: var(--ll-ink)

	&__body
		font-family: var(--ll-font-body)
		font-size: clamp(1.02rem, 1.6vw, 1.18rem)
		line-height: 1.7
		font-weight: 450
		margin: 1.2rem 0 0
		max-width: 46ch
		color: #2c2a26

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

.points
	list-style: none
	padding: 0
	margin: 1.8rem 0 0
	display: grid
	gap: 0.7rem

.point
	display: flex
	align-items: center
	gap: 0.7em
	font-family: var(--ll-font-body)
	font-weight: 600
	font-size: 1rem
	color: var(--ll-ink)
	&__mark
		color: var(--ll-violet)
		font-size: 1.1rem

.mint__art
	display: flex
	justify-content: center

.card
	position: relative
	background: var(--ll-paper)
	border: var(--ll-border)
	box-shadow: var(--ll-shadow)
	border-radius: 8px
	padding: 14px
	max-width: 320px
	transform: rotate(2deg)

	&__badge
		position: absolute
		top: -14px
		left: -10px
		z-index: 2
		font-family: var(--ll-font-pixel)
		font-size: 0.6rem
		text-transform: uppercase
		letter-spacing: 0.03em
		color: var(--ll-paper)
		background: var(--ll-violet)
		border: 2px solid var(--ll-ink)
		box-shadow: var(--ll-shadow-sm)
		padding: 0.4em 0.6em
		transform: rotate(-4deg)

	&__img
		display: block
		width: 100%
		image-rendering: pixelated
		border: 2px solid var(--ll-ink)
		background: var(--ll-yellow)

	&__foot
		display: flex
		align-items: center
		justify-content: flex-end
		padding-top: 10px

	&__chain
		height: 22px
		width: auto

@media (max-width: 820px)
	.mint__inner
		grid-template-columns: 1fr
		text-align: center
	.mint__body, .points
		margin-left: auto
		margin-right: auto
	.point
		justify-content: center
</style>
