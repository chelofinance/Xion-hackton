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
            codeId: "158"
        },
        icaFactory: {
            address: "xion1qmjxqd2j3vgcjrc9ea70qae2rkf28tced4sv50twmuxshzrxyfsq7saj9e"
        },
        proxyMultisig: {
            address: "xion1q5kd9rug3q9vrt9wxtt8kyypxj8e8xmg3sd4cqq7andusnemecasaa7exd"
        }
    }
}

export default contracts;
