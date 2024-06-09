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

				<div class="combining-area">
					<template v-if="!!alchemy.connectedWallet">
						<template v-for="element in alchemy.elements" :key="element.id">
							<alchemy-element
								:element="element"
								:class="{ 'is-merging': !!element.loading }"
								v-if="element.visible"
								@dblclick.stop="alchemy.cloneElement($event, rebindElements)"
							/>
						</template>

						<div class="mint-drop-zone"></div>
						<div class="delete-drop-zone"></div>
					</template>
				</div>

				<div class="combining-middle" />

				<div class="index-area">
					<template v-if="!!alchemy.connectedWallet">
						<div class="search">

							<!-- search input -->
							<input
								type="text"
								placeholder="Search Element..."
								v-model="alchemy.search"
							/>
						</div>
						<div class="elements-wrapper">

							<div class="scroll-wrapper">
								<div class="elements">
									<alchemy-element
										v-for="element in filteredElements"
										@click="alchemy.createElementFromAvailable(element.slug, rebindElements)"
										:element="element"
									/>
								</div>
							</div>
						</div>
					</template>
				</div>
				<div class="combining-right" />
			</div>
		</div>
	</div>
</template>

<script setup>
	import DragSelect from 'dragselect';
	import Velocity from 'velocity-animate';
	import { v4 as uuidv4 } from 'uuid';
	const ds = ref(null);

	const alchemy = useAlchemyStore();
	const config = useRuntimeConfig();
	const dsStarted = ref(false);

	const elements = ref([]);

	const rebindElements = () => {
		ds.value.addSelectables(document.querySelectorAll('.element:not(.is-merging)'));
	};

	const filteredElements = computed(() => {

		if(!alchemy.search) return alchemy.availableElements;

		return alchemy.availableElements.filter((element) => {
			return element.name.toLowerCase().includes(alchemy.search.toLowerCase());
		});
	});

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
				}
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

					// calculate .combining-area height
					const combiningAreaHeight = document.querySelector('.combining-area').offsetHeight;

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
					}
				}
			}

			// if the drop target is the delete zone
			if(!!callbackObject.dropTarget && callbackObject.dropTarget.id === 'mint-zone') {

				alert('A mintear puto');
			}

			// if the drop target is the delete zone
			if(!!callbackObject.dropTarget && callbackObject.dropTarget.id === 'delete-zone') {

				// delete from elements array all selected elements
				// iterate itemsDropped
				callbackObject.dropTarget.itemsDropped.forEach((item) => {

					// set the element to not visible
					const element = alchemy.elements.find((el) => el.id === item.id);
					element.visible = false;
				});
			}
		});
	};

	// watch alchemy.connectedWallet
	watch(() => alchemy.connectedWallet, async (currentValue) => {

		if(!!currentValue) {
			if(dsStarted.value) return;
			dsStarted.value = true;

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

		.combining-area
			flex-grow: 1
			background-color: white
			margin-left: 18px
			margin-bottom: 18px
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

			.search
				padding: 0.5rem
				background: #59CF93

				input
					width: 100%
					font-family: Silkscreen, sans-serif
					padding: 0.25rem 0.5rem
					border: 2px solid #222
					font-size: 12px

			.elements-wrapper
				flex-grow: 1

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

	.mint-drop-zone
		position: absolute
		left: 1rem
		bottom: 1rem
		width: 200px
		height: 80px
		border: 2px dashed #FFD002

	.delete-drop-zone
		position: absolute
		right: 1rem
		bottom: 1rem
		width: 200px
		height: 80px
		border: 2px dashed #222
</style>