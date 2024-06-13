<template>
	<div class="global-wrapper">
		<div class="app-wrapper">
			<img class="combining-left-bottom" src="/images/combining-left-bottom.png" alt="">
			<img class="combining-right-bottom" src="/images/combining-right-bottom.png" alt="">

			<header class="app-header">
				<img class="logo" src="/images/logo.png" alt="">

				<img class="header-top-left" src="/images/header-top-left.png" alt="">
				<img class="header-back" src="/images/header-back.png" alt="">
				<img class="header-right" src="/images/header-right.png" alt="">

				<web3-wallet-connect />
			</header>

			<div class="game-wrapper">
				<div class="combining-left" />
				<div class="combining-bottom" />

				<div class="combining-wrapper">
					<alchemy-mint v-if="!!alchemy.mintVisible" @ready="alchemy.resetMint" />
					<alchemy-challenges v-if="challengesVisible" @ready="challengesVisible = false" />
					<alchemy-how-to @ready="howTo = false" class="how-to" :class="{ 'is-hidden': !howTo }" />

					<div class="menu d-flex align-items-center">

						<div class="music-icon">
							<img src="/images/music.gif" v-if="musicPlaying" alt="">
							<img src="/images/music.png" v-else alt="">
						</div>

						<animated-button
							@click.prevent="toggleMusic"
							class="play-music"
							:text="!!musicPlaying ? 'Pause&nbsp;Music' : 'Play&nbsp;Music'"
						/>

						<animated-button
							class="button how-to-play ms-auto"
							@click.prevent="challengesVisible = true; alchemy.generateChallenges()"
							:text="alchemy.activeChallenge ? `Challenge:&nbsp;${ alchemy.activeChallenge.name.replace(' ', '&nbsp;') }` : 'Challenges'"
						/>

						<animated-button
							class="button how-to-play"
							@click.prevent="alchemy.clearElements()"
							text="Clear&nbsp;Elements"
						/>

						<animated-button
							class="button how-to-play"
							@click.prevent="howTo = true"
							text="How&nbsp;to&nbsp;play"
						/>
					</div>

					<div class="last-combination" v-if="!!alchemy.lastCombination">
						<a class="view" href="#">View Reason</a>

						<div class="combination-wrapper">
							<p>You created <strong>{{ alchemy.lastCombination.result }}</strong>! From
								<strong>{{ alchemy.lastCombination.element1 }}</strong> +
								<strong>{{ alchemy.lastCombination.element2 }}</strong></p>
							<p>Reason: <strong>{{ alchemy.lastCombination.reasoning }}</strong></p>
						</div>
					</div>

					<div class="combining-area">
						<template v-if="!!alchemy.connectedWallet">
							<template v-for="element in alchemy.elements" :key="element.id">
								<alchemy-element
									:element="element"
									:class="{ 'is-merging': !!element.loading, 'is-deleting': !!element.deleting }"
									v-if="element.visible"
									@dblclick.stop="alchemy.cloneElement($event, rebindElements)"
								/>
							</template>

							<div class="mint-drop-zone"></div>
							<div class="delete-drop-zone" :class="{ 'opened': !!somethingDeleting }"></div>
						</template>
					</div>
				</div>

				<div class="combining-middle" />

				<div class="index-area">
					<template v-if="!!alchemy.connectedWallet">
						<div class="search">
							<a
								v-if="!!alchemy.search"
								@click.prevent="alchemy.search = ''"
								href="#"
								class="delete-query"
							><img src="/images/close.png" alt=""></a>

							<!-- search input -->
							<input
								type="text"
								placeholder="Search Element..."
								v-model="alchemy.search"
							/>
						</div>
						<div class="elements-wrapper">

							<div class="scroll-wrapper">
								<div class="elements" v-if="indexMode === 'elements'">
									<alchemy-element
										v-for="element in filteredElements"
										@click="alchemy.createElementFromAvailable(element.slug, rebindElements)"
										:element="element"
									/>
								</div>
								<AlchemyNfts v-else-if="indexMode === 'nfts'" />
							</div>
						</div>
						<div class="tabs d-flex">
							<alchemy-animated-button
								text="Elements"
								@click="indexMode = 'elements'"
								:class="{ 'is-active': indexMode === 'elements' }"
							/>
							<alchemy-animated-button
								text="NFT's"
								@click="indexMode = 'nfts'"
								:class="{ 'is-active': indexMode === 'nfts' }"
							/>
						</div>

					</template>
					<div v-else class="loading-elements">
						<img src="/images/bonk.png" class="bonk" alt="">

						<p>
							<alchemy-animated-text text="Connect your wallet" />
						</p>
					</div>
				</div>
				<div class="combining-right" />
			</div>
		</div>
	</div>
