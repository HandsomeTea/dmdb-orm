import dmdb from 'dmdb';

import { typeIs } from './utils';
import SQL from './factory/sql';
import { DmModel, QueryOption, UpdateOption, DmType, OBJECT, DmModelOption } from './type';
import { ORM_DMDB_SERVER, ORM_DMDB_SETTING } from './dmdb';

export class Model<TB extends OBJECT> {
    /** 初始化传入的表名 */
    private tName: string;
    private modelName: string;
    private tenantId: string | (() => string) | undefined;
    private timestamp: {
        createdAt?: string
        updatedAt?: string
    };
    private tableModel: DmModel<TB>;

    constructor(tableName: string, struct: DmModel<TB>, option?: DmModelOption) {
        this.tName = tableName;
        this.modelName = ORM_DMDB_SETTING.modelName;
        this.timestamp = {};

        if (ORM_DMDB_SETTING.createdAt) {
            this.timestamp.createdAt = ORM_DMDB_SETTING.createdAt;
        }

        if (ORM_DMDB_SETTING.updatedAt) {
            this.timestamp.updatedAt = ORM_DMDB_SETTING.updatedAt;
        }

        if (option) {
            const { tenantId, modelName, createdAt, updatedAt } = option;

            if (tenantId) {
                this.tenantId = tenantId;
            }

            if (modelName) {
                this.modelName = modelName;
            }

            if (createdAt) {
                this.timestamp.createdAt = typeof createdAt === 'string' ? createdAt : 'createdAt';
            }
            if (updatedAt) {
                this.timestamp.updatedAt = typeof updatedAt === 'string' ? updatedAt : 'updatedAt';
            }
        }

        this.tableModel = {
            ...struct,
            ...this.timestamp.createdAt ? { [this.timestamp.createdAt]: { type: DmType.DATE } } : {},
            ...this.timestamp.updatedAt ? { [this.timestamp.updatedAt]: { type: DmType.DATE } } : {}
        };
    }

    /** 如果表不存在，会创建表 */
    public async sync() {
        const commentInfo: Record<string, string> = {};
        const sql = `CREATE TABLE IF NOT EXISTS ${this.tableName} (` +
            Object.keys(this.model).map(a => {
                const { allowNull, type, comment } = this.model[a];

                if (comment) {
                    commentInfo[a] = comment;
                }

                return `"${a}" ${type === DmType.BOOLEAN ? DmType.BIT : type} ${allowNull === false ? 'NOT NULL' : ''}`;
            }).join(',') +
            ') STORAGE(ON "MAIN", CLUSTERBTR);';

        await this.execute(sql);
        const commentKey = Object.keys(commentInfo);

        if (commentKey.length > 0) {
            for (let s = 0; s < commentKey.length; s++) {
                await this.execute(`COMMENT ON COLUMN ${this.tableName}."${commentKey[s]}" IS '${commentInfo[commentKey[s]]}';`);
            }
        }
    }

    public get model() {
        return this.tableModel;
    }

    /** 最终所得的表名 */
    private get tableName(): `"${string}"."${string}"` {
        let tId: string | null = null;

        if (this.tenantId) {
            if (typeof this.tenantId === 'string') {
                tId = this.tenantId;
            } else {
                tId = this.tenantId();
            }
        }
        let name = this.tName;

        if (tId) {
            name = `${tId}_${name}`;
        }

        return `"${this.modelName}"."${name}"`;
    }

