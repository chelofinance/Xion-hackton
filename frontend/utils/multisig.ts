// This is a copy from /demo/app/utils.tsx

import {v4 as uuidv4} from 'uuid';
import {produceProposal, ProposalMessage} from './propose';
import {SendTxResult} from '@/types/tx';
import {GetProposalsResponse, XionSigningClient} from './xion';
import {AppChains, chainConfigMap, channelOpenInitOptions} from '@/constants/app';
import {AbstraxionAccount} from '@/types/wallet';

export async function getIcaAccountAddress(client: any, ica_controller_address: string) {
    const contract_response = await client?.queryContractSmart(ica_controller_address, {get_contract_state: {}});
    const ica_account_address = contract_response?.contract_state?.address;
    return ica_account_address;
}

export async function getIcaControllerAddress(client: any, ica_multisig_address: string) {
    const ica_controller_response = await client?.queryContractSmart(chainConfigMap[AppChains.XION_TESTNET].icaFactory.address, {
        query_controller_by_multisig: ica_multisig_address,
    });
    console.log('ica_controller_response', ica_controller_response);
    return ica_controller_response?.controller;
}

export type CreateIcaMultisigResult = {
    instantiateResponse: any;
    ica_multisig_address: string | undefined;
    channel_init_info: {
        src_channel_id: string | undefined;
        src_port_id: string | undefined;
        destination_port: string | undefined;
    };
};

export async function createIcaMultisig(
    client: any,
    account: {bech32Address: string},
    ica_factory: string,
    memberAddresses: string[]
): Promise<SendTxResult<CreateIcaMultisigResult>> {
    const voters = memberAddresses.map((address) => ({addr: address, weight: 1}));

    const msg = {
        deploy_multisig_ica: {
            multisig_instantiate_msg: {
                voters,
                threshold: {
                    absolute_count: {
                        weight: 1,
                    },
                },
                max_voting_period: {
                    time: 36000,
                },
                proxy: chainConfigMap[AppChains.XION_TESTNET].proxyMultisig.address,
            },
            channel_open_init_options: {
                connection_id: channelOpenInitOptions[AppChains.XION_TESTNET].connectionId,
                counterparty_connection_id: channelOpenInitOptions[AppChains.XION_TESTNET].counterpartyConnectionId,
            },
            salt: uuidv4(),
        },
    };
    console.log('msg', msg, ica_factory, client);

    try {
        const instantiateResponse = await client?.execute(account.bech32Address, ica_factory, msg, 'auto');
        console.log('instantiateResponse', instantiateResponse);

        const instantiate_events = instantiateResponse?.events.filter((e: any) => e.type === 'instantiate');
        const ica_multisig_address: string | undefined = instantiate_events
            ?.find((e: any) =>
                e.attributes.find(
                    (attr: any) =>
                        attr.key === 'code_id' && attr.value === chainConfigMap[AppChains.XION_TESTNET].cw3FixedMultisig.codeId
                )
            )
            ?.attributes.find((attr: any) => attr.key === '_contract_address')?.value;
        console.log('ica_multisig_address:', ica_multisig_address);

        const channel_open_init_events = instantiateResponse?.events.filter((e: any) => e.type === 'channel_open_init');
        console.log('channel_open_init_events', channel_open_init_events);
        const src_channel_id: string | undefined = channel_open_init_events[0]?.attributes?.find(
            (attr: any) => attr.key === 'channel_id'
        )?.value;
        const src_port_id: string | undefined = channel_open_init_events[0]?.attributes?.find(
            (attr: any) => attr.key === 'port_id'
        )?.value;
        const destination_port: string | undefined = channel_open_init_events[0]?.attributes?.find(
            (attr: any) => attr.key === 'counterparty_port_id'
        )?.value;

        return {
            isSuccess: true,
            response: {
                instantiateResponse,
                ica_multisig_address,
                channel_init_info: {
                    src_channel_id,
                    src_port_id,
                    destination_port,
                },
            },
        };
    } catch (error) {
        console.log('error', error);
        // alert(error);
        return {
            isSuccess: false,
            response: undefined,
        };
    }
}

