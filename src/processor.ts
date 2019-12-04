import { Block } from "./data/bitcoind/bitcoind-types";
import { BitcoinMysql } from "./data/mysql/bitcoin-mysql";
import { BlockDto, TxDto } from "./data/mysql/bitcoin-types";

export class Processor {
    private bitcoinMapper: BitcoinMysql;
    private txidMap: Map<string, string>;
    private voutMap: Map<string, string>;

    constructor(bitcoinMapper: BitcoinMysql) {
        this.bitcoinMapper = bitcoinMapper;
        this.txidMap = new Map<string, string>();
        this.voutMap = new Map<string, string>();
    }

    public async insertBlock(block: Block) {
        // construct insert object
        let blockDto: BlockDto = {
            bits: block.bits,
            block_id: 0,
            difficulty: block.difficulty,
            hash: block.hash,
            height: block.height,
            merkleroot: block.merkleroot,
            nonce: block.nonce,
            size: block.size,
            time: block.time,
            version: block.version,
        };

        // insert the object
        await this.bitcoinMapper.insertBlock(blockDto);

        // load the object again so we can have the id
        blockDto = await this.bitcoinMapper.findBlockByHash(block.hash);

        // insert each transaction
        for (let i = 1; i < 3; i++) {
            await this._insertTx(blockDto.block_id, i, block.tx[i]);
        }
    }

    protected async _insertTx(blockId: number, n: number, tx: any) {
        const txDto: TxDto = {
            block_id: blockId,
            tx_id: 0,
            tx_id_bin: tx.txid,
        };

        await this.bitcoinMapper.insertTx(txDto);

        // for (let i = 0; i < tx.vin.length; i++) {
        //     // check vout cache
        //     // check tx cache
        //     // otherwise insert
        // }

        // for (let i = 0; i < tx.vout.length; i++) {
        //     //
        // }
    }
}
