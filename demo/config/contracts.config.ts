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
            codeId: "246"
        },
        icaFactory: {
            address: "xion12yetpccljlw9fa3emp7nn0cl4xapc99fym6pns4wjknsxupxe2aqgxlvdd"
        },
        proxyMultisig: {
            address: "xion1ygmla4psmxf8ts6qzg5rm38u973qc2fvsfm28hv4macmj64jecgq4jw7dh"
        }
    }
}

export default contracts;
