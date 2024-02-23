import { AllChains, AppChains, COIN_DICT, TokenSymbols, chainConfigMap } from "@/constants/app";
import type { SendTxResult } from "@/types/tx";
import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { DeliverTxResponse } from "@cosmjs/cosmwasm-stargate";
import type { Coin } from "@cosmjs/stargate";
import BigNumber from "bignumber.js";

export type HandleDepositArgs = {
  symbol: TokenSymbols;
  depositAmount: number;
  senderAddress: string;
  recipientAddress: string;
};

export type XionSigningClient = ReturnType<typeof useAbstraxionSigningClient>['client'];

export const transferOnXion = async (signingClient: XionSigningClient, args: HandleDepositArgs): Promise<SendTxResult<DeliverTxResponse>> => {
  const { symbol, depositAmount, senderAddress, recipientAddress } = args;

  const coin = COIN_DICT[symbol];
  const denom = coin.denomOn[AllChains.XION_TESTNET];
  const amount = new BigNumber(depositAmount).shiftedBy(coin.decimals).dp(0).toString();

  //const fee = {
  //amount: [
  //{
  //denom: COIN_DICT[TokenSymbols.XION].denomOn[AllChains.XION_TESTNET],
  //amount: '0',
  //},
  //],
  //gas: '200000',
  //};

  try {
    console.log(
      senderAddress,
      recipientAddress,
      [
        {
          denom,
          amount,
        },
      ],
      'auto'
    );

    const response = await signingClient?.sendTokens(
      senderAddress,
      recipientAddress,
      [
        {
          denom,
          amount,
        },
      ],
      'auto'
    );

    if (!response) {
      return {isSuccess: false, response: undefined};
    }

    if (response.code !== undefined && response.code !== 0) {
      return {isSuccess: false, response};
    } else {
      return {isSuccess: true, response};
    }
  } catch (error) {
    console.log('Failed to send tx: ', error);
    return {isSuccess: false, response: undefined};
  }
};

export const getBalanceOnXion = async (signingClient: XionSigningClient, args: {address: string; denom: string}): Promise<Coin> => {
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


export const getVaultMultisigs = async (signingClient: XionSigningClient, bech32Address: string) => {
  const icaFactoryAddress = chainConfigMap[AppChains.XION_TESTNET].icaFactory.address;
  const msg = {
    query_multisig_by_creator: bech32Address,
  };

  try {
    console.log('getVaultMultisigs params', {
      icaFactoryAddress,
      msg
    });

    const response = await signingClient?.queryContractSmart(icaFactoryAddress, msg);

    console.log('getVaultMultisigs response:', response);

  } catch(error) {
    console.log(`Failed to get vault multisigs: ${error}`);
    return [];
  }
}