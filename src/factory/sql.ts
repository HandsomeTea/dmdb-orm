import { QueryOption, UpdateOption } from '../type';
import util from './base';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Model = Record<string, any>;

class SQL {
    constructor() {
        //
    }

    private getQueryOption(query: QueryOption<Model>): string {
        const { where, order, offset = 0, limit } = query;

        const orArr: Array<string> = [];
        const andArr: Array<string> = [];

        if (where) {
            const { $or } = where;

            if ($or) {
                for (let s = 0; s < $or.length; s++) {
                    orArr.push(...util.where($or[s]));
                }
            }
            const _where = { ...where };

            delete _where.$or;
            andArr.push(...util.where(_where));
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
        return `delete from ${tableName} ${this.getQueryOption(query)};`;
    }

    public getUpdateSql(query: Pick<QueryOption<Model>, 'where'>, update: UpdateOption<Model>, option: { tableName: string, updatedAt?: string }): string {
        if (option.updatedAt) {
            update[option.updatedAt] = new Date();
        }
        return `update ${option.tableName} set ${util.update(update)} ${this.getQueryOption(query)};`;
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
        // const name = tableName.split('.');
        // const tbName = name.length > 1 ? `${tableName} as ${name[1]}` : tableName;

        return `select ${fields} from ${tableName} ${this.getQueryOption(query)};`;
    }

    public getPageSql(query: QueryOption<Model>, option: { skip: number, limit: number, tableName: string }, projection: Array<keyof Model>): string {
        const fields = projection.map(a => `"${a}"`).join(', ');
        // const name = option.tableName.split('.');
        // const tbName = name.length > 1 ? `${option.tableName} as ${name[1]}` : option.tableName;

        return `select ${fields} from ${option.tableName} ${this.getQueryOption(query)} limit ${option.skip}, ${option.limit};`;
    }

    public getCountSql(query: QueryOption<Model>, tableName: string): string {
        // const name = tableName.split('.');
        // const tbName = name.length > 1 ? `${tableName} as ${name[1]}` : tableName;

        return `select count(*) as count from ${tableName} ${this.getQueryOption(query)};`;
    }
}

export default new SQL();
