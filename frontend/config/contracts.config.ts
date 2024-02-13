export type Contracts = {
    channelOpenInitOptions: {
        connectionId: string;
        counterpartyConnectionId: string;
    };
    icaFactory: {
        address: string;
    };
    hardcodedIcaMultisig: {
        address: string;
    };
};

export type SupportedNetworks = "xion-testnet";

const contracts: Record<SupportedNetworks, Contracts> = {
    "xion-testnet": {
        channelOpenInitOptions: {
            connectionId: "connection-42",
            counterpartyConnectionId: "connection-210"
        },
        icaFactory: {
            address: "xion1qmjxqd2j3vgcjrc9ea70qae2rkf28tced4sv50twmuxshzrxyfsq7saj9e"
        },
        hardcodedIcaMultisig: {
            address: "xion1t405m8nw4c8qcgheunpt73mvlj0t5n4mahrc970yyw7evy63g8ts9f9zqs"
        }
    }
}

export default contracts;