export async function createIcaProposal({
    client,
    account,
    injectiveMsgs,
    xionMsgs,
    multisig,
    icaController,
}: {
    client: XionSigningClient;
    account: AbstraxionAccount;
    xionMsgs: ProposalMessage[];
    injectiveMsgs: any[];
    multisig: string;
    icaController: string;
}) {
    const proxy = chainConfigMap[AppChains.XION_TESTNET].proxyMultisig.address;
    const multisigProposal = {
        propose: produceProposal(xionMsgs, injectiveMsgs, icaController),
    };
    const proxyMessage = {
        contract_addr: multisig,
        payload: {
            multisig_execute_msg: multisigProposal,
        },
    };

    try {
        console.log({
            multisigProposal,
            proxyMessage,
            proxy,
            address: account.bech32Address,
        });

        const executionResponse = await client?.execute(account.bech32Address, proxy, proxyMessage, 'auto');
        console.log('executionResponse', executionResponse);

        const proposal_id: string | undefined = executionResponse?.events
            .find((e: any) => e.type === 'wasm')
            ?.attributes.find((a: any) => a.key === 'proposal_id')?.value;

        console.log('proposal_id', proposal_id);

        return {proposal_id};
    } catch (error) {
        console.log('error', error);
        alert(error);
        return {proposal_id: undefined};
    }
}

export async function voteProposal(client: any, account: any, icaMultisigAddress: string, proposalId: string, vote: any) {
    const msg = {
        vote: {
            proposal_id: proposalId,
            vote,
        },
    };

    try {
        const executionResponse = await client?.execute(account.bech32Address, icaMultisigAddress, msg, 'auto');
        console.log('executionResponse', executionResponse);
    } catch (error) {
        console.log('error', error);
        // alert(error);
    }
}

export async function executeProposal(client: any, account: any, icaMultisigAddress: string, proposalId: number) {
    const msg = {
        execute: {
            proposal_id: proposalId,
        },
    };

    try {
        const executionResponse = await client?.execute(account.bech32Address, icaMultisigAddress, msg, 'auto');
        console.log('executionResponse', executionResponse);
        return executionResponse;
    } catch (error) {
        console.log('error', error);
        alert(error);
    }
}

export async function getProposalList(client: any, icaMultisigAddress: string): Promise<GetProposalsResponse> {
    const msg = {
        list_proposals: {start_after: 0},
    };

    try {
        const response: GetProposalsResponse | undefined = await client?.queryContractSmart(icaMultisigAddress, msg);

        console.log('getProposalList response:', response);

        return response ?? {proposals: []};
    } catch (error) {
        console.log('getProposalList error:', error);
    }

    return {proposals: []};
}

export async function getBalance(client: any, address: string) {
    try {
        const accountBalance = await client?.getBalance(address, 'uxion');
        console.log('accountBalance', accountBalance);

        alert(`Account Balance: ${accountBalance?.amount} ${accountBalance?.denom}`);
        return accountBalance;
    } catch (error) {
        console.log('error', error);
        alert(error);
    }
}

export async function joinVault(
    client: any,
    account: any,
    icaMultisigAddress: string,
    memberAddress: string,
    amount: string,
    denom: string
) {
    const fee = {
        amount,
        denom,
    };

    const msg = {
        add_member: {
            address: memberAddress,
            fee,
            sender: account.bech32Address,
        },
    };

    try {
        const executionResponse = await client?.execute(
            account.bech32Address,
            chainConfigMap[AppChains.XION_TESTNET].proxyMultisig.address,
            {
                contract_addr: icaMultisigAddress,
                payload: msg,
            },
            'auto'
        );
        console.log('executionResponse', executionResponse);
        return executionResponse;
    } catch (error) {
        console.log('error', error);
        alert(error);
    }
}

export const createChannelProposal = async ({
    client,
    account,
    icaMultisigAddress,
    icaControllerAddress,
}: {
    client: any;
    account: any;
    icaMultisigAddress: string;
    icaControllerAddress: string;
}) => {
    try {
        const controllerMessage = {
            create_channel: {},
        };

        const fullProposal = {
            propose: {
                title: 'ICA transaction',
                description: 'Create ICA',
                msgs: [
                    {
                        wasm: {
                            execute: {
                                contract_addr: icaControllerAddress,
                                msg: Buffer.from(JSON.stringify(controllerMessage)).toString('base64'),
                                funds: [],
                            },
                        },
                    },
                ],
            },
        };

        const executionResponse = await client?.execute(account.bech32Address, icaMultisigAddress, fullProposal, 'auto');
        console.log({executionResponse});

        const proposal_id = executionResponse?.events
            .find((e: any) => e.type === 'wasm')
            ?.attributes.find((a: any) => a.key === 'proposal_id')?.value;
        return {proposal_id};
    } catch (error) {
        console.log('error', error);
        alert(error);
        return {proposal_id: 'null'};
    }
};
