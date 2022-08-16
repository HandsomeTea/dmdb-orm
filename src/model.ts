// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dmdb from 'dmdb';

import Sql from './sql';

import { DmModel, QueryOption, UpdateOption } from './type';
import { typeIs } from './utils';
import { ORM_DMDB_SERVER, ORM_DMDB_SETTING } from './dmdb';

const SQL = new Sql();

export const DmType: { DATE: 'DATE', NUMBER: 'NUMBER', STRING: 'STRING' } = {
    DATE: 'DATE',
    NUMBER: 'NUMBER',
    STRING: 'STRING'
};

export class Model<TB>{
    /** 初始化传入的表名 */
    private tName: string;
    /** 在dmdb属于哪个模式 */
    private modelName: string;
    private tenantId: string | (() => string) | undefined;
    private timestamp: {
        createdAt?: string
        updatedAt?: string
    };
    private tableModel: DmModel<TB>;

    constructor(
        tableName: string,
        struct: DmModel<TB>,
        option?: {
            modelName?: string
            tenantId?: string | (() => string),
            createdAt?: string | boolean
            updatedAt?: string | boolean
        }
    ) {
        this.tName = tableName;
        this.modelName = ORM_DMDB_SETTING.modelName;
        this.timestamp = {};

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
            ...this.timestamp.createdAt ? { [this.timestamp.createdAt]: { type: DmType.DATE } } :
                ORM_DMDB_SETTING.createdAt ? { [ORM_DMDB_SETTING.createdAt]: { type: DmType.DATE } } : {},
            ...this.timestamp.updatedAt ? { [this.timestamp.updatedAt]: { type: DmType.DATE } } :
                ORM_DMDB_SETTING.updatedAt ? { [ORM_DMDB_SETTING.updatedAt]: { type: DmType.DATE } } : {}
        };
    }

    public get model() {
        return this.tableModel;
    }

    /** 最终所得的表名 */
    private get tableName() {
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

    private async exec(sql: string) {
        return this.execute(sql, [], { outFormat: dmdb.OUT_FORMAT_OBJECT });
    }

    public async execute(sql: string, bindParams: dmdb.BindParameters, options: dmdb.ExecuteOptions) {
        if (!ORM_DMDB_SERVER) {
            return;
        }
        if (ORM_DMDB_SETTING.logger) {
            const str = Object.keys(bindParams).length > 0 ? JSON.stringify({ sql, bindParams }, null, '   ') : sql;

            if (typeof ORM_DMDB_SETTING.logger === 'boolean') {
                // eslint-disable-next-line no-console
                console.debug(`dmdb execute sql: ${str}`);
            } else {
                ORM_DMDB_SETTING.logger(str);
            }
        }
        return await ORM_DMDB_SERVER.execute(sql, bindParams, options);
    }

    private dataFormat(dbData: Record<string, unknown>, projection: Array<keyof TB>): TB {
        const struct = { ...this.tableModel };
        const data: { [P in keyof TB]?: TB[P] } = {};

        for (const key in projection) {
            if (typeof dbData[key] !== 'undefined') {
                // const { type } = struct[key];

                data[key] = dbData[key];

                if (struct[key].type === 'STRING') {
                    data[key] = `${data[key]}`.trim();
                }
            } else {
                data[key] = null;
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
            const { set, defaultValue } = struct[key];

            if (set || defaultValue) {
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
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return _data;
    }

    public async save(data: TB): Promise<void> {
        const sql = SQL.getInsertSql(this.formatInsertData(data), { tableName: this.tableName, ...this.timestamp });

        await this.exec(sql);
    }

    public async saveMany(data: Array<TB>): Promise<void> {
        let sql = '';

        for (let s = 0; s < data.length; s++) {
            sql += SQL.getInsertSql(this.formatInsertData(data[s]), { tableName: this.tableName, ...this.timestamp });
        }
        await this.exec(sql);
    }

    public async delete(query: Pick<QueryOption<TB>, 'where'>): Promise<void> {
        const sql = SQL.getDeleteSql(query, this.tableName);

        await this.exec(sql);
    }

    public async update(query: Pick<QueryOption<TB>, 'where'>, update: UpdateOption<TB>): Promise<void> {
        const struct = { ...this.tableModel };
        const _update: { [P in keyof TB]?: TB[P] } = {};

        for (const key in update) {
            const { set } = struct[key];

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
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                _update[key] = update[key];
            }
        }
        const sql = SQL.getUpdateSql(query, _update, { tableName: this.tableName, ...this.timestamp });

        await this.exec(sql);
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

        return (await this.exec(sql))?.rows?.map((a: unknown) => this.dataFormat(a as Record<string, unknown>, fields as Array<keyof TB>)) as Array<TB>;
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
            list: (await this.exec(sql))?.rows?.map((a: unknown) => this.dataFormat(a as Record<string, unknown>, fields as Array<keyof TB>)) as Array<TB>,
            total: await this.count(query)
        };
    }

    public async count(query: QueryOption<TB>): Promise<number> {
        const data = (await this.exec(SQL.getCountSql(query, this.tableName)))?.rows as Array<Record<string, number>>;

        return Number(Object.values(data[0])[0]);
    }
}
