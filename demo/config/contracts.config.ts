export type Contracts = {
    channelOpenInitOptions: {
        connectionId: string;
        counterpartyConnectionId: string;
    };
    cw3FixedMultisig: {
        codeId: string;
    };
    icaFactory: {
        address: string;
    };
    proxyMultisig: {
        address: string;
    };
};

export type SupportedNetworks = "xion-testnet";

const contracts: Record<SupportedNetworks, Contracts> = {
    "xion-testnet": {
        channelOpenInitOptions: {
            connectionId: "connection-44",
            counterpartyConnectionId: "connection-212"
        },
        cw3FixedMultisig: {
            codeId: "190"
        },
        icaFactory: {
            address: "xion1l33tz82g5n6kq6gtceyjhsk0fcqqrytwr5dzglaq5pulq96np4vqm6k8ce"
        },
        proxyMultisig: {
            address: "xion1y88tpcx8e8uz5y22an704ap558k6t7jw5r0e7n9e2scparmt82qsj74n96"
        }
    }
}

export default contracts;
