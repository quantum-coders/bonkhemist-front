export const useShyft = () => {
    const apiKey = useRuntimeConfig().public.SHYFT_API_KEY;
    const baseUrl = 'https://api.shyft.to';

    const createNft = async (metadataUri, receiver, feePayer) => {
        const raw = JSON.stringify({
            "network": "devnet",
            "metadata_uri": "https://brown-loyal-stoat-734.mypinata.cloud/ipfs/QmR5Tyx3MvpiCKtjTVC4wVzRigpujCv9bnvQKU4ZMQzN5N",
            "max_supply": 1,
            "collection_address": "3F3G122hfRQ6E7aRQLhdXvabxtfhGHF89UVLvHR4pmn9",
            "receiver": "3yTKSCKoDcjBFpbgxyJUh4cM1NG77gFXBimkVBx2hKrf",
            "fee_payer": "2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc",
            "service_charge": {
                "receiver": "2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc",
                "amount": 0.01
            },
            "priority_fee": 100
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetch(baseUrl + '/sol/v1/nft/create_from_metadata', requestOptions);
            const result = await response.json();
            console.log('NFT creado:', result.result);
            return result.result
        } catch (error) {
            console.error('Error creando NFT:', error);
            throw error;
        }
    };

    return {
        createNft
    };
};