    /** table名称 */
    public get table() {
        return this.tableName.replace(/"/g, '');
    }

    // db connection
    public get db() {
        return ORM_DMDB_SERVER;
    }

    private logSql(sql: string) {
        if (ORM_DMDB_SETTING.logger) {
            if (typeof ORM_DMDB_SETTING.logger === 'boolean') {
                // eslint-disable-next-line no-console
                console.debug(`dmdb execute sql: ${sql}`);
            } else {
                ORM_DMDB_SETTING.logger(sql);
            }
        }
    }

    private async execute(sql: string) {
        if (!ORM_DMDB_SERVER) {
            return [];
        }

        this.logSql(sql);
        const result = await ORM_DMDB_SERVER.execute(sql, [], { outFormat: dmdb.OUT_FORMAT_OBJECT });

        return result.rows || [];
    }

    private async executeMany(sql: string | Array<string>) {
        if (!ORM_DMDB_SERVER) {
            return;
        }
        const _sql = typeof sql === 'string' ? sql : sql.join('');

        this.logSql(_sql);
        return await ORM_DMDB_SERVER.executeMany(_sql, 1);
    }

    private dataFormat(dbData: Record<string, unknown>, projection: Array<keyof TB>): TB {
        const struct = { ...this.tableModel };
        const data: { [P in keyof TB]?: TB[P] } = {};

        for (const key of projection) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (typeof dbData[key] === 'undefined') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                data[key] = null;
                continue;
            }
            const { type } = struct[key];

            if (type === DmType.BOOLEAN) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                data[key] = dbData[key] === 1 ? true : false;
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                data[key] = dbData[key];
            }
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return data;
    }

    private formatInsertData(data: TB): TB {
        const struct = { ...this.tableModel };
        const _data: { [P in keyof TB]?: TB[P] } = {};

        for (const key in struct) {
            const { set, defaultValue, type } = struct[key];

            if (typeof set !== 'undefined' || typeof defaultValue !== 'undefined') {
                if (typeof defaultValue !== 'undefined' && typeof data[key] === 'undefined') {
                    if (typeof defaultValue !== 'function') {
                        _data[key] = defaultValue;
                    } else {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        _data[key] = defaultValue();
                    }
                }
                if (set && (data[key] || _data[key])) {
                    _data[key] = set(data[key] || _data[key]);
                }
            }
            if (typeof _data[key] === 'undefined' && typeof data[key] !== 'undefined') {
                _data[key] = data[key];
            }
            if (type === DmType.BOOLEAN) {
                if (data[key] === true) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    _data[key] = 1;
                } else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    _data[key] = 0;
                }
            }
        }
        const time = new Date();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return {
            ..._data,
            ...this.timestamp.createdAt ? { [this.timestamp.createdAt]: time } : {},
            ...this.timestamp.updatedAt ? { [this.timestamp.updatedAt]: time } : {}
        };
    }

    /** delete table */
    public async drop(): Promise<void> {
        await this.execute(`drop table ${this.tableName};`);
    }

    public async save(data: TB): Promise<void> {
        const sql = SQL.getInsertSql(this.formatInsertData(data), { tableName: this.tableName, ...this.timestamp });

        await this.execute(sql);
    }

    public async saveMany(data: Array<TB>): Promise<void> {
        let sql = '';

        for (let s = 0; s < data.length; s++) {
            sql += SQL.getInsertSql(this.formatInsertData(data[s]), { tableName: this.tableName, ...this.timestamp });
        }
        await this.executeMany(sql);
    }

    public async delete(query: Pick<QueryOption<TB>, 'where'>): Promise<void> {
        const sql = SQL.getDeleteSql(query, this.tableName);

        await this.execute(sql);
    }

    public async update(query: Pick<QueryOption<TB>, 'where'>, update: UpdateOption<TB>): Promise<void> {
        const struct = { ...this.tableModel };
        const _update: { [P in keyof TB]?: TB[P] } = {};

        for (const key in update) {
            const { set, allowNull, type } = struct[key];

            if (allowNull === false && new Set(['null', 'undefined']).has(typeof update[key])) {
                throw Error(`${this.table}.${key} is not allowned null`);
            }

            if (set) {
                if (!typeIs(update[key], 'object')) {
                    _update[key] = set(update[key]);

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                } else if (update[key].$pull) { // 提示：$pull一定是对字符串的操作

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    _update[key] = { ...update[key], $pull: set(update[key].$pull) };
                }
            } else if (type === DmType.BOOLEAN) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                _update[key] = update[key] === true ? 1 : 0;
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                _update[key] = update[key];
            }
        }
        if (Object.keys(_update).length === 0) {
            return;
        }
        const sql = SQL.getUpdateSql(query, _update, { tableName: this.tableName, ...this.timestamp });

        await this.execute(sql);
    }

    public async upsert(uniqueQuery: Pick<QueryOption<TB>, 'where'>, update: UpdateOption<TB>, insert: TB): Promise<void> {
        const data = await this.findOne(uniqueQuery);

        if (data) {
            await this.update(uniqueQuery, update);
        } else {
            await this.save(insert);
        }
    }

    public async find(): Promise<Array<TB>>
    public async find(query: QueryOption<TB>): Promise<Array<TB>>
    public async find<K extends keyof TB>(query: QueryOption<TB>, projection: Array<K>): Promise<Array<{ [F in K]: TB[F] }>>

    public async find(query?: QueryOption<TB>, projection?: Array<keyof TB>): Promise<Array<TB>> {
        const fields = (projection || Object.keys(this.tableModel)) as Array<string>;
        const sql = SQL.getSelectSql(query || {}, this.tableName, fields);

        return (await this.execute(sql)).map((a: unknown) => this.dataFormat(a as Record<string, unknown>, fields as Array<keyof TB>)) || [];
    }

    public async findOne(query: QueryOption<TB>): Promise<TB | null>
    public async findOne<K extends keyof TB>(query: QueryOption<TB>, projection: Array<K>): Promise<{ [F in K]: TB[F] } | null>

    public async findOne(query: QueryOption<TB>, projection?: Array<keyof TB>): Promise<TB | null> {
        const fields = (projection || Object.keys(this.tableModel)) as Array<keyof TB>;

        return (await this.find({ ...query, offset: 0, limit: 1 }, fields))[0] || null;
    }

    public async paging(query: QueryOption<TB>, option: { skip: number, limit: number }): Promise<{ list: Array<TB>, total: number }>
    public async paging<K extends keyof TB>(query: QueryOption<TB>, option: { skip: number, limit: number }, projection: Array<K>): Promise<{ list: Array<{ [F in K]: TB[F] }>, total: number }>

    public async paging(query: QueryOption<TB>, option: { skip: number, limit: number }, projection?: Array<keyof TB>): Promise<{ list: Array<TB>, total: number }> {
        const fields = (projection || Object.keys(this.tableModel)) as Array<string>;
        const sql = SQL.getPageSql(query, { ...option, tableName: this.tableName }, fields);

        return {
            list: (await this.execute(sql)).map((a: unknown) => this.dataFormat(a as Record<string, unknown>, fields as Array<keyof TB>)) || [],
            total: await this.count(query)
        };
    }

    public async count(query?: QueryOption<TB>): Promise<number> {
        const data = await this.execute(SQL.getCountSql(query || {}, this.tableName)) as Array<Record<string, number>>;

        return Number(Object.values(data[0])[0]);
    }
}
