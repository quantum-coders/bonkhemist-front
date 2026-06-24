<template>
  <div class="lang-switcher">
    <button
      v-for="l in ['en', 'es']"
      :key="l"
      class="lang-btn"
      :class="{ active: locale === l }"
      @click="setLocale(l)"
    >{{ l.toUpperCase() }}</button>
  </div>
</template>

<script setup>
const { locale, setLocale } = useI18n();
</script>

<style scoped lang="sass">
.lang-switcher
	display: flex
	gap: 4px
	align-items: center

.lang-btn
	font-family: Silkscreen, monospace
	font-size: 10px
	padding: 2px 6px
	border: 2px solid #222
	background: white
	cursor: pointer
	color: black
	line-height: 1.4
	image-rendering: pixelated

	&:hover
		background: #F5F6FA

	&.active
		background: #000
		color: #fff
		border-color: #000
</style>
