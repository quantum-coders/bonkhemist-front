<template>
	<div class="challenges-wrapper">
		<div class="challenges-modal">
			<a href="#" class="close" @click="ready">
				<img src="/images/close.png" alt="">
			</a>

			<div class="frame-top"></div>
			<div class="frame-bottom"></div>
			<div class="frame-left"></div>
			<div class="frame-right"></div>
			<img class="frame-lb" src="/images/combining-left-bottom.png" alt="">
			<img class="frame-rb" src="/images/combining-right-bottom.png" alt="">
			<img class="frame-lt" src="/images/combining-left-top.png" alt="">
			<img class="frame-rt" src="/images/combining-right-top.png" alt="">

			<div class="loading" v-if="!!alchemy.challengesLoading">
				<img src="/images/bonk.png" class="bonk" alt="">
				<p><alchemy-animated-text text="Challenges&nbsp;Loading" /></p>
			</div>

			<div v-else class="modal-content text-center">
				<h4>Challenges</h4>
				<p>Select one of the following rad challenges!</p>

				<div class="challenges">
					<template v-for="challenge in alchemy.challengesSuggestions">
						<alchemy-element :element="{ name: challenge }" />
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	const emit = defineEmits([ 'ready' ]);
	const alchemy = useAlchemyStore();

	const ready = () => {
		alchemy.challengesSuggestions = [];
		emit('ready');
	};
</script>

<style lang="sass" scoped>

	.loading
		display: flex
		justify-content: center
		align-items: center
		flex-direction: column
		flex-grow: 1

		.bonk
			width: 67px * 2
			image-rendering: pixelated
			margin-bottom: 1rem

	.challenges-wrapper
		display: flex
		justify-content: center
		align-items: center
		flex-direction: column
		font-family: Silkscreen, sans-serif
		position: absolute
		left: 0
		top: 36px
		width: 100%
		height: calc(100% - 36px)
		z-index: 10
		background: rgba(white, 0.5)

		.close
			position: absolute
			right: 2rem
			top: 1.5rem
			cursor: pointer
			z-index: 100

			img
				width: 10px
				height: 10px
				image-rendering: pixelated

		.challenges-modal
			position: absolute
			top: 50%
			left: 50%
			width: 70%
			min-height: 310px
			padding: 2rem
			background: white
			z-index: 1
			margin-left: -35%
			margin-top: -155px
			display: flex
			flex-direction: column
			justify-content: center
			align-items: center

			.frame-top
				position: absolute
				top: 0
				left: 18px
				width: calc(100% - 18px - 18px)
				height: 18px
				background: url('/images/combining-top.png') repeat-x
				background-size: auto 100%
				image-rendering: pixelated
				z-index: 0

			.frame-bottom
				position: absolute
				bottom: 0
				left: 18px
				width: calc(100% - 18px - 18px)
				height: 18px
				background: url('/images/combining-bottom.png') repeat-x
				background-size: auto 100%
				image-rendering: pixelated
				z-index: 0

			.frame-left
				position: absolute
				top: 18px
				left: 0
				width: 18px
				height: calc(100% - 18px - 18px)
				background: url('/images/combining-left.png') repeat-y
				background-size: 100% auto
				image-rendering: pixelated
				z-index: 0

			.frame-right
				position: absolute
				top: 18px
				right: 0
				width: 18px
				height: calc(100% - 18px - 18px)
				background: url('/images/combining-right.png') repeat-y
				background-size: 100% auto
				image-rendering: pixelated
				z-index: 0

			.frame-lb
				position: absolute
				bottom: 0
				left: 0
				z-index: 1
				width: 18px
				height: 18px
				image-rendering: pixelated

			.frame-rb
				position: absolute
				bottom: 0
				right: 0
				z-index: 1
				width: 18px
				height: 18px
				image-rendering: pixelated

			.frame-lt
				position: absolute
				top: 0
				left: 0
				z-index: 1
				width: 18px
				height: 18px
				image-rendering: pixelated


			.frame-rt
				position: absolute
				top: 0
				right: 0
				z-index: 1
				width: 18px
				height: 18px
				image-rendering: pixelated

			.challenges
				display: flex
				justify-content: space-around
				flex-wrap: wrap
				gap: 1rem
				margin-top: 1rem

				.element
					flex-basis: calc(50% - 2rem)
</style>