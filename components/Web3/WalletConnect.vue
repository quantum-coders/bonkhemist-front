<template>
	<wallet-multi-button />
</template>

<script setup>
	import { useWallet, initWallet } from 'solana-wallets-vue';
	import { WalletMultiButton } from 'solana-wallets-vue';

	const { createNft } = useShyft();
	const alchemy = useAlchemyStore();
	const config = useRuntimeConfig();

	initWallet({ autoConnect: true });

	const { publicKey, connected, connecting } = useWallet();
	const isInitialized = ref(false);
	const lastWallet = ref(null);

	// Función para cargar datos del usuario
	const loadUserData = async (walletAddress, accessToken) => {
		alchemy.isLoadingElements = true;
		try {
			// Cargar NFTs en background sin bloquear (tarda mucho)
			alchemy.fetchNFTs().catch(err => console.warn('Error fetching NFTs:', err));

			// Cargar elementos (esto es rápido)
			const elementRes = await fetch(`${ config.public.apiUrl }/users/me/elements`, {
				headers: { 'Authorization': `Bearer ${ accessToken }` },
			});

			if(elementRes.ok) {
				const elementData = await elementRes.json();

				// Elementos base
				alchemy.availableElements = [
					{ name: 'Water', slug: 'water' },
					{ name: 'Fire', slug: 'fire' },
					{ name: 'Earth', slug: 'earth' },
					{ name: 'Air', slug: 'air' },
				];

				// Agregar elementos del usuario
				elementData.data.forEach((element) => {
					if(!alchemy.availableElements.find((el) => el.slug === element.slug)) {
						alchemy.availableElements.push({
							name: element.name,
							slug: element.slug,
						});
					}
				});
			}
		} catch(error) {
			console.error('Error loading user data:', error);
		} finally {
			alchemy.isLoadingElements = false;
		}
	};

	// Función para autenticar
	const authenticateWallet = async (walletAddress) => {
		try {
			const connectRes = await fetch(`${ config.public.apiUrl }/users/authenticate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet: walletAddress,
				}),
			});

			if(connectRes.ok) {
				const connectData = await connectRes.json();

				// Guardar accessToken y wallet en localStorage
				localStorage.setItem('accessToken', connectData.accessToken);
				localStorage.setItem('connectedWallet', walletAddress);

				if(connectData.data && connectData.data?.challenge) {
					alchemy.activeChallenge = connectData.data.challenge;
				}

				await loadUserData(walletAddress, connectData.accessToken);
				return true;
			}
		} catch(error) {
			console.error('Error authenticating:', error);
		}
		return false;
	};

	// Función para limpiar estado
	const clearState = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('connectedWallet');
		alchemy.connectedWallet = null;
		alchemy.availableElements = [];
		alchemy.elements = [];
		alchemy.activeChallenge = null;
		lastWallet.value = null;
	};

	// Función para verificar y restaurar sesión
	const checkAndRestoreSession = async (walletAddress) => {
		const storedToken = localStorage.getItem('accessToken');
		const storedWallet = localStorage.getItem('connectedWallet');

		// Si la wallet cambió, limpiar y re-autenticar
		if(storedWallet && storedWallet !== walletAddress) {
			clearState();
			return authenticateWallet(walletAddress);
		}

		// Si hay token guardado para esta wallet, verificar que funciona
		if(storedToken && storedWallet === walletAddress) {
			try {
				const verifyRes = await fetch(`${ config.public.apiUrl }/users/me/elements`, {
					headers: { 'Authorization': `Bearer ${ storedToken }` },
				});

				if(verifyRes.ok) {
					// Token válido, cargar datos
					alchemy.connectedWallet = walletAddress;
					await loadUserData(walletAddress, storedToken);
					return true;
				} else {
					// Token inválido, re-autenticar
					return authenticateWallet(walletAddress);
				}
			} catch(error) {
				return authenticateWallet(walletAddress);
			}
		}

		// No hay sesión guardada, autenticar
		return authenticateWallet(walletAddress);
	};

	// Watch para cambios en publicKey
	watch(publicKey, async (newPublicKey, oldPublicKey) => {
		if(newPublicKey) {
			const walletAddress = newPublicKey.toBase58();

			// Evitar procesar si es la misma wallet
			if(lastWallet.value === walletAddress && alchemy.connectedWallet) {
				return;
			}

			lastWallet.value = walletAddress;
			alchemy.connectedWallet = walletAddress;

			await checkAndRestoreSession(walletAddress);
			isInitialized.value = true;
		} else if(oldPublicKey && !newPublicKey) {
			// Wallet desconectada
			clearState();
			isInitialized.value = false;
		}
	}, { immediate: true });

	// Watch para cuando connected cambia a false
	watch(connected, (isConnected) => {
		if(!isConnected && isInitialized.value) {
			clearState();
			isInitialized.value = false;
		}
	});

	// Al montar, verificar si hay sesión guardada y wallet conectada
	onMounted(async () => {
		// Esperar un poco para que autoConnect haga su trabajo
		await new Promise(resolve => setTimeout(resolve, 500));

		if(publicKey.value) {
			const walletAddress = publicKey.value.toBase58();
			if(!alchemy.connectedWallet || alchemy.availableElements.length === 0) {
				lastWallet.value = walletAddress;
				alchemy.connectedWallet = walletAddress;
				await checkAndRestoreSession(walletAddress);
				isInitialized.value = true;
			}
		}
	});
</script>

<style lang="sass" scoped>
</style>