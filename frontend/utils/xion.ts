import {
  AllChains,
  AppChains,
  COIN_DICT,
  ICA_CONTROLLER_FALLBACK,
  INJ_ICA_ACCOUNT_PLACEHOLDER,
  ProposalStatus,
  TokenSymbols,
  chainConfigMap,
  channelOpenInitOptions,
} from '@/constants/app';
import {MultisigICAVault} from '@/types/asset';
import type {SendTxResult} from '@/types/tx';
import {AbstraxionAccount} from '@/types/wallet';
import {useAbstraxionAccount, useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {DeliverTxResponse, ExecuteResult} from '@cosmjs/cosmwasm-stargate';
import type {Coin} from '@cosmjs/stargate';
import BigNumber from 'bignumber.js';
import {v4 as uuidv4} from 'uuid';

export type HandleDepositArgs = {
  symbol: TokenSymbols;
  depositAmount: number;
  senderAddress: string;
  recipientAddress: string;
};

export type XionSigningClient = ReturnType<typeof useAbstraxionSigningClient>['client'];

export const transferOnXion = async (
  signingClient: XionSigningClient,
  args: HandleDepositArgs
): Promise<SendTxResult<ExecuteResult>> => {
  const {symbol, depositAmount, senderAddress, recipientAddress} = args;

  const proxy = chainConfigMap[AppChains.XION_TESTNET].proxyMultisig.address;
  const coin = COIN_DICT[symbol];
  const denom = coin.denomOn[AllChains.XION_TESTNET];
  const amount = new BigNumber(depositAmount).shiftedBy(coin.decimals).dp(0).toString();
  const funds: Coin[] = [
    {
      denom,
      amount,
    },
  ];

  const proxyMsg = {
    contract_addr: recipientAddress,
    payload: {
      send_token: {funds},
    },
  };

  try {
    const response = await signingClient?.execute(
      senderAddress,
      proxy,
      proxyMsg,
      'auto',
      `deposit to ${recipientAddress}`,
      funds
    );

    if (!response) {
      return {isSuccess: false, response: undefined};
    }

    return {isSuccess: true, response};
  } catch (error) {
    console.log('Failed to send tx: ', error);
    return {isSuccess: false, response: undefined};
  }
};

export const getBalanceOnXion = async (
  signingClient: XionSigningClient,
  args: {address: string; denom: string}
): Promise<Coin> => {
  const {address, denom} = args;

  try {
    const balance = await signingClient?.getBalance(address, denom);

    if (balance) return balance;

    return {
      denom,
      amount: '0',
    };
  } catch (error) {
    console.log(`Failed to get ${denom} balance on Xion: ${error}`);

    return {
      denom,
      amount: '0',
    };
  }
};

export const getIcaAccountAddress = async (
  signingClient: XionSigningClient,
  icaControllerAddress: string
): Promise<string | undefined> => {
  const msg = {get_contract_state: {}};
  const response = await signingClient?.queryContractSmart(icaControllerAddress, msg);
  const icaAccountAddress: string | undefined = response?.ica_info?.ica_address;
  return icaAccountAddress;
};

export type GetVaultMultisigsResponse = {
  controllers: readonly string[];
  multisigs: readonly string[];
};

export const getVaultMultisigs = async (
  signingClient: XionSigningClient,
  bech32Address: string
): Promise<readonly MultisigICAVault[]> => {
  const icaFactoryAddress = chainConfigMap[AppChains.XION_TESTNET].icaFactory.address;
  const msg = {
    query_multisig_by_member: bech32Address,
  };

  try {
    const response: GetVaultMultisigsResponse | undefined = await signingClient?.queryContractSmart(icaFactoryAddress, msg);

    console.log('getVaultMultisigs response:', response);

    const vaultMutisigs =
      response?.multisigs.reduce<Promise<readonly MultisigICAVault[]>>(async (accmPromise, multisig, index) => {
        const icaControllerAddress = response.controllers[index];
        const icaAccountAddress = await getIcaAccountAddress(signingClient, icaControllerAddress);

        const accm = await accmPromise;

        return icaControllerAddress
          ? [
            ...accm,
            {
              multisigAddress: multisig,
              icaControllerAddress: icaControllerAddress, //the ica controller should not fallback. it always exists
              icaAccountAddress: icaAccountAddress || INJ_ICA_ACCOUNT_PLACEHOLDER, // Use || instead of ?? to handle empty strings
            },
          ]
          : accm;
      }, Promise.resolve([])) ?? [];

    return vaultMutisigs;
  } catch (error) {
    console.log(`Failed to get vault multisigs: ${error}`);

    return [];
  }
};

export type ProposalResponse = {
  id: string;
  title: string;
  description: string;
  msgs: any[];
  status: ProposalStatus;
  threshold: unknown;
  proposer: string;
  deposit: unknown;
};

export type GetProposalsResponse = {
  proposals: readonly ProposalResponse[];
};

export async function getProposals(client: XionSigningClient, icaMultisigAddress: string): Promise<GetProposalsResponse> {
  const msg = {
    list_proposals: {},
  };

  try {
    const response: GetProposalsResponse | undefined = await client?.queryContractSmart(icaMultisigAddress, msg);

    console.log('getProposals response:', response);

    return response ?? {proposals: []};
  } catch (error) {
    console.log('getProposals error:', error);
  }

  return {proposals: []};
}

export type VoterResponse = {addr: string; weight: string};

export type GetVotersResponse = {
  voters: readonly VoterResponse[];
};

export async function getVoters(client: XionSigningClient, icaMultisigAddress: string): Promise<GetVotersResponse> {
  const msg = {
    list_voters: {},
  };

  try {
    const response: GetVotersResponse | undefined = await client?.queryContractSmart(icaMultisigAddress, msg);

    console.log('getVoters response:', response);

    return response ?? {voters: []};
  } catch (error) {
    console.log('getVoters error:', error);
  }

  return {voters: []};
}

export type GetMultisigThresholdResponse = {
  absolute_count: {weight: string; total_weight: string};
};

export async function getMultisigThreshold(
  client: XionSigningClient,
  icaMultisigAddress: string
): Promise<GetMultisigThresholdResponse | undefined> {
  const msg = {
    threshold: {},
  };

  try {
    const response: GetMultisigThresholdResponse | undefined = await client?.queryContractSmart(icaMultisigAddress, msg);

    console.log('getMultisigThreshold response:', response);

    return response;
  } catch (error) {
    console.log('getMultisigThreshold error:', error);
  }

  return undefined;
}

const CONFIG = chainConfigMap[AppChains.XION_TESTNET];
const CHANNEL_OPTIONS = channelOpenInitOptions[AppChains.XION_TESTNET];

export async function createICAMultisigVault(
  client: XionSigningClient,
  account: AbstraxionAccount,
  ica_factory: string,
  memberAddresses: string[]
) {
  const voters = memberAddresses.map((address) => ({
    addr: address,
    weight: 1,
  }));

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
        proxy: CONFIG.proxyMultisig.address,
      },
      channel_open_init_options: {
        connection_id: CHANNEL_OPTIONS.connectionId,
        counterparty_connection_id: CHANNEL_OPTIONS.counterpartyConnectionId,
      },
      salt: uuidv4(),
    },
  };
  console.log('msg', msg);

  try {
    const instantiateResponse = await client?.execute(account.bech32Address, ica_factory, msg, 'auto');
    console.log('instantiateResponse', instantiateResponse);

    const instantiate_events = instantiateResponse?.events.filter((e: any) => e.type === 'instantiate');
    const ica_multisig_address = instantiate_events
      ?.find((e: any) =>
        e.attributes.find((attr: any) => attr.key === 'code_id' && attr.value === CONFIG.cw3FixedMultisig.codeId)
      )
      ?.attributes.find((attr: any) => attr.key === '_contract_address')?.value;
    console.log('ica_multisig_address:', ica_multisig_address);

    const channel_open_init_events = instantiateResponse?.events.filter((e: any) => e.type === 'channel_open_init');
    console.log('channel_open_init_events', channel_open_init_events);
    const src_channel_id = channel_open_init_events?.[0]?.attributes?.find((attr: any) => attr.key === 'channel_id')?.value;
    const src_port_id = channel_open_init_events?.[0]?.attributes?.find((attr: any) => attr.key === 'port_id')?.value;
    const destination_port = channel_open_init_events?.[0]?.attributes?.find(
      (attr: any) => attr.key === 'counterparty_port_id'
    )?.value;

    return {
      ica_multisig_address,
      channel_init_info: {
        src_channel_id,
        src_port_id,
        destination_port,
      },
    };
  } catch (error) {
    console.log('error', error);
    alert(error);
  }
}
