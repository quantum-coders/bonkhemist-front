export const useShyft = () => {
	const apiKey = useRuntimeConfig().public.SHYFT_API_KEY;
	const baseUrl = 'https://api.shyft.to';

	const createNft = async (feePayer) => {
		const raw = JSON.stringify({
			'network': 'mainnet-beta',
			'metadata_uri': 'https://chimp.mx/bonkhemist.json',
			'max_supply': 0,
			'collection_address': '',
			'receiver': feePayer,
			'fee_payer': feePayer,
			'service_charge': {
				'receiver': '7NCX85HVox1YKW7bLQGQ36nMVSzhqvXXsKxVSghVGdsf',
				'amount': 10,
				'token': 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
			},
			'priority_fee': 10000,
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