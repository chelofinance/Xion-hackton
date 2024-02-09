export type Contracts = {
    cw3FixedMultisig: {
        codeId: number;
    };
    nomosFactory: {
        address: string;
    };
    icaFactory: {
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
        },
        icaFactory: {
            address: "xion1n7p3k5ffmj4upmfuhhak6yua5psfwcsh6ejevwh53s2nj8y8sg2sdexzp9"
        }
    }
}

export default contracts;
