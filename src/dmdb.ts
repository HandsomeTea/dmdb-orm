// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dmdb, { Connection, PoolAttributes } from 'dmdb';

export interface DmdbCustomSetting {
    modelName: string
    createdAt?: string
    updatedAt?: string
    /** 时区取值，default: iso。
     * iso: 将使用new Date().toISOString()取值并使用sql函数to_date存库
     * local: 将使用new Date().toLocaleString()取值并使用sql函数to_date存库
     */
    timezone?: 'iso' | 'local'
}

// eslint-disable-next-line no-var
export var ORM_DMDB_SERVER: Connection | null = null;
// eslint-disable-next-line no-var
export var ORM_DMDB_SETTING: DmdbCustomSetting = { timezone: 'iso', modelName: '' };


export class DMServer {
    private service!: Connection;
    private isReady = false;
    constructor(option: PoolAttributes & DmdbCustomSetting & { createdAt?: string | boolean, updatedAt?: string | boolean }) {
        this.isReady = false;

        const { modelName, createdAt, updatedAt, timezone } = option;

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

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete option.modelName;
        delete option.createdAt;
        delete option.updatedAt;
        delete option.timezone;
        this.init(option);
    }

    private async init(option: PoolAttributes) {
        const pool = await dmdb.createPool(option);

        this.service = await pool.getConnection();
        ORM_DMDB_SERVER = this.service;
        this.isReady = true;
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
