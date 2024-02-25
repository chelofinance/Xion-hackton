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
            codeId: "282"
        },
        icaFactory: {
            address: "xion134v97d8xu7hwuu6h33s0049yz8ju7254q32amlx5qfmngygpsk8q3hlp98"
        },
        proxyMultisig: {
            address: "xion1fcw3u2yslyszdaamvz3dea2jyhwhxlyuz5euujpzvrra9awdk6lqwdtcwd"
        }
    }
}

export default contracts;
