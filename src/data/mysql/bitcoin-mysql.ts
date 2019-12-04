import * as mysql from "mysql";
import { BlockDto, TxDto, VoutDto } from "./bitcoin-types";
import { MysqlClient } from "./mysql-client";

export class BitcoinMysql {
    private client: MysqlClient;

    constructor(client: MysqlClient) {
        this.client = client;
    }

    public async findBlockByHeight(height: number): Promise<BlockDto> {
        const sql = `
            select *
            from block
            where height = ?;
    `;
        return await this.client.queryOne(sql, [height]);
    }

    public async findBlockByHash(hash: string) {
        const sql = `
        select *
        from block
        where hash = ?;
    `;
        return await this.client.queryOne<BlockDto>(sql, [hash]);
    }

    public async findTxsByBlockId(blockId: number) {
        const sql = `
        select *
        from tx
        where block_id = ?;`;
        return await this.client.query<TxDto>(sql, [blockId]);
    }

    public async findTxsByOutpoint(txid: string, n: number) {
        const sql = `
        select * from tx
        where tx_id_bin = ${mysql.escape(txid)} and n = ${mysql.escape(n)};
    `;
        return await this.client.queryOne<TxDto>(sql);
    }

    public async insertBlock(block: BlockDto) {
        const sql = `
        insert into block (block_id, hash, height, size, time, version, merkleroot, nonce, bits, difficulty)
        values (
            0,
            ${mysql.escape(block.hash)},
            ${mysql.escape(block.height)},
            ${mysql.escape(block.size)},
            ${mysql.escape(block.time)},
            ${mysql.escape(block.version)},
            ${mysql.escape(block.merkleroot)},
            ${mysql.escape(block.nonce)},
            ${mysql.escape(block.bits)},
            ${mysql.escape(block.difficulty)}
        )
        on duplicate key update height=values(height);
    `;
        await this.client.query(sql);
    }

    public async insertTx(tx: TxDto) {
        const sql = `
        insert ignore into tx (tx_id, tx_id_bin, block_id)
        values (0, ${mysql.escape(tx.tx_id_bin)}, ${mysql.escape(tx.block_id)})`;
        await this.client.query(sql);
    }

    public async insertVout(vout: VoutDto) {
        const sql = `
    insert into vout (vout_id, tx_id, n, \`value\`)
    values (
        0,
        ${mysql.escape(vout.tx_id)},
        ${mysql.escape(vout.n)},
        ${mysql.escape(vout.value ? vout.value : "0")}
    ),`;
    }
}
