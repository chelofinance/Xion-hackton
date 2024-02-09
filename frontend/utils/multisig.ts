// This is a copy from /demp/app/utils.tsx

import { v4 as uuidv4 } from "uuid";

async function getContractState(client: any, ica_controller_address: string) {
    const contract_state = await client?.queryContractSmart(ica_controller_address, { get_contract_state: {} });
    console.log("contract_state", contract_state);

    const ica_account_address = contract_state?.contract_state?.address;
    return { contract_state, ica_account_address };
}

export async function createIcaMultisig(client: any, account: any, ica_factory: string, memberAddresses: string[]) {

    const voters = memberAddresses.map((address) => ({ addr: address, weight: 1 }));

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
                }
            },
            channel_open_init_options: {
                connection_id: "connection-39",
                counterparty_connection_id: "connection-207"
            },
            salt: uuidv4()
        }
    };
    console.log("msg", msg);

    let ica_multisig_address = "";
    let ica_controller_address = "";
    let contract_state = {};
    let ica_account_address = "";

    try {
        const instantiateResponse = await client?.execute(
            account.bech32Address,
            ica_factory,
            msg,
            "auto",
        );
        console.log("instantiateResponse", instantiateResponse);

        const instantiate_events = instantiateResponse?.events.filter(
            (e: any) => e.type === "instantiate"
        );

        ica_multisig_address = instantiate_events
            ?.find((e: any) => e.attributes.find((attr: any) => attr.key === "code_id" && attr.value === "73"))
            ?.attributes.find((attr: any) => attr.key === "_contract_address")?.value;
        console.log("ica_multisig_address:", ica_multisig_address);


        ica_controller_address = instantiate_events
            ?.find((e: any) => e.attributes.find((attr: any) => attr.key === "code_id" && attr.value === "59"))
            ?.attributes.find((attr: any) => attr.key === "_contract_address")?.value;
        console.log("ica_controller_address:", ica_controller_address);

        if (ica_controller_address) {
            const { contract_state, ica_account_address } = await getContractState(client, ica_controller_address);
            alert(`Contract State: ${JSON.stringify(contract_state)}`)
        } else {
            alert("No ICA Controller Address found");
        }
        return { ica_multisig_address, ica_controller_address, contract_state, ica_account_address };

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
            msgs: msg ? [msg] : [], // ToDo: Add messages
        }
    };
    return ibcMsg;
}


export async function createProposal(client: any, account: any, icaMultisigAddress: string) {

    const msg = {}
    const ibcMsg = generateIcaMsg(msg);

    console.log("ibcMsg", JSON.stringify(ibcMsg));
    console.log("icaMultisigAddress", icaMultisigAddress);
    try {
        const executionResponse = await client?.execute(
            account.bech32Address,
            icaMultisigAddress,
            ibcMsg,
            "auto",
        );
        console.log("executionResponse", executionResponse);

        const proposal_id = executionResponse?.events.find(
            (e: any) => e.type === "wasm"
        )?.attributes.find(
            (a: any) => a.key === "proposal_id"
        )?.value;
        console.log("proposal_id", proposal_id);
        return { proposal_id };

    } catch (error) {
        console.log("error", error);
        alert(error);
    }
}

export async function voteProposal(client: any, account: any, icaMultisigAddress: string, proposalId: string, vote: any) {
    const msg = {
        vote: {
            proposal_id: proposalId,
            vote,
        }
    };

    try {
        const executionResponse = await client?.execute(
            account.bech32Address,
            icaMultisigAddress,
            msg,
            "auto",
        );
        console.log("executionResponse", executionResponse);

    } catch (error) {
        console.log("error", error);
        alert(error);
    }
}

export async function executeProposal(client: any, account: any, icaMultisigAddress: string, proposalId: string) {

    const msg = {
        execute: {
            proposal_id: proposalId
        }
    };

    try {
        const executionResponse = await client?.execute(
            account.bech32Address,
            icaMultisigAddress,
            msg,
            "auto",
        );
        console.log("executionResponse", executionResponse);
    } catch (error) {
        console.log("error", error);
        alert(error);
    }
}

export async function getBalance(client: any, address: string) {
    try {
        const accountBalance = await client?.getBalance(
            address,
            "uxion"
        );
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