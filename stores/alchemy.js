import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useAlchemyStore = defineStore('alchemyStore', () => {

	const config = useRuntimeConfig();
	const elements = ref([]);
	const connectedWallet = ref('');
	const availableElements = ref([
		{ name: 'Water', slug: 'water' },
		{ name: 'Fire', slug: 'fire' },
		{ name: 'Earth', slug: 'earth' },
		{ name: 'Air', slug: 'air' },
	]);
	const search = ref('');
	const challengesSuggestions = ref([]);
	const challengesLoading = ref(false);
	const lastCombination = ref(null);
	const mintVisible = ref(false);
	const elementToMint = ref(null);

	const clearElements = () => {
		elements.value = [];
	};

	const orderElementsAlphabetically = () => {
		availableElements.value.sort((a, b) => a.name.localeCompare(b.name));
	};

	const createNewElementInstance = (slug) => {

		// get the element from the available elements
		const existingElement = availableElements.value.find(e => e.slug === slug);
		const id = 'element-' + uuidv4();

		const element = {
			id,
			name: existingElement.name,
			slug: existingElement.slug,
			visible: true,
		};

		elements.value.push(element);

		return element;
	};

	const addAvailableElement = (element) => {

		// check if the element already exists
		const existingElement = availableElements.value.find(e => e.slug === element.slug);

		if(!existingElement) {
			availableElements.value.push(element);
		}
	};

	// check if two elements overlap
	const isOverlapping = (element1, element2) => {
		const rect1 = element1.getBoundingClientRect();
		const rect2 = element2.getBoundingClientRect();

		return !(
			rect1.right < rect2.left ||
			rect1.left > rect2.right ||
			rect1.bottom < rect2.top ||
			rect1.top > rect2.bottom
		);
	};

	const getOverlapPercentage = (element1, element2) => {
		const rect1 = element1.getBoundingClientRect();
		const rect2 = element2.getBoundingClientRect();

		// Calculate the intersection rectangle
		const overlapLeft = Math.max(rect1.left, rect2.left);
		const overlapRight = Math.min(rect1.right, rect2.right);
		const overlapTop = Math.max(rect1.top, rect2.top);
		const overlapBottom = Math.min(rect1.bottom, rect2.bottom);

		// Calculate the dimensions of the intersection rectangle
		const overlapWidth = Math.max(0, overlapRight - overlapLeft);
		const overlapHeight = Math.max(0, overlapBottom - overlapTop);

		// Calculate the area of the intersection rectangle
		const overlapArea = overlapWidth * overlapHeight;

		// Calculate the areas of the individual elements
		const area1 = (rect1.right - rect1.left) * (rect1.bottom - rect1.top);
		const area2 = (rect2.right - rect2.left) * (rect2.bottom - rect2.top);

		// Calculate the percentage of overlap for each element
		const overlapPercentage1 = (overlapArea / area1) * 100;
		const overlapPercentage2 = (overlapArea / area2) * 100;

		return {
			op1: overlapPercentage1,
			op2: overlapPercentage2,
		};
	};

	const createElementFromAvailable = async (element, callback = null) => {
		const newElement = createNewElementInstance(element);

		// play bonk sound
		const addSound = new Audio('/sounds/add.mp3');
		addSound.play();

		await nextTick();

		// set the position of the new element to the position of the double click
		const newElementDom = document.querySelector(`#${ newElement.id }`);
		const width = newElementDom.offsetWidth;
		const height = newElementDom.offsetHeight;

		// position it in the center of the combining area
		let x = Math.round(document.querySelector('.combining-area').offsetWidth / 2 - width / 2);
		let y = Math.round(document.querySelector('.combining-area').offsetHeight / 2 - height / 2);

		// random x +/- 50
		x += Math.floor(Math.random() * 100) - 50;
		y += Math.floor(Math.random() * 100) - 50;

		newElementDom.style.left = x + 'px';
		newElementDom.style.top = y + 'px';

		// if a callback is provided, call it
		if(callback) callback(newElement);
	};

	const cloneElement = async (event, callback) => {
		const element = event.target;

		// get data-slug attribute
		const slug = element.getAttribute('data-slug');
		const newElement = createNewElementInstance(slug);

		// get element transform style
		const left = element.style.left;
		const top = element.style.top;

		// wait next tick to ensure the new element is rendered
		await nextTick();

		// position the new element in the same position as the original element
		const newElementDom = document.querySelector(`#${ newElement.id }`);

		newElementDom.style.left = left;
		newElementDom.style.top = top;

		// if a callback is provided, call it
		if(callback) callback(newElement);
	};

	const generateChallenges = async () => {

		challengesLoading.value = true;

		// get accessTokens from localStorage
		const accessToken = localStorage.getItem('accessToken');

		const challengeRes = await fetch(`${ config.public.apiUrl }/users/me/challenges`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${ accessToken }`,
			}
		});

		if(!challengeRes.ok) {
			throw new Error('Error generating challenges');
		}

		const challenges = await challengeRes.json();
		challengesSuggestions.value = challenges.data;

		challengesLoading.value = false;
	};

	return {
		availableElements,
		elements,
		connectedWallet,
		search,
		challengesSuggestions,
		challengesLoading,
		lastCombination,
		mintVisible,
		elementToMint,
		createNewElementInstance,
		isOverlapping,
		getOverlapPercentage,
		addAvailableElement,
		createElementFromAvailable,
		cloneElement,
		clearElements,
		orderElementsAlphabetically,
		generateChallenges,
	};
});