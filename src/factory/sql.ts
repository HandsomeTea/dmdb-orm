import { QueryOption, UpdateOption } from '../type';
import util from './base';

type Model = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

class SQL {
    constructor() {
        //
    }

    private getQueryOption(query: QueryOption<Model>, tableAlias: string): string {
        const { where, order, offset = 0, limit } = query;

        const orArr: Array<string> = [];
        const andArr: Array<string> = [];

        if (where) {
            const { $or } = where;

            if ($or) {
                for (let s = 0; s < $or.length; s++) {
                    orArr.push(...util.where($or[s], tableAlias));
                }
            }
            const _where = { ...where };

            delete _where.$or;
            andArr.push(...util.where(_where, tableAlias));
        }

        const orderArr: Array<string> = [];

        if (order) {
            for (let s = 0; s < order.length; s++) {
                if (Object.keys(order[s]).length > 0) {
                    orderArr.push(`${Object.keys(order[s])[0]} ${Object.values(order[s])[0]}`);
                }
            }
        }

        let str = '';
        const queryArr: Array<string> = [];

        if (orArr.length > 0) {
            queryArr.push(`(${orArr.join(' or ')})`);
        }

        if (andArr.length > 0) {
            queryArr.push(`(${andArr.join(' and ')})`);
        }

        if (queryArr.length > 0) {
            str = `where ${queryArr.join(' and ')}`;
        }

        if (orderArr.length > 0) {
            if (str) {
                str += ' ';
            }
            str += `order by ${orderArr.join(', ')}`;
        }

        if (typeof offset !== 'undefined' && typeof limit !== 'undefined') {
            if (str) {
                str += ' ';
            }
            str += `limit ${offset}, ${limit}`;
        }
        return str;
    }

    private getAliasTableName(tableName: string) {
        return `"${tableName.replace(/"/g, '').replace('.', '_')}"`;
    }

    public getInsertSql(data: Model, option: { tableName: string, createdAt?: string, updatedAt?: string }): string {
        if (option.createdAt) {
            data[option.createdAt] = new Date();
        }
        if (option.updatedAt) {
            data[option.updatedAt] = new Date();
        }
        const keyStr = Object.keys(data).map(a => `"${a}"`).join(', ');
        const valueStr = Object.values(data).map(a => {
            return util.getSqlValue(a);
        }).join(', ');

        return `insert into ${option.tableName} (${keyStr}) values (${valueStr});`;
    }

    public getDeleteSql(query: Pick<QueryOption<Model>, 'where'>, tableName: string): string {
        const _tableName = this.getAliasTableName(tableName);

        return `delete from ${tableName} as ${_tableName} ${this.getQueryOption(query, _tableName)};`;
    }

    public getUpdateSql(query: Pick<QueryOption<Model>, 'where'>, update: UpdateOption<Model>, option: { tableName: string, updatedAt?: string }): string {
        if (option.updatedAt) {
            update[option.updatedAt] = new Date();
        }
        const _tableName = this.getAliasTableName(option.tableName);

        return `update ${option.tableName} as ${_tableName} set ${util.update(update, _tableName)} ${this.getQueryOption(query, _tableName)};`;
    }

    // public getUpsertSql(insert: Model, update: UpsertOption<Model>, tableName: string): string {
    //     const keyStr = Object.keys(insert).join(',');
    //     const valueStr = Object.values(insert).map(a => {
    //         return this.getSqlValue(a);
    //     }).join(', ');

    //     return `insert into ${tableName} (${keyStr}) values (${valueStr}) on duplicate key update ${this.getUpdateOption(update)};`;
    // }

    public getSelectSql(query: QueryOption<Model>, tableName: string, projection: Array<keyof Model>): string {
        const fields = projection.map(a => `"${a}"`).join(', ');
        const _tableName = this.getAliasTableName(tableName);

        return `select ${fields} from ${tableName} as ${_tableName} ${this.getQueryOption(query, _tableName)};`;
    }

    public getPageSql(query: QueryOption<Model>, option: { skip: number, limit: number, tableName: string }, projection: Array<keyof Model>): string {
        const fields = projection.map(a => `"${a}"`).join(', ');
        const _tableName = this.getAliasTableName(option.tableName);

        return `select ${fields} from ${option.tableName} as ${_tableName} ${this.getQueryOption(query, _tableName)} limit ${option.skip}, ${option.limit};`;
    }

    public getCountSql(query: QueryOption<Model>, tableName: string): string {
        const _tableName = this.getAliasTableName(tableName);

        return `select count(*) as count from ${tableName} as ${_tableName} ${this.getQueryOption(query, _tableName)};`;
    }
}

export default new SQL();
