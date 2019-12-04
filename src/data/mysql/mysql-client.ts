import * as mysqlClient from "@altangent/mysql-client";
import { MysqlConfig } from "./mysql-config";

export class MysqlClient {
    private config: MysqlConfig;
    private pool: any;

    constructor(config: MysqlConfig) {
        this.config = config;
    }

    public async open() {
        this.pool = await mysqlClient.createPool(this.config);
    }

    public async close() {
        this.pool.end();
    }

    public async query<T>(sql: string, params?: object): Promise<T> {
        return await this.pool.query(sql, params);
    }

    public async queryOne<T>(sql: string, params?: object): Promise<T> {
        const results = await this.pool.query(sql, params);
        return results[0];
    }
}
