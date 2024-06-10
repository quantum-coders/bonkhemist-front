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

				<p>Element to mint: {{ alchemy.elementToMint.name }}</p>
				<a href="#" @click.prevent="mintElement" class="btn btn-primary">Mint</a>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
	import { Buffer } from 'buffer';

	const { createNft } = useShyft();
	const emit = defineEmits([ 'ready' ]);
	const alchemy = useAlchemyStore();

	const ready = () => {
		alchemy.mintSuggestions = [];
		emit('ready');
	};

	// creaNft Returns the encoded transaction
	const mintElement = async () => {
		// get public key
		const publicKey = alchemy.connectedWallet;
		const provider = window.solana;
		console.log(provider);

		// Call your createNft function to get the encoded transaction
		const res = await createNft('', publicKey.toString());
		const encodedTransaction = res.encoded_transaction;
		try {

			// Decode the transaction
			const transaction = Transaction.from(Buffer.from(encodedTransaction, 'base64'));

			// Sign the transaction with the Phantom wallet
			const { signature } = await provider.signTransaction(transaction);
			transaction.addSignature(publicKey, signature);

			console.log('signedTransaction', transaction);

			// Send the transaction
			const connection = new Connection('https://api.mainnet-beta.solana.com');
			const sendSignature = await connection.sendRawTransaction(transaction.serialize());
			console.log('signature', sendSignature);

			// Wait for the transaction to be confirmed
			const signatureStatus = await connection.confirmTransaction(sendSignature);
			console.log('signatureStatus', signatureStatus);
		} catch(error) {

			console.log('error', error);
			console.error(error);
		}
	};
</script>

<style lang="sass" scoped>
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