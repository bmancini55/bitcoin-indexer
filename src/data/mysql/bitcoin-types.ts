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
    n: number;
};

export type VoutDto = {
    vout_id: number | string;
    tx_id: number | string;
    n: number;
    value: number | string;
};

export type VinDto = {
    vin_id: string;
    tx_id: string;
    n: number;
    vout_id: string;
};

export type AddressDto = {
    address_id?: string;
    address: string;
};
