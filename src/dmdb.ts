/* eslint-disable no-var */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dmdb from 'dmdb';


export var ORM_DMDB_SERVER: dmdb.Connection | null = null;

interface DmdbSetting {
    modelName: string
    createdAt?: string
    updatedAt?: string
    /** 时区取值，default: iso。
     * iso: 将使用new Date().toISOString()取值并使用sql函数to_date存库
     * local: 将使用new Date().toLocaleString()取值并使用sql函数to_date存库
     */
    timezone?: 'iso' | 'local',
    logger?: boolean | ((sql: string) => void)
}

export type DmServerOption = Omit<DmdbSetting, 'createdAt' | 'updatedAt'> & {
    createdAt?: string | boolean,
    updatedAt?: string | boolean,
}

export var ORM_DMDB_SETTING: DmdbSetting = { timezone: 'iso', modelName: '' };

export class DMServer {
    private dmdbConnectionParams: dmdb.PoolAttributes;
    private service!: dmdb.Connection;
    private isReady = false;
    constructor(connect: dmdb.PoolAttributes, option: DmServerOption) {
        this.isReady = false;

        const { modelName, createdAt, updatedAt, timezone, logger } = option;

        ORM_DMDB_SETTING.modelName = modelName;
        if (createdAt) {
            ORM_DMDB_SETTING.createdAt = typeof createdAt === 'string' ? createdAt : 'createdAt';
        }
        if (updatedAt) {
            ORM_DMDB_SETTING.updatedAt = typeof updatedAt === 'string' ? updatedAt : 'updatedAt';
        }
        if (timezone) {
            ORM_DMDB_SETTING.timezone = timezone;
        }
        if (typeof logger !== 'undefined') {
            ORM_DMDB_SETTING.logger = logger;
        }

        this.dmdbConnectionParams = connect;
    }

    public async connect() {
        const pool = await dmdb.createPool(this.dmdbConnectionParams);

        this.service = await pool.getConnection();
        const testSql = 'SELECT 1+1 AS result';

        if (ORM_DMDB_SETTING.logger) {
            if (typeof ORM_DMDB_SETTING.logger === 'boolean') {
                // eslint-disable-next-line no-console
                console.debug(`dmdb execute sql: ${testSql}`);
            } else {
                ORM_DMDB_SETTING.logger(testSql);
            }
        }
        const test = await this.service.execute(testSql, [], { outFormat: dmdb.OUT_FORMAT_OBJECT });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (test.rows[0].RESULT === 2) {
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
