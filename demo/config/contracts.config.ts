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
            connectionId: "connection-43",
            counterpartyConnectionId: "connection-211"
        },
        cw3FixedMultisig: {
            codeId: "197"
        },
        icaFactory: {
            address: "xion1q4tfcucajg7dkllgayds5ur00rqngrheqjvs0d7nyyxrvlq3ynqq8n5m4l"
        },
        proxyMultisig: {
            address: "xion1q4r32n96ntq2cdrn9xggngwej6p8pgluttyzwr02x8d8c0u3eakq4ekckk"
        }
    }
}

export default contracts;
