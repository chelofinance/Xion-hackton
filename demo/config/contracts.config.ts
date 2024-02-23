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
            connectionId: "connection-45",
            counterpartyConnectionId: "connection-213"
        },
        cw3FixedMultisig: {
            codeId: "256"
        },
        icaFactory: {
            address: "xion1m7a6vv87lr3cueq5xr6p8gk296784eg264p7vhp34g2whm708v5qdxzcwp"
        },
        proxyMultisig: {
            address: "xion15akp3vrj5zn2u9ktejwjz2s2uf2usk9rdtfkz4klh66w9n5t4xts83n0vl"
        }
    }
}

export default contracts;
