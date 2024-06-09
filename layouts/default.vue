<template>
	<div class="d-flex flex-column main-wrapper">
		<site-header />
		<main>
			<slot />
		</main>
		<site-footer />
	</div>
</template>

<script setup>
</script>

<style lang="sass" scoped>
	.main-wrapper
		flex: 1
		min-height: 100dvh

		main
			flex: 1
			display: flex
			flex-direction: column
</style>