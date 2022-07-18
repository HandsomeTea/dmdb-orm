import { PoolAttributes, BindParameters, ExecuteOptions, OUT_FORMAT_OBJECT } from 'dmdb';

import DM from './dmdb';
import SQL from './sql';

import { DmModel, QueryOption, UpdateOption } from './types';
import { typeIs } from '../utils';

const DM_DB_Model: Record<string, DmModel<Record<string, unknown>>> = {};


export default class DMBase<TB> extends DM {
    private dbName: string;
    private globalTimestamp: {
        createdAt?: string
        updatedAt?: string
    };

    constructor(connect: PoolAttributes, option: { modelName: string, createdAt?: string | boolean, updatedAt?: string | boolean }) {
        super(connect);
        const { modelName, createdAt, updatedAt } = option;

        this.dbName = modelName;
        if (createdAt) {
            this.globalTimestamp.createdAt = typeof createdAt === 'string' ? createdAt : 'createdAt';
        }
        if (updatedAt) {
            this.globalTimestamp.updatedAt = typeof updatedAt === 'string' ? updatedAt : 'updatedAt';
        }
    }

    public get DmType() {
        const DmType: { DATE: 'DATE', NUMBER: 'NUMBER', STRING: 'STRING' } = {
            DATE: 'DATE',
            NUMBER: 'NUMBER',
            STRING: 'STRING'
        };

        return DmType;
    }

    public createModel(
        tableName: string,
        struct: DmModel<TB>,
        option?: {
            tenantId?: string,
            createdAt?: string | boolean
            updatedAt?: string | boolean
        }
    ) {
        let tbName = tableName;
        const timestamp = {
            ...this.globalTimestamp
        };

        if (option) {
            const { tenantId, createdAt, updatedAt } = option;

            if (tenantId) {
                tbName = `${tenantId}_${tableName}`;
            }

            if (createdAt) {
                timestamp.createdAt = typeof createdAt === 'string' ? createdAt : 'createdAt';
            }
            if (updatedAt) {
                timestamp.updatedAt = typeof updatedAt === 'string' ? updatedAt : 'updatedAt';
            }
        }
        tbName = `"${this.dbName}"."${tableName}"`;

        DM_DB_Model[tbName] = {
            ...struct,
            ...timestamp.createdAt ? { [timestamp.createdAt]: { type: this.DmType.DATE } } : {},
            ...timestamp.updatedAt ? { [timestamp.updatedAt]: { type: this.DmType.DATE } } : {}
        };
    }

    public async execute(sql: string, bindParams: BindParameters, options: ExecuteOptions) {
        console.debug(sql);
        return await this.server.execute(sql, bindParams, options);
    }

    private async exec(sql: string) {
        return await this.execute(sql, [], { outFormat: OUT_FORMAT_OBJECT });
    }

    private dataFormat(dbData: Record<string, unknown>): TB {
        const struct = DM_DB_Model[this.tableName] as DmModel<TB>;
        const data: { [P in keyof TB]?: TB[P] } = {};

        for (const key in struct) {
            if (typeof dbData[key] !== 'undefined') {
                // const { type } = struct[key];

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                data[key] = dbData[key];

                if (struct[key].type === 'STRING') {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    data[key] = `${data[key]}`.trim();
                }
            }
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return data;
    }

    private formatInsertData(data: TB): TB {
        const struct = DM_DB_Model[this.tableName] as DmModel<TB>;
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

    public async insert(data: TB): Promise<void> {
        const sql = SQL.getInsertSql(this.formatInsertData(data), { tableName: this.tableName, ...this.timestamp });

        await this.exec(sql);
    }

    public async insertMany(data: Array<TB>): Promise<void> {
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
        const struct = DM_DB_Model[this.tableName] as DmModel<TB>;
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
            await this.insert(insert);
        }
    }

    public async find(query?: QueryOption<TB>, projection?: Array<keyof TB>): Promise<Array<TB>> {
        const sql = SQL.getSelectSql(query || {}, this.tableName, projection as Array<string> || Object.keys(DM_DB_Model[this.tableName]));

        return (await this.exec(sql))?.rows?.map((a: unknown) => this.dataFormat(a as Record<string, unknown>)) as Array<TB>;
    }

    public async findOne(query: QueryOption<TB>, projection?: Array<keyof TB>): Promise<TB | null> {
        return (await this.find(query, projection))[0] || null;
    }

    public async paging(query: QueryOption<TB>, option: { skip: number, limit: number }, projection?: Array<keyof TB>): Promise<{ list: Array<TB>, total: number }> {
        const sql = SQL.getPageSql(query, { ...option, tableName: this.tableName }, projection as Array<string> || Object.keys(DM_DB_Model[this.tableName]));

        return {
            list: (await this.exec(sql))?.rows?.map((a: unknown) => this.dataFormat(a as Record<string, unknown>)) as Array<TB>,
            total: await this.count(query)
        };
    }

    public async count(query: QueryOption<TB>): Promise<number> {
        const data = (await this.exec(SQL.getCountSql(query, this.tableName)))?.rows as Array<Record<string, number>>;

        return Number(Object.values(data[0])[0]);
    }
}
