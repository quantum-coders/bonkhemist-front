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
		'@vueuse/nuxt',
		'@nuxtjs/i18n',
	],
	i18n: {
		strategy: 'no_prefix',
		defaultLocale: 'en',
		locales: [
			{ code: 'en', name: 'English', file: 'en.json' },
			{ code: 'es', name: 'Español', file: 'es.json' },
		],
		langDir: 'locales',
		lazy: true,
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'bonkhemist_lang',
			fallbackLocale: 'en',
		},
	},
	imports: {
		dirs: [
			'stores',
		],
	},
	// Add global script
	app: {
		head: {
			title: 'Bonkhemist',
			meta: [
				{ property: 'og:title', content: 'Bonkhemist' },
				{ property: 'og:image', content: '/images/bonk_og.png' },
				{ property: 'og:type', content: 'website' },
				{ name: 'twitter:card', content: 'summary_large_image' },
				{ name: 'twitter:image', content: '/images/bonk_og.png' },
			],
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
				}
			],
		},
	},
	runtimeConfig: {
		public: {
			apiUrl: process.env.API_URL,
			SHYFT_API_KEY: process.env.SHYFT_API_KEY,
			SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,
			ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY,
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
