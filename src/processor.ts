import { Block, Tx } from "./data/bitcoind/bitcoind-types";
import { BitcoinMysql } from "./data/mysql/bitcoin-mysql";
import { BlockDto, TxDto, VoutDto } from "./data/mysql/bitcoin-types";

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
        const profileKey = `block ${block.height}`;
        console.time(profileKey);
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
        for (let i = 1; i < block.tx.length; i++) {
            await this._insertTx(blockDto.block_id, i, block.tx[i] as Tx);
        }

        console.timeEnd(profileKey);
    }

    protected async _insertTx(blockId: number, n: number, tx: Tx) {
        let txDto: TxDto = {
            block_id: blockId,
            n,
            tx_id: 0,
            tx_id_bin: tx.txid,
        };

        // save dto
        await this.bitcoinMapper.insertTx(txDto);

        // fetch with id
        txDto = await this.bitcoinMapper.findTxByTxId(tx.txid);

        // ensure tx_id is in cache
        this.txidMap.set(txDto.tx_id_bin, txDto.tx_id as string);

        // process all vin
        for (let i = 0; i < tx.vin.length; i++) {
            const vin = tx.vin[i];
            let vinTxDto = await this.bitcoinMapper.findTxByTxId(vin.txid);

            // insert the tx if it doesn't exist
            if (!vinTxDto) {
                await this.bitcoinMapper.insertTx({
                    block_id: null,
                    n,
                    tx_id: 0,
                    tx_id_bin: vin.txid,
                });
                vinTxDto = await this.bitcoinMapper.findTxByTxId(vin.txid);
            }

            // insert the vout
            await this.bitcoinMapper.insertVout({
                n: vin.vout,
                tx_id: vinTxDto.tx_id,
                value: 0,
                vout_id: 0,
            });

            // find the vout
            const voutDto = await this.bitcoinMapper.findVoutByOutpoint(
                vinTxDto.tx_id as string,
                vin.vout,
            );

            // insert the vin
            await this.bitcoinMapper.insertVin({
                n: i,
                tx_id: txDto.tx_id as string,
                vin_id: "",
                vout_id: voutDto.vout_id as string,
            });
        }

        // process out vout
        for (let i = 0; i < tx.vout.length; i++) {
            const vout = tx.vout[i];
            const voutDto: VoutDto = {
                n: i,
                tx_id: txDto.tx_id,
                value: vout.value,
                vout_id: 0,
            };
            await this.bitcoinMapper.insertVout(voutDto);
        }
    }
}
