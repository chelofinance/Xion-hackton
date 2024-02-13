import {InjectiveStargate} from '@injectivelabs/sdk-ts';
import {INJECTIVE_ID, INJECTIVE_RPC} from '@/constants/app';
import {InjectiveSigningStargateClient} from '@injectivelabs/sdk-ts/dist/cjs/core/stargate';

export const injectiveClient = async (signer: any) => {
    const [account] = await signer.getAccounts();
    const client: InjectiveSigningStargateClient = await InjectiveStargate.InjectiveSigningStargateClient.connectWithSigner(
        INJECTIVE_RPC,
        signer
    );

    return {client, account};
};

export const transferInjective = async ({
    client,
    amount,
    account,
    recipient,
}: {
    client: InjectiveSigningStargateClient;
    amount: string;
    account: string;
    recipient: string;
}) => {
    const fee = {
        amount: [
            {
                denom: 'inj',
                amount: '5000000000000000',
            },
        ],
        gas: '200000',
    };
    const result = await client.sendTokens(
        account,
        recipient,
        [
            {
                denom: 'inj',
                amount,
            },
        ],
        fee,
        ''
    );

    if (result.code !== undefined && result.code !== 0) {
        alert('Failed to send tx: ' + result.rawLog);
    } else {
        alert('Succeed to send tx:' + result.transactionHash);
    }

    return result;
};
