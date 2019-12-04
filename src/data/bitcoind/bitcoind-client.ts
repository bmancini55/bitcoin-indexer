import * as fs from "fs";
import * as path from "path";
import { BitcoindConfig } from "./bitcoind-config";
import { Block } from "./bitcoind-types";

export class BitcoindClient {
    private config: BitcoindConfig;

    constructor(config: BitcoindConfig) {
        this.config = config;
    }

    public async getFullBlock(height: number): Promise<Block> {
        const filepath = path.resolve(__dirname, `../../../.data/json/${height}.json`);
        const raw = await fs.promises.readFile(filepath, "utf8");
        return JSON.parse(raw);
    }
}
