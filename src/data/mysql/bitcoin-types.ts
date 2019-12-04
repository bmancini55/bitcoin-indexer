export type BlockDto = {
    block_id: number;
    hash: string;
    height?: number;
    size: number;
    time: number;
    version: number;
    merkleroot: string;
    nonce: number;
    bits: string;
    difficulty: number;
};

export type TxDto = {
    tx_id: number | string;
    tx_id_bin: string;
    block_id: number | string;
};

export type VoutDto = {
    vout_id: number | string;
    tx_id: number | string;
    n: number;
    value: number | string;
};
