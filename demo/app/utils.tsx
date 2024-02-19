// Utils functions for the app

import { v4 as uuidv4 } from "uuid";
import {
  produceProposal,
  INJECTIVE_CONTRACT_MSG_URI,
} from "./propose";
import Contracts from "@/config/contracts.config";
import type { Coin } from "@cosmjs/stargate"

const contracts = Contracts["xion-testnet"];

export async function getIcaAccountAddress(
  client: any,
  ica_controller_address: string
) {
  const contract_response = await client?.queryContractSmart(
    ica_controller_address,
    { get_contract_state: {} }
  );
  console.log("contract_response", contract_response);
  const ica_account_address = contract_response?.ica_info?.ica_address;
  return ica_account_address;
}

export async function getIcaControllerAddress(
  client: any,
  ica_multisig_address: string
) {
  const ica_controller_response = await client?.queryContractSmart(
    contracts.icaFactory.address,
    { query_controller_by_multisig: ica_multisig_address }
  );
  console.log("ica_controller_response", ica_controller_response);
  return ica_controller_response?.controller;
}

export async function createIcaMultisig(
  client: any,
  account: any,
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
      },
      channel_open_init_options: {
        connection_id: contracts.channelOpenInitOptions.connectionId,
        counterparty_connection_id:
          contracts.channelOpenInitOptions.counterpartyConnectionId,
      },
      salt: uuidv4(),
    },
  };
  console.log("msg", msg);

  try {
    const instantiateResponse = await client?.execute(
      account.bech32Address,
      ica_factory,
      msg,
      "auto"
    );
    console.log("instantiateResponse", instantiateResponse);

    const instantiate_events = instantiateResponse?.events.filter(
      (e: any) => e.type === "instantiate"
    );
    const ica_multisig_address = instantiate_events
      ?.find((e: any) =>
        e.attributes.find(
          (attr: any) => attr.key === "code_id" && attr.value === contracts.cw3FixedMultisig.codeId
        )
      )
      ?.attributes.find((attr: any) => attr.key === "_contract_address")?.value;
    console.log("ica_multisig_address:", ica_multisig_address);

    const channel_open_init_events = instantiateResponse?.events.filter(
      (e: any) => e.type === "channel_open_init"
    );
    console.log("channel_open_init_events", channel_open_init_events);
    const src_channel_id = channel_open_init_events[0]?.attributes?.find(
      (attr: any) => attr.key === "channel_id"
    )?.value;
    const src_port_id = channel_open_init_events[0]?.attributes?.find(
      (attr: any) => attr.key === "port_id"
    )?.value;
    const destination_port = channel_open_init_events[0]?.attributes?.find(
      (attr: any) => attr.key === "counterparty_port_id"
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
    console.log("error", error);
    alert(error);
  }
}

function generateIcaMsg(msg: any) {
  const ibcMsg = {
    propose: {
      title: "Test Proposal",
      description: "This is a test proposal",
      msgs: Object.keys(msg).length === 0 ? [] : [msg], // ToDo: Add messages
    },
  };
  return ibcMsg;
}

export async function getAbstractAddress(client: any, account: any) {
  const abstractAccount = await client?.getAccount(account.bech32Address);
  return abstractAccount?.address || "";
}

export async function createProposal(
  client: any,
  account: any,
  injectiveMsg: any,
  icaMultisigAddress: string,
  icaControllerAddress: string,
  icaAccountAddress: string
) {
  console.log("icaMultisigAddress", icaMultisigAddress);
  console.log("icaControllerAddress", icaControllerAddress);
  console.log("icaAccountAddress", icaAccountAddress);

  const proposalMsg = {
    propose: produceProposal(injectiveMsg, icaControllerAddress),
  };

  console.log("proposalMsg", proposalMsg);

  console.log("msg", JSON.stringify({
    contract_addr: icaMultisigAddress,
    payload: proposalMsg,
  }))

  try {
    const executionResponse = await client?.execute(
      account.bech32Address,
      contracts.proxyMultisig.address,
      {
        contract_addr: icaMultisigAddress,
        payload: proposalMsg,
      },
      "auto"
    );
    console.log("executionResponse", executionResponse);

    const proposal_id = executionResponse?.events
      .find((e: any) => e.type === "wasm")
      ?.attributes.find((a: any) => a.key === "proposal_id")?.value;
    console.log("proposal_id", proposal_id);
    return { proposal_id };
  } catch (error) {
    console.log("error", error);
    alert(error);
  }
}