</template>

<script setup>
	import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
	import { Buffer } from 'buffer';
	import DragSelect from 'dragselect';
	import Velocity from 'velocity-animate';
	import { v4 as uuidv4 } from 'uuid';
	import AnimatedButton from '~/components/Alchemy/AnimatedButton.vue';
	const ds = ref(null);
	const { errorToast, successToast } = usePrettyToast();

	const alchemy = useAlchemyStore();
	const config = useRuntimeConfig();
	const dsStarted = ref(false);
	const howTo = ref(true);
	const challengesVisible = ref(false);

	const elements = ref([]);
	const somethingDeleting = ref(false);
	const musicPlaying = ref(false);
	const loopMusic = ref(null);
	const indexMode = ref('elements');

	const rebindElements = () => {
		ds.value.addSelectables(document.querySelectorAll('.element:not(.is-merging):not(.is-deleting)'));
	};

	const filteredElements = computed(() => {

		if(!alchemy.search) return alchemy.availableElements;

		return alchemy.availableElements.filter((element) => {
			return element.name.toLowerCase().includes(alchemy.search.toLowerCase());
		});
	});

	const getRawTransaction = (encodedTransaction) => {
		let recoveredTransaction;
		try {
			recoveredTransaction = Transaction.from(
				Buffer.from(encodedTransaction, 'base64'),
			);
		} catch(error) {
			recoveredTransaction = VersionedTransaction.deserialize(
				Buffer.from(encodedTransaction, 'base64'),
			);
		}

		return recoveredTransaction;
	};

	const startDragSelect = () => {
		ds.value = new DragSelect({
			useTransform: false,
			area: document.querySelector('.combining-area'),
			selectables: document.querySelectorAll('.element'),
			dropZones: [
				{
					element: document.querySelector('.delete-drop-zone'),
					id: 'delete-zone',
				},
				{
					element: document.querySelector('.mint-drop-zone'),
					id: 'mint-zone',
				},
			],
		});

		ds.value.subscribe('DS:end', async (callbackObject) => {

			if(!!callbackObject.items && callbackObject.items.length === 1) {
				const droppedElement = callbackObject.items[0];

				let selectedOverlappingElement = null;
				let currentOverlappingPercentage = 0;

				// check the drop element against all elements
				alchemy.elements.forEach((element) => {
					// if the dropped element is the same as the element in the elements array, skip
					if(droppedElement.id === element.id) return;

					// if the element is not visible, skip
					if(!element.visible) return;

					const elementDom = document.querySelector(`#${ element.id }`);

					if(alchemy.isOverlapping(droppedElement, elementDom)) {
						const percentage = alchemy.getOverlapPercentage(droppedElement, elementDom);

						if(percentage.op1 > currentOverlappingPercentage) {
							currentOverlappingPercentage = percentage.op1;
							selectedOverlappingElement = element;
						}
					}
				});

				if(!!selectedOverlappingElement) {
					const element1 = alchemy.elements.find((el) => el.id === selectedOverlappingElement.id);
					const element2 = alchemy.elements.find((el) => el.id === droppedElement.id);

					element1.loading = true;
					element2.loading = true;

					rebindElements();

					const element1Dom = document.querySelector(`#${ element1.id }`);
					const element2Dom = document.querySelector(`#${ element2.id }`);

					// find which of the two elements is closets to the left
					const leftElement = element1Dom.style.left < element2Dom.style.left ? element1Dom : element2Dom;

					// find which of the two elements is closets to the top
					const topElement = element1Dom.style.top < element2Dom.style.top ? element1Dom : element2Dom;

					// get leftElement.style.left without the px
					const leftPosition = parseInt(leftElement.style.left.replace('px', ''));

					// get topElement.style.top without the px
					const topPosition = parseInt(topElement.style.top.replace('px', ''));

					Velocity(element1Dom, {
						left: leftPosition + 'px',
						top: topPosition + (element1Dom.id === topElement.id ? 0 : 40) + 'px',
					}, {
						duration: 500,
					});

					Velocity(element2Dom, {
						left: leftPosition + 'px',
						top: topPosition + (element2Dom.id === topElement.id ? 0 : 40) + 'px',
					}, {
						duration: 500,
					});

					// add a div with class .bonk to .combining-area
					const bonk = document.createElement('div');
					const bonkId = uuidv4();
					bonk.classList.add('bonk');
					bonk.id = 'bonk-' + bonkId;
					document.querySelector('.combining-area').appendChild(bonk);

					Velocity(bonk, {
						left: (leftPosition - 120) + 'px',
						top: (topPosition - 20) + 'px',
					}, {
						duration: 500,
					});

					// get accessTokens from localStorage
					const accessToken = localStorage.getItem('accessToken');

					const combineRes = await fetch(`${ config.public.apiUrl }/elements/combine`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${ accessToken }`,
						},
						body: JSON.stringify({
							element1: element1.slug,
							element2: element2.slug,
						}),
					});

					if(combineRes.ok) {

						bonk.classList.add('animated');

						// play bonk sound
						const bonkSound = new Audio('/sounds/bonk.mp3');
						await bonkSound.play();

						// wait 500ms
						await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });

						// add a div with class .bonk to .combining-area
						const cloud = document.createElement('div');
						const cloudId = uuidv4();
						cloud.classList.add('cloud');
						cloud.id = 'cloud-' + cloudId;
						document.querySelector('.combining-area').appendChild(cloud);
						cloud.style.left = (leftPosition - 10) + 'px';
						cloud.style.top = (topPosition - 20) + 'px';

						// add class animated to cloud
						cloud.classList.add('animated');

						const combination = await combineRes.json();

						alchemy.lastCombination = combination.data;

						if(!!alchemy.activeChallenge) {

							const accessToken = localStorage.getItem('accessToken');
							fetch(`${ config.public.apiUrl }/users/me/challenges/check`, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									'Authorization': `Bearer ${ accessToken }`,
								},
								body: JSON.stringify({
									element: combination.data.result,
								}),
							}).then((res) => res.json()).then((data) => {
								if(data.data) {
									alchemy.activeChallenge = null;
									successToast('Challenge completed!');
								}
							});
						}

						alchemy.addAvailableElement({
							name: combination.data.result,
							slug: combination.data.slug,
						});

						const x = leftPosition + 'px';
						const y = topPosition + 10 + 'px';

						// set as invisible both elements
						element1.visible = false;
						element2.visible = false;

						const newElement = alchemy.createNewElementInstance(combination.data.slug);

						// wait next tick to ensure the new element is rendered
						await nextTick();

						// set the position of the new element to the position of the average of the two elements
						const newElementDom = document.querySelector(`#${ newElement.id }`);

						newElementDom.style.left = x;
						newElementDom.style.top = y;

						Velocity(bonk, {
							left: '-200px',
							top: '-200px',
						}, {
							duration: 500,
							complete: () => {
								bonk.remove();
								cloud.remove();
							},
						});

						// add the new element to the dragselect instance
						ds.value.addSelectables(document.querySelectorAll('.element'));

					} else {

						element1.loading = false;
						element2.loading = false;

						Velocity(bonk, {
							left: '-200px',
							top: '-200px',
						}, {
							duration: 500,
							complete: () => {
								bonk.remove();
							},
						});

						errorToast('Combination failed');

						ds.value.addSelectables(document.querySelectorAll('.element'));
					}
				}
			}

			// if the drop target is the delete zone
			if(!!callbackObject.dropTarget && callbackObject.dropTarget.id === 'mint-zone') {
				alchemy.mintVisible = true;

				// set the element to not visible
				alchemy.elementToMint = alchemy.elements.find((el) => el.id === callbackObject.dropTarget.itemsDropped[0].id);
			}

			// if the drop target is the delete zone
			if(!!callbackObject.dropTarget && callbackObject.dropTarget.id === 'delete-zone') {

				// delete from elements array all selected elements
				// iterate itemsDropped
				for(const item of callbackObject.dropTarget.itemsDropped) {

					// set the element to not visible
					const element = alchemy.elements.find((el) => el.id === item.id);

					element.deleting = true;
					somethingDeleting.value = true;

					rebindElements();

					// play bonk sound
					const bonkSound = new Audio('/sounds/trash.mp3');
					bonkSound.play();

					// scale to 0 with velocity
					Velocity(document.querySelector(`#${ element.id }`), {
						scale: 0,
					}, {
						duration: 500,
						complete: () => {
							element.visible = false;
							somethingDeleting.value = false;
						},
					});
				}
			}
		});
	};

	const toggleMusic = () => {
		if(!loopMusic.value) {
			loopMusic.value = new Audio('/sounds/loop.ogg');
			loopMusic.value.loop = true;
		}

		if(musicPlaying.value) {
			loopMusic.value.pause();
			musicPlaying.value = false;
		} else {
			loopMusic.value.play();
			musicPlaying.value = true;
		}
	};

	// watch alchemy.connectedWallet
	watch(() => alchemy.connectedWallet, async (currentValue) => {

		if(!!currentValue) {
			if(dsStarted.value) return;
			dsStarted.value = true;
			howTo.value = false;

			// wait 1 second
			await new Promise((resolve) => { setTimeout(() => { resolve(); }, 1000); });
			startDragSelect();
		}
	});
