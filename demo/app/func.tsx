//basic component
import React from 'react';

import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient } from "@burnt-labs/abstraxion";

const App = () => {
    const [loading, setLoading] = React.useState(false);
    const [multisigAddress, setMultisigAddress] = React.useState<string>("");
    const [memberAddresses, setMemberAddresses] = React.useState<string[]>(['xion1gh5hrkta3nze3yvut7u5507lxtje0ryz65zpzw']);

    const { data: account, isConnected } = useAbstraxionAccount();
    const { client } = useAbstraxionSigningClient();


    async function getMultisigAddressFromResponse(response: any) {
        // ToDo: get multisig address from response;
        return ""
    }

    async function createIcaMultisig() {
        setLoading(true);

        const voters = memberAddresses.map((address) => ({ addr: address, weight: 1 }));

        const msg = {
            deploy_multisig_ica: {
                multisig_instantiate_msg: {
                    create_multisig: {
                        voters,
                        threshold: {
                            absolute_count: {
                                weight: 1,
                            },
                        },
                        max_voting_period: {
                            time: 36000,
                        },
                    }
                },
                channel_open_init_options: {
                    connection_id: "connection-33",
                    counterparty_connection_id: "connection-198"
                },
                salt: ""
            }
        };

        try {
            const instantiateResponse = await client?.execute(
                account.bech32Address,
                "xion1n7p3k5ffmj4upmfuhhak6yua5psfwcsh6ejevwh53s2nj8y8sg2sdexzp9",
                msg,
                "auto",
            );
            console.log("instantiateResponse", instantiateResponse);
            setMultisigAddress(await getMultisigAddressFromResponse(instantiateResponse));

        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    async function createProposal() {
        setLoading(true);

        const msg = {
            propose: {
                "title": "Test Proposal",
                "description": "This is a test proposal",
                "msgs": [],
            }
        };

        try {
            const executionResponse = await client?.execute(
                account.bech32Address,
                multisigAddress,
                msg,
                "auto",
            );
            console.log("executionResponse", executionResponse);
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    async function voteProposal() {
        setLoading(true);

        const msg = {
            vote: {
                proposal_id: 0,
                vote: {},
            }
        };

        try {
            const executionResponse = await client?.execute(
                account.bech32Address,
                multisigAddress,
                msg,
                "auto",
            );
            console.log("executionResponse", executionResponse);
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    async function executeProposal() {
        setLoading(true);

        const msg = {
            execute: {
                proposal_id: 0,
                vote: {},
            }
        };

        try {
            const executionResponse = await client?.execute(
                account.bech32Address,
                multisigAddress,
                msg,
                "auto",
            );
            console.log("executionResponse", executionResponse);
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <></>
    );
};