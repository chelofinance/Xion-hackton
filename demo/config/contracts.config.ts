export type Contracts = {
    channelOpenInitOptions: {
        connectionId: string;
        counterpartyConnectionId: string;
    };
    cw3FixedMultisig: {
        codeId: number;
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
        cw3FixedMultisig: {
            codeId: 157
        },
        icaFactory: {
            address: "xion1v84yekkwnvperl9gjx80knxan7x3l6d0w7az5pp8p4t0e6zcamks93efuc"
        },
        hardcodedIcaMultisig: {
            address: "xion1t405m8nw4c8qcgheunpt73mvlj0t5n4mahrc970yyw7evy63g8ts9f9zqs"
        }
    }
}

export default contracts;
