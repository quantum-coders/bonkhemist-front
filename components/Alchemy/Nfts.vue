<template>
	<div class="nfts" :class="{ 'is-empty': alchemy.nfts.length === 0 }">
		<div class="empty text-center" v-if="alchemy.nfts.length === 0">
			<img class="doge" src="/images/doge.png" alt="">
			<p class="wow"><alchemy-animated-text text="Wow, such empty" /></p>
			<p>Mint any element to start your collection!</p>
		</div>
	</div>

</template>

<script setup>
	const alchemy = useAlchemyStore();
</script>

<style lang="sass" scoped>

	.nfts
		flex-grow: 1
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center

		&.is-empty
			position: absolute
			top: 0
			left: 0
			width: 100%
			height: 100%

		.empty
			display: flex
			flex-direction: column
			align-items: center
			justify-content: center
			font-family: Silkscreen, sans-serif
			color: #000
			position: absolute
			top: 0
			left: 0
			width: 100%
			height: 100%

			.wow
				color: #59CF93

			.doge
				width: 27px * 2
				height: 25px * 2
				image-rendering: pixelated
				margin-bottom: 1rem

</style>