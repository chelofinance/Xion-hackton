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
            address: "xion1l33tz82g5n6kq6gtceyjhsk0fcqqrytwr5dzglaq5pulq96np4vqm6k8ce"
        },
        hardcodedIcaMultisig: {
            address: "xion1t405m8nw4c8qcgheunpt73mvlj0t5n4mahrc970yyw7evy63g8ts9f9zqs"
        }
    }
}

export default contracts;
