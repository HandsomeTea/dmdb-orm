/* eslint-disable no-var */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dmdb from 'dmdb';
import { logSql } from './utils';


export var ORM_DMDB_SERVER: dmdb.Connection | null = null;

interface DmdbSetting {
    modelName: string
    createdAt?: string
    updatedAt?: string
    logger?: boolean | ((sql: string) => void)
}

export type DmServerOption = Omit<DmdbSetting, 'createdAt' | 'updatedAt'> & {
    createdAt?: string | boolean,
    updatedAt?: string | boolean,
}

export var ORM_DMDB_SETTING: DmdbSetting = { modelName: '' };

export class DMServer {
    private dmdbConnectionParams: dmdb.PoolAttributes;
    private service!: dmdb.Connection;
    private isReady = false;
    constructor(connect: dmdb.PoolAttributes, option: DmServerOption) {
        this.isReady = false;

        const { modelName, createdAt, updatedAt, logger } = option;

        ORM_DMDB_SETTING.modelName = modelName;
        if (createdAt) {
            ORM_DMDB_SETTING.createdAt = typeof createdAt === 'string' ? createdAt : 'createdAt';
        }
        if (updatedAt) {
            ORM_DMDB_SETTING.updatedAt = typeof updatedAt === 'string' ? updatedAt : 'updatedAt';
        }
        if (typeof logger !== 'undefined') {
            ORM_DMDB_SETTING.logger = logger;
        }

        this.dmdbConnectionParams = connect;
    }

    public async connect() {
        const pool = await dmdb.createPool(this.dmdbConnectionParams);

        this.service = await pool.getConnection();
        const testSql = 'SELECT 1+1 AS "result";';

        logSql(testSql);
        const test = await this.service.execute(testSql, [], { outFormat: dmdb.OUT_FORMAT_OBJECT });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (test.rows[0].result === 2) {
            ORM_DMDB_SERVER = this.service;
            this.isReady = true;
        }
    }

    public get server() {
        return this.service;
    }

    public get isOK() {
        return this.isReady;
    }

    public async close(): Promise<void> {
        if (this.isOK) {
            await this.service.close();
            this.isReady = false;
        }
    }
}
