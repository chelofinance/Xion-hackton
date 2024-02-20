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
            codeId: "202"
        },
        icaFactory: {
            address: "xion1g9egyh7npeuz35nlnmgz2fauehvytq02ehu2caley4gkgfkxek9sf4lwtz"
        },
        proxyMultisig: {
            address: "xion17j75yzhznj0r575dvf3ec7d3un6r4xqk2pgs2hvujkcmythtr3vq7ajcxw"
        }
    }
}

export default contracts;
