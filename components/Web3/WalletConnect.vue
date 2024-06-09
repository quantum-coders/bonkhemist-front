<template>
	<wallet-multi-button />
</template>

<script setup>
	import { useWallet, initWallet } from 'solana-wallets-vue';
	import { WalletMultiButton } from 'solana-wallets-vue';

	const alchemy = useAlchemyStore();
	const config = useRuntimeConfig();

	initWallet({
		autoConnect: true,
	});

	const connectedWallet = computed(() => {
		const { publicKey, sendTransaction } = useWallet();

		if(publicKey && publicKey.value) {

			console.log('publicKey', publicKey.value);

			alchemy.connectedWallet = publicKey.value.toBase58();
			return publicKey.value.toBase58();
		}

		alchemy.connectedWallet = null;
		return null;
	});

	watch(connectedWallet, async (currentValue) => {
		console.log('currentValue', currentValue);

		if(currentValue) {
			const connectRes = await fetch(`${ config.public.apiUrl }/users/authenticate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet: connectedWallet.value,
				}),
			});

			if(connectRes.ok) {
				const connectData = await connectRes.json();
				console.log('connectData', connectData);

				// save accessToken to localStorage
				localStorage.setItem('accessToken', connectData.accessToken);

				const elementRes = await fetch(`${ config.public.apiUrl }/users/me/elements`, {
					headers: { 'Authorization': `Bearer ${ connectData.accessToken }` },
				});

				if(elementRes.ok) {
					const elementData = await elementRes.json();

					// for each element, add to alchemy.elements
					elementData.data.forEach((element) => {

						if(alchemy.elements.find((el) => el.slug === element.slug)) return;

						alchemy.availableElements.push({
							name: element.name,
							slug: element.slug,
						});
					});
				}
			}
		} else {
			// remove accessToken from localStorage
			localStorage.removeItem('accessToken');

			// clear alchemy.elements
			alchemy.availableElements = [];
			alchemy.elements = [];
		}
	});

</script>

<style lang="sass" scoped>

</style>