export async function voteProposal(
  client: any,
  account: any,
  icaMultisigAddress: string,
  proposalId: string,
  vote: string
) {
  const msg = {
    vote: {
      proposal_id: proposalId,
      vote,
    },
  };

  console.log("fullmsg", JSON.stringify({
    contract_addr: icaMultisigAddress,
    payload: msg,
  }));

  try {
    const executionResponse = await client?.execute(
      account.bech32Address,
      contracts.proxyMultisig.address,
      {
        contract_addr: icaMultisigAddress,
        payload: msg,
      },
      "auto"
    );
    console.log("executionResponse", executionResponse);
  } catch (error) {
    console.log("error", error);
    alert(error);
  }
}

export async function executeProposal(
  client: any,
  account: any,
  icaMultisigAddress: string,
  proposalId: string
) {
  const msg = {
    execute: {
      proposal_id: proposalId,
    },
  };

  console.log("fullmsg", JSON.stringify({
    contract_addr: icaMultisigAddress,
    payload: msg,
  }));

  try {
    const executionResponse = await client?.execute(
      account.bech32Address,
      contracts.proxyMultisig.address,
      {
        contract_addr: icaMultisigAddress,
        payload: msg,
      },
      "auto"
    );
    console.log("executionResponse", executionResponse);
    return executionResponse;
  } catch (error) {
    console.log("error", error);
    alert(error);
  }
}

export async function getProposalList(client: any, icaMultisigAddress: string) {
  const msg = {
    list_proposals: {},
  };

  try {
    const queryResponse = await client?.queryContractSmart(
      icaMultisigAddress,
      msg
    );
    console.log("queryResponse", queryResponse);
    return queryResponse;
  } catch (error) {
    console.log("error", error);
    alert(error);
  }
  return [];
}

export async function getMemberList(client: any, icaMultisigAddress: string) {
  const msg = {
    list_voters: {},
  };

  try {
    const queryResponse = await client?.queryContractSmart(
      icaMultisigAddress,
      msg
    );
    console.log("queryResponse", queryResponse);
    alert(JSON.stringify(queryResponse));
    return queryResponse;
  } catch (error) {
    console.log("error", error);
    alert(error);
  }
  return [];
}

export async function getBalance(client: any, address: string) {
  try {
    const accountBalance = await client?.getBalance(address, "uxion");
    console.log("accountBalance", accountBalance);

    alert(
      `Account Balance: ${accountBalance?.amount} ${accountBalance?.denom}`
    );
    return accountBalance;
  } catch (error) {
    console.log("error", error);
    alert(error);
  }
}

export async function addMember(
  client: any,
  account: any,
  icaMultisigAddress: string,
  memberAddress: string,
  amount: string,
) {
  const msg = {
    add_member: {
      address: memberAddress,
      fee: {
        amount,
        denom: "inj",
      },
    }
  };

  console.log("msg1", msg);

  console.log("msg2", JSON.stringify({
    contract_addr: icaMultisigAddress,
    payload: msg,
  }))

  try {
    const executionResponse = await client?.execute(
      account.bech32Address,
      contracts.proxyMultisig.address,
      {
        contract_addr: icaMultisigAddress,
        payload: msg,
      },
      "auto",
    );
    console.log("executionResponse", executionResponse);

    return executionResponse;
  } catch (error) {
    console.log("error", error);
    alert(error);
  }
}
