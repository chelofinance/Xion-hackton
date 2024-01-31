export type Contracts = {
    cw3FixedMultisig: {
        codeId: number;
    };
    nomosFactory: {
        address: string;
    }
};

export type SupportedNetworks = "xion-testnet";

const contracts: Record<SupportedNetworks, Contracts> = {
    "xion-testnet": {
        cw3FixedMultisig: {
            codeId: 50
        },
        nomosFactory: {
            address: "xion1jyrjanlg6mvna42rur559t8rcscrjfrayz4flasfymyvpzvkgefs9mnylc"
        }
    }
}

export default contracts;
