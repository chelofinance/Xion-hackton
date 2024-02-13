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
