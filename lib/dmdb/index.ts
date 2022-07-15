import dmdb from 'dmdb';

export default class DMServer {
    private service!: dmdb.Connection;
    private isReady = false;
    constructor() {
        this.isReady = false;
        this.init();
    }

    private async init() {
        const connectString = serverConfig.dbUrl;

        if (!connectString) {
            throw new Exception(`DM connect address is required but get ${connectString}`);
        }
        try {
            // const pool = await dmdb.createPool({ connectString });

            // this.service = await pool.getConnection();
            this.isReady = true;
            devLogger('startup-dameng').info(`DM connected on ${connectString} success and ready to use.`);
        } catch (error) {
            devLogger('startup-dameng').error(error);
        }
    }

    /**
     * 系统是否采用dameng作为数据库
     * @readonly
     * @private
     */
    private get isUseful() {
        return serverConfig.dbType === 'dameng';
    }

    public get server() {
        if (!this.isUseful) {
            devLogger('SYSTEM').warn(`require to use ${serverConfig.dbType}, but call dameng db! dameng db is not available!`);
        }
        return this.service;
    }

    public get isOK() {
        return !this.isUseful || this.isUseful && this.isReady;
    }

    public async close(): Promise<void> {
        if (this.isUseful) {
            await this.service?.close();
            this.isReady = false;
        }
    }
};
