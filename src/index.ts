import * as config from "../config.json";
import { BitcoindClient } from "./data/bitcoind/bitcoind-client";
import { BitcoinMysql } from "./data/mysql/bitcoin-mysql";
import { MysqlClient } from "./data/mysql/mysql-client";
import { Processor } from "./processor";

async function run() {
    const mysqlClient = new MysqlClient(config.mysql);
    await mysqlClient.open();

    const bitcoinMapper = new BitcoinMysql(mysqlClient);
    const bitcoinClient = new BitcoindClient(config.bitcoind);
    const processor = new Processor(bitcoinMapper);

    const height = 600000;
    const block = await bitcoinClient.getFullBlock(height);
    await processor.insertBlock(block);

    // await bitcoinClient.getFullBlock(height);

    // let rawBlock = await bitcoinClient.getFullBlock(height);

    // await bitcoinMapper.insertBlock(rawBlock);

    // let block: any = await bitcoinMapper.findBlockByHeight(height);

    // // get txs

    // let rawtxs = rawBlock.tx.slice(1, 3);

    // let insertTxs = [];
    // let insertVouts = [];

    // for (let rawtx of rawtxs) {
    //     insertTxs.push({
    //         txIdBin: rawtx.txid,
    //         blockId: block.block_id,
    //     });

    //     // ensure tx
    //     for (let i = 0; i < rawtx.vin.length; i++) {
    //         let vin = rawtx.vin[i];
    //         insertTxs.push({
    //             txIdBin: vin.txid,
    //         });
    //     }
    // }

    // await bitcoinMapper.insertTxs(insertTxs);

    // // load transactions
    // let txs = bitcoinMapper.findTxByBlockId(block.block_id);

    //   const txMap = new Map<string, string>();
    //   for (let tx of txs) {
    //     txMap.set(tx.tx_id_bin, tx.tx_id);
    //   }

    //   // grab prior txs via vins

    //   // insert vins
    //   let vin_inserts = [];
    //   for (let rawtx of rawBlock.tx.slice(1, 3)) {
    //     for (let n = 0; n < rawtx.vin.length; n++) {
    //       console.log(rawtx.vin[n]);
    //       //   vin_inserts.push({
    //       //     txId: txMap.get(rawtx.txid),
    //       //     n,
    //       //   });
    //     }
    //   }
    //   await bitcoinMapper.insertVouts(vin_inserts);

    //   console.log(txs);

    await mysqlClient.close();
}

// tslint:disable-next-line
run().catch(console.error);
