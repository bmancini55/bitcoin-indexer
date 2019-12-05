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

    for (let height = 600000; height < 600500; height++) {
        const block = await bitcoinClient.getFullBlock(height);
        await processor.insertBlock(block);
    }

    await mysqlClient.close();
}

// tslint:disable-next-line
run().catch(console.error);
