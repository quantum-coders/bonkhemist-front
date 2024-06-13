<template>

	<div class="how-to-wrapper">

		<a href="#" class="close" @click="$emit('ready')">
			<img src="/images/close.png" alt="">
		</a>

		<h2>How to play</h2>
		<div class="step-wrapper">
			<div class="step step1" v-show="step === 0">
				<p>Ladies and gentlemen, alchemists and crypto enthusiasts, gather 'round for the magical journey into the world of
					<strong>
						<alchemy-animated-text text="Bonkhemist" />
						!</strong></p>

				<p>First things first, you need to connect your cryptocurrency wallet. This is your magical pouch that holds your precious BONK COIN.</p>

				<div class="buttons">
					<button @click="step++">Next</button>
				</div>
			</div>

			<div class="step step2" v-show="step === 1">
				<p>You start with the basic four: earth, water, fire, and air.</p>

				<div class="elements">
					<alchemy-element class="is-deleting" :element="{ name: 'earth' }" />
					<alchemy-element class="is-deleting" :element="{ name: 'water' }" />
					<alchemy-element class="is-deleting" :element="{ name: 'fire' }" />
					<alchemy-element class="is-deleting" :element="{ name: 'air' }" />
				</div>

				<p>Select two elements and mix them together. Watch the magic happen as they combine to form something entirely new!</p>
				<p>For example, mix water and fire to get steam.</p>
				<div class="elements">
					<alchemy-element class="is-deleting" :element="{ name: 'water' }" />
					+
					<alchemy-element class="is-deleting" :element="{ name: 'fire' }" />
					=
					<alchemy-element class="is-deleting" :element="{ name: 'steam' }" />
				</div>

				<p>Combine air and water to create a cloud.</p>
				<div class="elements">
					<alchemy-element class="is-deleting" :element="{ name: 'air' }" />
					<alchemy-element class="is-deleting" :element="{ name: 'water' }" />
					=
					<alchemy-element class="is-deleting" :element="{ name: 'cloud' }" />
				</div>

				<p>Keep experimenting to discover all the cool and weird combinations. The possibilities are <strong>
					<alchemy-animated-text text="endless" />
					!</strong>!
				</p>

				<div class="buttons">
					<button @click="step--">Back</button>
					<button @click="step++">Next</button>
				</div>
			</div>

			<div class="step step3" v-show="step === 2">
				<p>Found an element that you absolutely adore? <strong>
					<alchemy-animated-text text="Awesome" />
				</strong>!
				</p>
				<p>Drag and drop the element into the MAGICAL BONK-BOX to mint it. If it was not already minted, you will be the first owner of this unique element.</p>

				<img src="/images/mint.png" class="box">

				<p>Use your BONK COIN to mint the element. You can mint as many elements as you want, as long as you have enough BONK COIN and the element is not already minted.</p>
				<p>Once minted, the element is yours forever, with its unique value backed by BONK COIN. Congratulations,<br>you now own a piece of
					<strong>
						<alchemy-animated-text text="alchemical history" />
						!</strong>!
				</p>

				<div class="buttons">
					<button @click="step--">Back</button>
					<button @click="step++">Next</button>
				</div>
			</div>

			<div class="step step4" v-show="step === 3">
				<img src="/images/bonk.png" class="bonk" alt="">

				<p>Double click an element to clone it.</p>
				<p>Drag an element to the trash can to delete it.</p>

				<p>And finally, the most important step of all – <strong>
					<alchemy-animated-text text="have fun" />
					!</strong>!
				</p>
				<p>Let your imagination run wild, mix up a storm, and discover all the fantastical creations Bonkhemist has to offer.</p>
				<p>Share your unique elements with friends, show off your minted treasures, and enjoy the magical world of Bonkhemist.</p>

				<div class="buttons">
					<button @click="step--">Back</button>
					<button @click="ready">READY!</button>
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