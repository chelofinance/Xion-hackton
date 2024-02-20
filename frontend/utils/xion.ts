import { AllChains, COIN_DICT, TokenSymbols } from "@/constants/app";
import { Coin, DeliverTxResponse, SigningStargateClient } from "@cosmjs/stargate";
import BigNumber from "bignumber.js";

export type HandleDepositArgs = {
    symbol: TokenSymbols;
    depositAmount: number;
    senderAddress: string;
    recipientAddress: string;
}

export type SendTxResult = {
    isSuccess: true;
    response: DeliverTxResponse;
} | {
    isSuccess: false;
    response: DeliverTxResponse | undefined;
}

/**
 * 
 * @description no exported type for xion signing client..
 */
export const transferOnXion = async (signingClient: any, args: HandleDepositArgs): Promise<SendTxResult> => {
    const { symbol, depositAmount, senderAddress, recipientAddress } = args;

    const coin = COIN_DICT[symbol];
    const denom = coin.denomOn[AllChains.XION_TESTNET];
    const amount = new BigNumber(depositAmount).shiftedBy(coin.decimals).dp(0).toString();

    const fee = {
        amount: [
            {
                denom: COIN_DICT[TokenSymbols.XION].denomOn[AllChains.XION_TESTNET],
                amount: '1',
            },
        ],
        gas: '30000',
    };

    console.log('sendTokens', {
      senderAddress,
      recipientAddress,
      amount: [{
        denom,
        amount,
    }],
    fee,      
    });

    try {     
      const response = await (signingClient as SigningStargateClient | undefined)?.sendTokens(
        senderAddress,
        recipientAddress,
        [{
            denom,
            amount,
        }],
        fee
      );

      if (!response) {
        return { isSuccess: false, response: undefined, };
      }

      if (response.code !== undefined && response.code !== 0) {
        return { isSuccess: false, response, };
      } else {
        return { isSuccess: true, response, };
      }

    } catch (error) {
      console.log('Failed to send tx: ', error);
      return { isSuccess: false, response: undefined, };
    }
}

export const getBalanceOnXion = async (signingClient: any, args: { address: string; denom: string; }): Promise<Coin> => {
    const { address, denom } = args;

    try {
        const balance = await (signingClient as SigningStargateClient | undefined)?.getBalance(address, denom);

        if (balance) return balance;

        return {
            denom,
            amount: '0',
        };
    } catch(error) {
      console.log(`Failed to get ${denom} balance on Xion: ${error}`);
      
      return {
        denom,
        amount: '0',
      };
    }
}