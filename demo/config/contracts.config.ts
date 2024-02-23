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
            codeId: "251"
        },
        icaFactory: {
            address: "xion1jj64098deg8pupe3hjypcjtp3cs5fdd5ec63xky3ayztjr0426xsg6ssjs"
        },
        proxyMultisig: {
            address: "xion10ugvv7735uznx6sv8m6mplaywppht4wlm6sll36w5cdmj7j3rcpq4mmet7"
        }
    }
}

export default contracts;
