<template>
	<component
		:is="to ? NuxtLink : 'button'"
		:to="to || undefined"
		class="pixel-btn"
		:class="[`is-${variant}`, `is-${size}`]"
		@click="$emit('click', $event)"
	>
		<slot>{{ label }}</slot>
	</component>
</template>

<script setup>
import { NuxtLink } from '#components';

defineProps({
	to: { type: String, default: '' },
	label: { type: String, default: '' },
	variant: { type: String, default: 'primary' }, // primary | ghost | violet
	size: { type: String, default: 'md' },          // md | lg
});

defineEmits(['click']);
</script>

<style scoped lang="sass">
.pixel-btn
	display: inline-flex
	align-items: center
	justify-content: center
	gap: 0.5em
	font-family: var(--ll-font-display)
	font-size: 0.95rem
	text-transform: uppercase
	letter-spacing: 0.02em
	text-decoration: none
	color: var(--ll-ink)
	background: var(--ll-green)
	border: var(--ll-border)
	box-shadow: var(--ll-shadow)
	padding: 0.9em 1.7em
	border-radius: 3px
	cursor: pointer
	transition: transform 0.08s ease, box-shadow 0.08s ease

	&.is-lg
		font-size: 1.1rem
		padding: 1.05em 2.1em

	&.is-ghost
		background: var(--ll-paper)

	&.is-violet
		background: var(--ll-violet)
		color: var(--ll-paper)

	&:hover
		transform: translate(-2px, -2px)
		box-shadow: 9px 9px 0 var(--ll-ink)

	&:active
		transform: translate(4px, 4px)
		box-shadow: 1px 1px 0 var(--ll-ink)

	&:focus-visible
		outline: 3px solid var(--ll-violet)
		outline-offset: 3px

@media (prefers-reduced-motion: reduce)
	.pixel-btn
		transition: none
		&:hover
			transform: none
</style>
