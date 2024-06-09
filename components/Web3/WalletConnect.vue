<template>
	<wallet-multi-button />
	<btn class="mint-btn" @click="mintElement">Mint Element</btn>
</template>

<script setup>
	import { useWallet, initWallet } from 'solana-wallets-vue';
	import { WalletMultiButton } from 'solana-wallets-vue';

	const { createNft } = useShyft();
	const alchemy = useAlchemyStore();
	const config = useRuntimeConfig();

	initWallet({
		autoConnect: true,
	});

	// creaNft Returns the enconde transaction
	const mintElement = async () => {
		// get public key
		const publicKey = alchemy.connectedWallet;
		const res = await createNft('', publicKey);
		const encodedTransaction = res.encoded_transaction;
		console.log('encodedTransaction', encodedTransaction);
		const { signTransaction, sendTransaction } = useWallet();
		const signedTransaction = await useWallet().signTransaction(encodedTransaction);
	};
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
	.mint-btn
		margin-top: 20px
		background-color: #000
		color: #fff
		padding: 10px 20px
		border: none
		border-radius: 5px
		cursor: pointer
		transition: background-color 0.3s ease

		&:hover
			background-color: #333
</style>