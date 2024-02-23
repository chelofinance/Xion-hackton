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

export type SupportedNetworks = 'xion-testnet';

const contracts: Record<SupportedNetworks, Contracts> = {
    'xion-testnet': {
        channelOpenInitOptions: {
            connectionId: 'connection-49',
            counterpartyConnectionId: 'connection-214',
        },
        icaFactory: {
            address: 'xion12yetpccljlw9fa3emp7nn0cl4xapc99fym6pns4wjknsxupxe2aqgxlvdd',
        },
        hardcodedIcaMultisig: {
            address: 'xion1t405m8nw4c8qcgheunpt73mvlj0t5n4mahrc970yyw7evy63g8ts9f9zqs',
        },
    },
};

export default contracts;
