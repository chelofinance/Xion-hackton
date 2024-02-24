export const createIcaBuyMsg = ({
    ica,
    buyContract,
    nftContract,
    tokenId,
    cost,
}: {
    ica: string;
    buyContract: string;
    nftContract: string;
    tokenId: string;
    cost: string;
}) => {
    return {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: {
            sender: ica,
            contract: buyContract,
            msg: {
                buy_token: {
                    token_id: tokenId,
                    contract_address: nftContract,
                    class_id: 'injective',
                },
            },
            funds: [
                {
                    amount: cost,
                    denom: 'inj',
                },
            ],
        },
    };
};

export const createIcaSellMsg = ({
    ica,
    buyContract,
    nftContract,
    tokenId,
    cost,
}: {
    ica: string;
    buyContract: string;
    nftContract: string;
    tokenId: string;
    cost: string;
}) => {
    return {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: {
            sender: ica,
            contract: buyContract,
            msg: {
                send_nft: {
                    contract: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7', //buy contrat?
                    token_id: tokenId,
                    msg: Buffer.from(
                        JSON.stringify({
                            sell_token: {
                                token_id: tokenId,
                                contract_address: 'inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc74', //nft contract
                                class_id: 'injective',
                                price: {native: [{amount: cost, denom: 'inj'}]},
                            },
                        })
                    ).toString('base64'),
                },
            },
            funds: [],
        },
    };
};
