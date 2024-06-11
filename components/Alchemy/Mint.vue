<template>
	<div class="mint-wrapper">
		<div class="mint-modal">
			<a href="#" class="close" @click="ready">
				<img src="/images/close.png" alt="">
			</a>

			<div class="frame-top"></div>
			<div class="frame-bottom"></div>
			<div class="frame-left"></div>
			<div class="frame-right"></div>
			<img class="frame-lb" src="/images/combining-left-bottom.png" alt="">
			<img class="frame-rb" src="/images/combining-right-bottom.png" alt="">
			<img class="frame-lt" src="/images/combining-left-top.png" alt="">
			<img class="frame-rt" src="/images/combining-right-top.png" alt="">

			<div class="modal-content text-center">
				<h4>Mint your NFT right now!</h4>

				<p>For the low price of 10 BONK, you can mint your very own Alchemical NFT!</p>
				<p>Hurry, this element can only be minted once!</p>
				<p>Element to mint: {{ alchemy.elementToMint.name }}</p>
				<a href="#" @click.prevent="mintElement" class="mint-button">Mint</a>
			</div>
		</div>
	</div>
</template>

<script setup>
import {Connection, PublicKey, Transaction, VersionedTransaction, Keypair, ComputeBudgetProgram} from '@solana/web3.js';
import bs58 from 'bs58';

const {createNft} = useShyft();
const emit = defineEmits(['ready']);
const alchemy = useAlchemyStore();


const ready = () => {
	alchemy.mintSuggestions = [];
	emit('ready');
};

// creaNft Returns the encoded transaction
const mintElement = async () => {
	const publicKey = alchemy.connectedWallet;
	const provider = window.solana;
	console.log("Provider:", provider);

	try {
		const {Buffer} = await import('buffer');
		window.Buffer = Buffer;
		// Conectar a la red Solana
		const connection = new Connection(useRuntimeConfig().public.SOLANA_RPC_URL, 'confirmed');
		console.log("Connection to Solana established");
		console.log("Start creating NFT with public key:", publicKey.toString());
		const res = await createNft(publicKey.toString());
		console.log("NFT creado:", res);
		const encodedTransaction = res.encoded_transaction;
		console.log("Encoded Transaction:", encodedTransaction);
		const adminPrivateKey = useRuntimeConfig().public.ADMIN_PRIVATE_KEY;
		console.log("Admin Private Key:", adminPrivateKey);
		const adminKeyPair = await loadPrivateKey(adminPrivateKey); // Asegurarse de que la promesa se resuelva
		console.log("Admin Key Pair:", adminKeyPair);
		console.log("Admin Public Key:", adminKeyPair.publicKey.toString());

		let transaction = Transaction.from(Buffer.from(encodedTransaction, 'base64'));
		console.log("Transaction:", transaction);
		// Add priority fee


		console.log("start: User sign in...");
		const signedTransaction = await provider.signTransaction(transaction);
		console.log("end: User sign in...");
		console.log("start: Admin sign in...");
		signedTransaction.partialSign(adminKeyPair);
		console.log("end:  Admin sign in...");
		// hacks:
		console.log("Start Serializing Transaction...");
		const serializedTransaction = signedTransaction.serialize();
		console.log("End Serialized Transaction:", serializedTransaction);


		const sendSignature = await connection.sendRawTransaction(serializedTransaction);
		console.log("Send Signature:", sendSignature);

		const signatureStatus = await connection.confirmTransaction(sendSignature);
		console.log('Signature Status:', signatureStatus);

		/// Enviar el tx id a la API
		console.log(`Check your tx at solscan: url: https://solscan.io/tx/${sendSignature}`)

		// Retornar o utilizar el tx id
		return sendSignature;
	} catch (error) {
		console.error('Error caught:', error);
		console.error('Error details:', error.message, error.stack);
	}
};


