<template>

	<div class="how-to-wrapper">

		<a href="#" class="close" @click="$emit('ready')">
			<img src="/images/close.png" alt="">
		</a>

		<h2>{{ $t('howTo.title') }}</h2>
		<div class="step-wrapper">
			<div class="step step1" v-show="step === 0">
				<i18n-t keypath="howTo.step1Intro" tag="p">
					<template #bonkhemist>
						<strong>
							<alchemy-animated-text text="Bonkhemist" />
							!</strong>
					</template>
				</i18n-t>

				<p>{{ $t('howTo.step1Wallet') }}</p>

				<div class="buttons">
					<button @click="step++">{{ $t('howTo.next') }}</button>
				</div>
			</div>

			<div class="step step2" v-show="step === 1">
				<p>{{ $t('howTo.step2Basic') }}</p>

				<div class="elements">
					<alchemy-element class="is-deleting" :element="{ name: 'earth' }" />
					<alchemy-element class="is-deleting" :element="{ name: 'water' }" />
					<alchemy-element class="is-deleting" :element="{ name: 'fire' }" />
					<alchemy-element class="is-deleting" :element="{ name: 'air' }" />
				</div>

				<p>{{ $t('howTo.step2Mix') }}</p>
				<p>{{ $t('howTo.step2Steam') }}</p>
				<div class="elements">
					<alchemy-element class="is-deleting" :element="{ name: 'water' }" />
					+
					<alchemy-element class="is-deleting" :element="{ name: 'fire' }" />
					=
					<alchemy-element class="is-deleting" :element="{ name: 'steam' }" />
				</div>

				<p>{{ $t('howTo.step2Cloud') }}</p>
				<div class="elements">
					<alchemy-element class="is-deleting" :element="{ name: 'air' }" />
					<alchemy-element class="is-deleting" :element="{ name: 'water' }" />
					=
					<alchemy-element class="is-deleting" :element="{ name: 'cloud' }" />
				</div>

				<i18n-t keypath="howTo.step2Endless" tag="p">
					<template #endless>
						<strong>
							<alchemy-animated-text text="endless" />
							!</strong>
					</template>
				</i18n-t>

				<div class="buttons">
					<button @click="step--">{{ $t('howTo.back') }}</button>
					<button @click="step++">{{ $t('howTo.next') }}</button>
				</div>
			</div>

			<div class="step step3" v-show="step === 2">
				<i18n-t keypath="howTo.step3Adore" tag="p">
					<template #awesome>
						<strong>
							<alchemy-animated-text text="Awesome" />
						</strong>
					</template>
				</i18n-t>
				<p>{{ $t('howTo.step3MintBox') }}</p>

				<img src="/images/mint.png" class="box">

				<p>{{ $t('howTo.step3BonkCoin') }}</p>
				<i18n-t keypath="howTo.step3OnceMinted" tag="p">
					<template #br><br></template>
					<template #history>
						<strong>
							<alchemy-animated-text text="alchemical history" />
							!</strong>
					</template>
				</i18n-t>

				<div class="buttons">
					<button @click="step--">{{ $t('howTo.back') }}</button>
					<button @click="step++">{{ $t('howTo.next') }}</button>
				</div>
			</div>

			<div class="step step4" v-show="step === 3">
				<img src="/images/bonk.png" class="bonk" alt="">

				<p>{{ $t('howTo.step4Clone') }}</p>
				<p>{{ $t('howTo.step4Delete') }}</p>

				<i18n-t keypath="howTo.step4HaveFun" tag="p">
					<template #haveFun>
						<strong>
							<alchemy-animated-text text="have fun" />
							!</strong>
					</template>
				</i18n-t>
				<p>{{ $t('howTo.step4Imagination') }}</p>
				<p>{{ $t('howTo.step4Share') }}</p>

				<div class="buttons">
					<button @click="step--">{{ $t('howTo.back') }}</button>
					<button @click="ready">{{ $t('howTo.ready') }}</button>
				</div>
			</div>
		</div>
	</div>

</template>

<script setup>
	const step = ref(0);

	const emit = defineEmits([ 'ready' ]);

	const ready = () => {
		step.value = 0;
		emit('ready');
	};

</script>

<style lang="sass" scoped>
	.how-to-wrapper
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
		background: rgba(white, 0.95)

		.close
			width: 10px
			height: 10px
			position: absolute
			right: 1rem
			top: 1rem
			cursor: pointer

			img
				width: 10px
				height: 10px
				position: absolute
				top: 0
				left: 0
				image-rendering: pixelated

		&.is-hidden
			display: none

		.step-wrapper
			max-width: 80%

			.step
				text-align: center

				strong
					color: #59CF93

				.elements
					display: flex
					justify-content: center
					gap: 1rem
					align-items: center
					margin: 1rem 0

				.box
					width: 73px * 2
					image-rendering: pixelated
					margin-bottom: 1rem

				.bonk
					width: 67px * 2
					image-rendering: pixelated
					margin: 1rem 0

				.buttons
					display: flex
					justify-content: space-around

					button
						border: 2px solid black
						padding: 0.25rem 1rem

						&:hover
							background: #59CF93
							color: white
							border-color: white
							outline: 2px solid #59CF93
</style>
