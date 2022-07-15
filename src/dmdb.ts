import dmdb, { Connection, PoolAttributes } from 'dmdb';

export default class DMServer {
    private service!: Connection;
    private isReady = false;
    constructor(option: PoolAttributes) {
        this.isReady = false;
        this.init(option);
    }

    private async init(option: PoolAttributes) {
        try {
            const pool = await dmdb.createPool(option);

            this.service = await pool.getConnection();
            this.isReady = true;
        } catch (error) {
            throw error;
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
};
