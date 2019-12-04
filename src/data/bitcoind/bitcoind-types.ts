export type Block = {
    hash: string;
    confirmations: number;
    strippedsize: number;
    size: number;
    weight: number;
    height: number;
    version: number;
    versionHex: string;
    merkleroot: string;
    time: number;
    mediantime: number;
    nonce: number;
    bits: string;
    difficulty: number;
    chainwork: string;
    nTx: number;
    previousblockhash: string;
    nextblockhash: string;
    tx: [CoinbaseTx, ...Tx[]];
};

export type Tx = {
    txid: string;
    hash: string;
    version: number;
    size: number;
    vsize: number;
    weight: number;
    locktime: number;
    vin: Vin[];
    vout: Vout[];
};

export type CoinbaseTx = {
    txid: string;
    hash: string;
    version: number;
    size: number;
    vsize: number;
    weight: number;
    locktime: number;
    vin: CoinbaseVin[];
    vout: Vout[];
};

export type Vin = {
    txid: string;
    vout: number;
    scriptSig: ScriptSig;
    sequence: number;
};

export type CoinbaseVin = {
    coinbase: string;
    sequence: number;
};

export type ScriptSig = {
    asm: string;
    hex: string;
};

export type Vout = {
    value: number;
    n: number;
    scriptPubKey: ScriptPubKey;
};

export type ScriptPubKey = {
    asm: string;
    hex: string;
    reqSigs: number;
    type: string;
    addresses: string[];
};
