<template>
	<a href="#">
		<template v-for="(letter, i) in letters" :key="i">
			<span
				:style="{ '--delay': i }"
			>{{ letter }}</span>
		</template>
	</a>

</template>

<script setup>

	// receive text via props
	const props = defineProps({
		text: String,
	});

	// compute an array of each letter in the text
	const letters = computed(() => props.text.split(''));

</script>

<style lang="sass" scoped>

	a
		text-align: center
		cursor: pointer
		font-family: Silkscreen, sans-serif
		font-size: 12px
		text-decoration: none
		color: black
		display: block
		min-width: 130px
		padding: 0.5rem 0

		&:hover
			background: #F5F6FA

		span
			display: inline-block

		&:hover span
			animation: hover 0.5s alternate
			animation-delay: calc(0.1s * var(--delay))


	@keyframes hover
		0%
			transform: translateY(0)
		50%
			transform: translateY(-2px)
		100%
			transform: translateY(0)

</style>