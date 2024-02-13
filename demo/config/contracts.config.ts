export type Contracts = {
    cw3FixedMultisig: {
        codeId: number;
    };
    nomosFactory: {
        address: string;
    };
    icaFactory: {
        address: string;
    };
    hardcodedIcaMultisig: {
        address: string;
    };
    hardcodedIcaController: {
        address: string;
    };
};

export type SupportedNetworks = "xion-testnet";

const contracts: Record<SupportedNetworks, Contracts> = {
    "xion-testnet": {
        cw3FixedMultisig: {
            codeId: 50
        },
        nomosFactory: {
            address: "xion1jyrjanlg6mvna42rur559t8rcscrjfrayz4flasfymyvpzvkgefs9mnylc"
        },
        icaFactory: {
            address: "xion1tcx0s55pp5z7c938smnxn6e9d06mcdf0xpsrp85lyhmmwnfd0u5smetrhy"
        },
        hardcodedIcaMultisig: {
            address: "xion1lnggf6d4p9sjakt3ednqhtky2f8wvv5cca4vp4zze5p4at6pn4gsw2psar"
        },
        hardcodedIcaController: {
            address: "xion1mgq8p7gkel8ttehar9u042q658y2pfhr7p8mfcjtrk6uqtgl3wzs864nud"
        }

    }
}

export default contracts;
