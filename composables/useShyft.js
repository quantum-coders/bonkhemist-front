import { Connection, PublicKey } from '@solana/web3.js';

const METAPLEX_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export const useShyft = () => {
	const apiKey = useRuntimeConfig().public.SHYFT_API_KEY;
	const baseUrl = 'https://api.shyft.to';

	const createNft = async (feePayer, slug) => {
		const raw = JSON.stringify({
			'network': 'mainnet-beta',
			'metadata_uri': `https://bonkhemist-api.qcdr.io/elements/${ slug }/element.json`,
			'max_supply': 0,
			'collection_address': 'FYqvL1JRrr8bhrG73xjgqGNMfQASNiVW3ebBpzgmc2g1',
			'receiver': feePayer,
			'fee_payer': feePayer,
			'service_charge': {
				'receiver': '7NCX85HVox1YKW7bLQGQ36nMVSzhqvXXsKxVSghVGdsf',
				'amount': 80000,
				'token': 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
			},
			'priority_fee': 6851612,
		});

		const requestOptions = {
			method: 'POST',
			headers: {
				'x-api-key': apiKey,
				'Content-Type': 'application/json',
			},
			body: raw,
			redirect: 'follow',
		};

		try {
			const response = await fetch(baseUrl + '/sol/v1/nft/create_from_metadata', requestOptions);
			const result = await response.json();
			console.log('NFT creado:', result.result);
			return result.result;
		} catch(error) {
			console.error('Error creando NFT:', error);
			throw error;
		}
	};

	return {
		createNft,
	};
};