const loadPrivateKey = async (privateKeyString) => {
	if (!privateKeyString) {
		throw new Error("USER_PRIVATE_KEY is not set in the .env file");
	}

	let privateKeyArray;
	let userKeyPair;

	try {
		privateKeyArray = JSON.parse(privateKeyString);
		if (privateKeyArray.length !== 64) {
			throw new Error("Invalid secret key length for JSON");
		}
		userKeyPair = Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
		return userKeyPair;
	} catch (jsonError) {
		try {
			const privateKeyBuffer = Buffer.from(privateKeyString, 'base64');
			privateKeyArray = new Uint8Array(privateKeyBuffer);
			if (privateKeyArray.length !== 64) {
				throw new Error("Invalid secret key length for Base64");
			}

			userKeyPair = Keypair.fromSecretKey(privateKeyArray);
			return userKeyPair;
		} catch (base64Error) {
			try {
				privateKeyArray = bs58.decode(privateKeyString);

				if (privateKeyArray.length !== 64) {
					throw new Error("Invalid secret key length for Base58");
				}

				userKeyPair = Keypair.fromSecretKey(privateKeyArray);
				return userKeyPair;
			} catch (base58Error) {
				throw new Error("Failed to decode the private key");
			}
		}
	}

}
</script>

<style lang="sass" scoped>

.mint-button
	border: 2px solid black
	padding: 0.25rem 1rem
	cursor: pointer
	text-decoration: none
	color: black
	background: white
	font-size: 12px
	font-family: Silkscreen, sans-serif
	transition: background 0.3s, color 0.3s

	&:hover
		background: #59CF93
		color: white
		border-color: white
		outline: 2px solid #59CF93

.mint-wrapper
	display: flex
	justify-content: center
	align-items: center
	flex-direction: column
	font-family: Silkscreen, sans-serif
	position: absolute
	left: 0
	top: 36px
	width: 100%
	height: calc(100% - 36px)
	z-index: 10
	background: rgba(white, 0.5)

	.close
		position: absolute
		right: 2rem
		top: 1.5rem
		cursor: pointer
		z-index: 100

		img
			width: 10px
			height: 10px
			image-rendering: pixelated

	.mint-modal
		position: absolute
		top: 50%
		left: 50%
		width: 70%
		min-height: 310px
		padding: 2rem
		background: white
		z-index: 1
		margin-left: -35%
		margin-top: -155px
		display: flex
		flex-direction: column
		justify-content: center
		align-items: center

		.frame-top
			position: absolute
			top: 0
			left: 18px
			width: calc(100% - 18px - 18px)
			height: 18px
			background: url('/images/combining-top.png') repeat-x
			background-size: auto 100%
			image-rendering: pixelated
			z-index: 0

		.frame-bottom
			position: absolute
			bottom: 0
			left: 18px
			width: calc(100% - 18px - 18px)
			height: 18px
			background: url('/images/combining-bottom.png') repeat-x
			background-size: auto 100%
			image-rendering: pixelated
			z-index: 0

		.frame-left
			position: absolute
			top: 18px
			left: 0
			width: 18px
			height: calc(100% - 18px - 18px)
			background: url('/images/combining-left.png') repeat-y
			background-size: 100% auto
			image-rendering: pixelated
			z-index: 0

		.frame-right
			position: absolute
			top: 18px
			right: 0
			width: 18px
			height: calc(100% - 18px - 18px)
			background: url('/images/combining-right.png') repeat-y
			background-size: 100% auto
			image-rendering: pixelated
			z-index: 0

		.frame-lb
			position: absolute
			bottom: 0
			left: 0
			z-index: 1
			width: 18px
			height: 18px
			image-rendering: pixelated

		.frame-rb
			position: absolute
			bottom: 0
			right: 0
			z-index: 1
			width: 18px
			height: 18px
			image-rendering: pixelated

		.frame-lt
			position: absolute
			top: 0
			left: 0
			z-index: 1
			width: 18px
			height: 18px
			image-rendering: pixelated

		.frame-rt
			position: absolute
			top: 0
			right: 0
			z-index: 1
			width: 18px
			height: 18px
			image-rendering: pixelated

		.mint
			display: flex
			justify-content: space-around
			flex-wrap: wrap
			gap: 1rem
			margin-top: 1rem

			.element
				flex-basis: calc(50% - 2rem)
</style>