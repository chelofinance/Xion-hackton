import {TokenSymbols, COIN_DICT, AllChains} from '@/constants/app';
import BigNumber from 'bignumber.js';
import {INJECTIVE_CONTRACT_MSG_URI, WASM_CONTRACT_MSG_URI} from './propose';

export const createSendIbcMsg = ({icaAddress, amount}: {icaAddress: string; multisigAddress: string; amount: string}) => {
    const timestamp = BigNumber(Date.now() + 10_000_000)
        .multipliedBy(1_000_000)
        .toString();

    return {
        ibc: {
            transfer: {
                channel_id: 'channel-215',
                to_address: icaAddress,
                amount: {
                    amount: amount,
                    denom: COIN_DICT[TokenSymbols.INJ].denomOn[AllChains.XION_TESTNET],
                },
                timeout: {
                    timestamp: timestamp, //nanoseconds
                },
            },
        },
    };
};

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
        typeUrl: WASM_CONTRACT_MSG_URI,
        value: {
            sender: ica,
            contract: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7', //constant
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
        typeUrl: WASM_CONTRACT_MSG_URI,
        value: {
            sender: ica,
            contract: buyContract,
            msg: {
                send_nft: {
                    contract: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7', //constant
                    token_id: tokenId,
                    msg: Buffer.from(
                        JSON.stringify({
                            sell_token: {
                                token_id: tokenId,
                                contract_address: nftContract, //nft contract
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

export const createIcaBuyMsgInjective = ({
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
        typeUrl: INJECTIVE_CONTRACT_MSG_URI,
        value: {
            sender: ica,
            contract: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7', //constant
            msg: {
                buy_token: {
                    token_id: tokenId,
                    contract_address: nftContract,
                    class_id: 'injective',
                },
            },
            funds: `${cost}inj`,
        },
    };
};
