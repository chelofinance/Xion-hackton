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
    hardcodedIcaMultisig: {
        address: string;
    };
};

export type SupportedNetworks = "xion-testnet";

const contracts: Record<SupportedNetworks, Contracts> = {
    "xion-testnet": {
        channelOpenInitOptions: {
            connectionId: "connection-42",
            counterpartyConnectionId: "connection-210"
        },
        cw3FixedMultisig: {
            codeId: "158"
        },
        icaFactory: {
            address: "xion1qmjxqd2j3vgcjrc9ea70qae2rkf28tced4sv50twmuxshzrxyfsq7saj9e"
        },
        hardcodedIcaMultisig: {
            address: "xion1tnrxmr69uqnyacq74njadhrezmqwstllkjn9adqhd0fs0qhalf8smkrmt6"
        }
    }
}

export default contracts;
