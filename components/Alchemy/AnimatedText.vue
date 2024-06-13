<template>
	<span class="animated-text" v-for="(letter, i) in letters" :key="i">
		<span class="letter"
			:style="{ '--delay': i }"
		>{{ letter === ' ' ? '&nbsp;' : letter }}</span>
	</span>
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

	.animated-text
		display: inline-block
		font-family: Silkscreen, sans-serif

	.letter
		display: inline-block
		animation: hover 0.5s infinite
		animation-delay: calc(0.1s * var(--delay))


	@keyframes hover
		0%
			transform: translateY(0)
		50%
			transform: translateY(-2px)
		100%
			transform: translateY(0)

</style>