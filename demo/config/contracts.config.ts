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
            address: "xion1n7p3k5ffmj4upmfuhhak6yua5psfwcsh6ejevwh53s2nj8y8sg2sdexzp9"
        },
        hardcodedIcaMultisig: {
            address: "xion159wtf5pjpwstxxd57dpv48w3zzdvg3lzrlwcy88m8uulpr4k3m3qyzqaxv"
        },
        hardcodedIcaController: {
            address: "xion1e5xxs5nedn9945kcnz82g7gtvtqplvp85cw935chfw5lq209awdqqqdu3u"
        }

    }
}

export default contracts;
