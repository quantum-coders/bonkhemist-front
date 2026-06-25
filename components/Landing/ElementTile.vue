<template>
	<div
		class="el-tile"
		:class="[`tone-${tone}`, { 'is-float': floating }]"
		:style="floating ? { animationDelay: `${delay}s` } : null"
	>
		<span class="el-tile__icon" aria-hidden="true">{{ icon }}</span>
		<span class="el-tile__label">{{ label }}</span>
	</div>
</template>

<script setup>
defineProps({
	label: { type: String, default: '' },
	icon: { type: String, default: '' },
	tone: { type: String, default: 'neutral' }, // water|fire|earth|air|steam|cloud|volcano|legend|mystery|neutral
	floating: { type: Boolean, default: false },
	delay: { type: Number, default: 0 },
});
</script>

<style scoped lang="sass">
.el-tile
	display: inline-flex
	flex-direction: column
	align-items: center
	justify-content: center
	gap: 2px
	width: 92px
	height: 92px
	padding: 8px
	background: var(--ll-paper)
	border: var(--ll-border)
	box-shadow: var(--ll-shadow-sm)
	border-radius: 4px
	position: relative
	// top accent strip — the tile's "element color"
	&::before
		content: ''
		position: absolute
		top: 0
		left: 0
		right: 0
		height: 8px
		background: var(--accent, var(--ll-green))
		border-bottom: 2px solid var(--ll-ink)

	&__icon
		font-size: 1.9rem
		line-height: 1
		margin-top: 4px

	&__label
		font-family: var(--ll-font-pixel)
		font-size: 0.62rem
		text-transform: uppercase
		letter-spacing: 0.02em
		color: var(--ll-ink)
		text-align: center

.tone-water
	--accent: #3FA9F5
.tone-fire
	--accent: var(--ll-ember)
.tone-earth
	--accent: #9B6A3C
.tone-air
	--accent: #CFE8FF
.tone-steam
	--accent: #B8C6D0
.tone-cloud
	--accent: #8FB8E8
.tone-volcano
	--accent: #E0531F
.tone-legend
	--accent: var(--ll-violet)
.tone-neutral
	--accent: var(--ll-green)

.tone-mystery
	--accent: var(--ll-violet)
	background: repeating-linear-gradient(45deg, #f3edff, #f3edff 6px, #e9deff 6px, #e9deff 12px)
	.el-tile__icon
		font-family: var(--ll-font-display)
		font-size: 1.5rem
		color: var(--ll-violet)

.is-float
	animation: tile-float 4.5s ease-in-out infinite

@keyframes tile-float
	0%, 100%
		transform: translateY(0) rotate(-2deg)
	50%
		transform: translateY(-12px) rotate(2deg)

@media (prefers-reduced-motion: reduce)
	.is-float
		animation: none
</style>
