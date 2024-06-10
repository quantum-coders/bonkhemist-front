<template>
	<article
		class="element"
		:class="props.element.id"
		:id="props.element.id"
		:data-slug="props.element.slug"
	><span class="name">{{ props.element.name }}</span>
		<span class="background" />
		<img class="top-left" src="/images/frame/top-left.png" alt="">
		<img class="top-right" src="/images/frame/top-right.png" alt="">
		<img class="bottom-left" src="/images/frame/bottom-left.png" alt="">
		<img class="bottom-right" src="/images/frame/bottom-right.png" alt="">
		<div class="top" />
		<div class="right" />
		<div class="bottom" />
		<div class="left" />
	</article>
</template>

<script setup>
	const props = defineProps({
		element: Object,
	});
</script>

<style lang="sass" scoped>

	.element
		white-space: nowrap
		padding: 10px 30px
		text-align: center
		transition: scale 0.3s ease
		font-size: 0.75rem
		cursor: grab
		font-family: Silkscreen, sans-serif
		font-smooth: never
		-webkit-font-smoothing: none
		z-index: 1
		overflow: hidden
		max-width: 100%
		text-overflow: ellipsis

		*
			pointer-events: none

		// Avoid text being selected
		user-select: none

		&.draggable-mirror
			display: none

		&.is-dragging
			cursor: grabbing

		&.is-deleting
			pointer-events: none

		&.is-merging
			animation: vibrate 0.3s ease infinite
			pointer-events: none
			z-index: 0

	.name
		position: relative
		z-index: 1

	.background
		position: absolute
		top: 1px
		left: 1px
		width: calc(100% - 4px)
		height: calc(100% - 4px)
		background: white
		z-index: 0

	.top
		position: absolute
		top: 0
		left: 14px
		width: calc(100% - 28px)
		height: 4px * 2
		background: url('/images/frame/top.png') repeat-x
		background-size: auto 100%
		image-rendering: pixelated
		z-index: 1

	.right
		position: absolute
		top: 6px
		right: 0
		width: 3px * 2
		height: calc(100% - 12px)
		background: url('/images/frame/right.png') repeat-y
		background-size: 100% auto
		z-index: 1

	.bottom
		position: absolute
		bottom: 0
		left: 14px
		width: calc(100% - 28px)
		height: 4px * 2
		background: url('/images/frame/bottom.png') repeat-x
		background-size: auto 100%
		image-rendering: pixelated
		z-index: 1

	.left
		position: absolute
		top: 6px
		left: 0
		width: 3px * 2
		height: calc(100% - 12px)
		background: url('/images/frame/left.png') repeat-y
		background-size: 100% auto
		image-rendering: pixelated
		z-index: 1

	.top-left
		position: absolute
		top: 0
		left: 0
		z-index: 2
		width: 14px * 2
		height: 13px * 2
		image-rendering: pixelated

	.top-right
		position: absolute
		top: 0
		right: 0
		z-index: 2
		width: 14px * 2
		height: 13px * 2
		image-rendering: pixelated

	.bottom-left
		position: absolute
		bottom: 0
		left: 0
		z-index: 2
		width: 14px * 2
		height: 13px * 2
		image-rendering: pixelated

	.bottom-right
		position: absolute
		bottom: 0
		right: 0
		z-index: 2
		width: 14px * 2
		height: 13px * 2
		image-rendering: pixelated

	// vibrating animation, rotate a little bit the element
	@keyframes vibrate
		0%
			transform: rotate(0deg)
		25%
			transform: rotate(2deg)
		50%
			transform: rotate(0deg)
		75%
			transform: rotate(-2deg)
		100%
			transform: rotate(0deg)
</style>