// @ts-ignore
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	css: [
		'~/assets/styles/main.scss',
	],
	modules: [
		'@pinia/nuxt',
		'nuxt-svgo',
		'nuxt-icon',
		'@vueuse/nuxt'
	],
	imports: {
		dirs: [
			'stores',
		],
	},
	// Add global script
	app: {
		head: {
			title: 'Bonkhemist',
			link: [
				//favicon.ico
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700&display=swap'
				},
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Bungee&family=Inter:wght@100..900&family=Silkscreen:wght@400;700&display=swap',
				},
				{
					rel: 'stylesheet',
					href: '/fonts/stylesheet.css',
				},
			],
		},
	},
	runtimeConfig: {
		public: {
			apiUrl: process.env.API_URL,
		},
	},
	vite: {
		css: {
			preprocessorOptions: {
				sass: {
					additionalData: '@import "~/assets/styles/variables.sass"\nbody\n\tmargin: 0',
				},
			},
		},
	},
})