</script>

<style lang="sass" scoped>

	@keyframes cloud
		to
			background-position: -142px * 6 0

	@keyframes bonk
		to
			background-position: -160px * 9 0

	@keyframes background
		0%
			background-position: 0 0
		100%
			background-position: 1000px 1000px

	.global-wrapper
		background: #FFD002 url('/images/yellow-pattern.png')
		flex-grow: 1
		display: flex
		flex-direction: column

		// animate background position
		animation: background 30s linear infinite

		.app-wrapper
			display: flex
			margin: 2rem
			flex-direction: column
			height: calc(100dvh - 4rem)
			flex-grow: 1

			.combining-left-bottom
				position: absolute
				bottom: 0
				left: 0
				width: 18px
				height: 18px
				image-rendering: pixelated

			.combining-right-bottom
				position: absolute
				bottom: 0
				right: 0
				width: 18px
				height: 18px
				image-rendering: pixelated

			.app-header
				color: white
				display: flex
				flex-direction: column
				align-items: flex-end

				.logo
					position: absolute
					width: 363px * 2
					image-rendering: pixelated
					left: 20px
					z-index: 100
					bottom: 14px

				.header-top-left
					image-rendering: pixelated
					width: 18px * 2
					height: 9px * 2
					position: absolute
					bottom: 0
					left: 0

				.header-back
					image-rendering: pixelated
					width: calc(100% - 35px * 2)
					height: 9px * 2
					position: absolute
					bottom: 0
					left: 36px

				.header-right
					image-rendering: pixelated
					height: 9px * 2
					width: 17px * 2
					position: absolute
					bottom: -3px
					right: 0

				:deep(.swv-button-trigger)
					width: 138px * 2
					height: 38px * 2
					image-rendering: pixelated
					background: url('/images/wallet.png') no-repeat
					background-size: contain
					padding-top: 39px
					text-align: left
					padding-left: 90px
					font-size: 13px
					color: black
					text-shadow: 1px 0 0 #E6E7F0
					font-smooth: never
					-webkit-font-smoothing: none
					margin-bottom: 14px

	.game-wrapper
		display: flex
		flex-grow: 1
		position: relative

		.combining-left
			width: 18px
			background: url('/images/combining-left.png') repeat-y
			background-size: 100% auto
			image-rendering: pixelated
			height: calc(100% - 18px)
			position: absolute
			left: 0
			z-index: 100

		.combining-bottom
			height: 18px
			background: url('/images/combining-bottom.png') repeat-x
			background-size: auto 100%
			image-rendering: pixelated
			width: calc(100% - 18px - 18px)
			position: absolute
			z-index: 100
			left: 18px
			bottom: 0

		.combining-wrapper
			flex-grow: 1
			position: relative
			overflow: hidden
			flex-direction: column
			display: flex
			margin-left: 18px
			margin-bottom: 18px

			.menu
				background: white
				border-bottom: 2px solid #C5C7DD

				.music-icon
					position: absolute
					padding-left: 1rem
					margin-right: -1rem
					z-index: 10
					top: 50%
					transform: translateY(-50%)

					img
						width: 10px * 2
						height: 8px * 2
						image-rendering: pixelated

				.play-music
					padding-left: 2rem
					border-right: 2px solid #C5C7DD

					width: 180px

				.how-to-play
					border-left: 2px solid #C5C7DD


		.combining-area
			flex-grow: 1
			background-color: white
			overflow: clip

			:deep(.bonk)
				position: absolute
				width: 80px * 2
				height: 65px * 2
				image-rendering: pixelated
				bottom: -200px
				left: -200px
				background-image: url('/images/bonk-sheet.png')
				background-size: auto 100%
				background-position: 0 0

				&.animated
					animation: bonk 0.5s steps(9) forwards

			:deep(.cloud)
				position: absolute
				width: 71px * 2
				height: 62px * 2
				image-rendering: pixelated
				bottom: -200px
				left: -200px
				background-image: url('/images/cloud.png')
				background-size: auto 100%
				background-position: 0 0
				z-index: 2

				&.animated
					animation: cloud 0.250s steps(6) forwards


			.element
				cursor: grab
				position: absolute
				user-select: none

				// when dragging an element change the cursor
				&.dragging
					cursor: grabbing

		.index-area
			background: white
			min-width: 300px
			margin-bottom: 18px
			display: flex
			flex-direction: column

			.loading-elements
				display: flex
				flex-direction: column
				justify-content: center
				align-items: center
				flex-grow: 1
				font-family: Silkscreen, sans-serif
				font-size: 10px

				.bonk
					width: 67px * 2
					image-rendering: pixelated
					margin-bottom: 1rem

			.tabs
				border-top: 2px solid #C5C7DD
				gap: 2px
				background: #C5C7DD

				a
					flex-grow: 1
					background: white

					&.is-active
						background: #59CF93
						color: white

			.search
				padding: 0.5rem
				background: #59CF93

				.delete-query
					position: absolute
					right: 1.5rem
					top: 50%
					transform: translateY(-50%)
					margin-top: -2px
					z-index: 2

					img
						width: 10px
						height: 10px
						image-rendering: pixelated
						cursor: pointer

				input
					width: 100%
					font-family: Silkscreen, sans-serif
					padding: 0.25rem 0.5rem
					border: 2px solid #222
					font-size: 12px

			.elements-wrapper
				flex-grow: 1

				.scroll-wrapper
					will-change: transform

			.elements
				padding: 0.5rem
				display: flex
				flex-wrap: wrap
				gap: 0.5rem

				.element
					flex-grow: 1
					cursor: pointer
					padding: 0.5rem 1rem
					text-align: center

		.combining-middle
			width: 12px
			background: url('/images/combining-middle.png') repeat-y
			background-size: 100% auto
			image-rendering: pixelated
			top: -2px
			height: calc(100% - 14px)
			right: 0
			z-index: 100

		.combining-right
			width: 18px
			background: url('/images/combining-right.png') repeat-y
			background-size: 100% auto
			image-rendering: pixelated
			height: calc(100% - 18px)
			left: 0
			z-index: 100

	.how-to
		z-index: 11

	.last-combination
		height: 32px
		z-index: 10
		overflow: hidden
		font-family: Silkscreen, sans-serif
		font-size: 12px

		.view
			position: absolute
			right: 0.5rem
			color: white
			line-height: 1
			z-index: 2
			top: 5px
			text-decoration: none
			padding: 2px 0.5rem
			border: 2px solid white

		&:hover
			overflow: visible

			.view
				display: none

		.combination-wrapper
			background: #59CF93
			padding: 0.5rem
			position: absolute
			top: 0
			left: 0
			width: 100%

		p
			margin-bottom: 0.5rem
			color: white
			user-select: none

			strong
				font-weight: normal
				color: black

	// mint and delete drop zones

	.mint-drop-zone
		position: absolute
		left: 1rem
		bottom: 0
		width: 75px * 2
		height: 50px * 2
		background: url('/images/mint.png') no-repeat
		background-size: contain
		image-rendering: pixelated

		&:before
			content: 'Mint Element Here'
			position: absolute
			width: 56px * 2
			height: 20px * 2
			background: url('/images/balloon.png') no-repeat
			background-size: contain
			image-rendering: pixelated
			font-size: 10px
			color: black
			padding-top: 4px
			text-align: center
			font-family: Silkscreen, sans-serif
			line-height: 0.9
			bottom: calc(100% + 0.25rem)
			animation: hover 1s infinite

	// animation to hover up and down slightly and slowly
	@keyframes hover
		0%
			transform: translateY(0)
		50%
			transform: translateY(-5px)
		100%
			transform: translateY(0)

	.delete-drop-zone
		position: absolute
		right: 1rem
		bottom: 0
		width: 102px * 2
		height: 63px * 2
		background: url('/images/trash-closed.png') no-repeat
		background-size: contain
		image-rendering: pixelated

		&:before
			content: 'Delete element'
			position: absolute
			width: 56px * 2
			height: 20px * 2
			background: url('/images/balloon.png') no-repeat
			background-size: contain
			image-rendering: pixelated
			font-size: 10px
			color: black
			padding-top: 9px
			text-align: center
			font-family: Silkscreen, sans-serif
			line-height: 0.9
			bottom: calc(100% - 1.2rem)
			animation: hover 1s infinite
			right: 0
			transition: opacity 0.3s ease

		&.opened
			background-image: url('/images/trash-opened.png')

			&.opened:before
				opacity: 0
</style>