import { ORM_DMDB_SETTING } from '../dmdb';
import { OBJECT, WhereAttributes, UpdateOption, WhereOption } from '../type';
import { typeIs } from '../utils';


export default new class UtilFactory {
    public getSqlValue(value: string | number | boolean | undefined | null | Date): string {
        const type = typeIs(value);

        if (!new Set(['string', 'number', 'bigint', 'boolean', 'undefined', 'date', 'null']).has(type)) {
            throw new Error(`暂不支持该数据类型: ${type}`);
        }

        if (type === 'string') {
            return `'${value}'`;
        } else if (type === 'number' || type === 'bigint') {
            return `${value}`;
        } else if (type === 'boolean') {
            return `${value === true ? 1 : 0}`;
        } else if (type === 'undefined' || type === 'null') {
            return 'null';
        } else if (type === 'date') {
            let date = '';

            if (ORM_DMDB_SETTING.timezone === 'local') {
                date = (value as Date).toLocaleString(undefined, { hour12: false }).replace(/\//g, '-');
            } else {
                const str = (value as Date).toISOString();

                date = `${str.substring(0, 10)} ${str.substring(11, 19)}`;
            }
            return `to_date('${date}','yyyy-mm-dd hh24:mi:ss')`;
        } else {
            return '';
        }
    }

    public where(where: WhereOption<OBJECT>, tableAlias: string): Array<string> {
        const arr: Array<string> = [];
        const isVal = new Set(['null']);

        for (const key in where) {
            const option = where[key];
            const sqlKey = `${tableAlias}."${key}"`;

            if (typeIs(option) === 'object') {
                const { $ne, $in, $notIn, $like, $notLike, $regexp,
                    $between, $notBetween, $gt, $gte, $lt, $lte } = option as WhereAttributes<OBJECT>;

                if (typeof $ne !== 'undefined') {
                    const value = this.getSqlValue($ne);

                    arr.push(isVal.has(value) ? `${sqlKey} is not ${value}` : `${sqlKey} != ${value}`);
                }

                if ($in) {
                    const _in = $in.map(a => this.getSqlValue(a));

                    arr.push(`${sqlKey} in (${_in.join(', ')})`);
                }

                if ($notIn) {
                    const _notIn = $notIn.map(a => this.getSqlValue(a));

                    arr.push(`${sqlKey} not in (${_notIn.join(', ')})`);
                }

                if (typeof $like !== 'undefined') {
                    arr.push(`${sqlKey} like '%${$like}%'`);
                }

                if (typeof $notLike !== 'undefined') {
                    arr.push(`${sqlKey} not like '%${$notLike}%'`);
                }

                if ($regexp) {
                    let regStr = new RegExp($regexp, '').toString();

                    regStr = regStr.substring(1, regStr.length - 1);
                    arr.push(`REGEXP_LIKE(${sqlKey}, '${regStr}', 'i')`);
                }

                if ($between) {
                    arr.push(`${sqlKey} between ${this.getSqlValue($between[0])} and ${this.getSqlValue($between[1])}`);
                }

                if ($notBetween) {
                    arr.push(`${sqlKey} not between ${this.getSqlValue($notBetween[0])} and ${this.getSqlValue($notBetween[1])}`);
                }

                if (typeof $gt !== 'undefined') {
                    arr.push(`${sqlKey} > ${this.getSqlValue($gt)}`);
                }

                if (typeof $gte !== 'undefined') {
                    arr.push(`${sqlKey} >= ${this.getSqlValue($gte)}`);
                }

                if (typeof $lt !== 'undefined') {
                    arr.push(`${sqlKey} > ${this.getSqlValue($lt)}`);
                }

                if (typeof $lte !== 'undefined') {
                    arr.push(`${sqlKey} >= ${this.getSqlValue($lte)}`);
                }
            } else if (typeIs(option) === 'function') {
                const funRes = option(sqlKey) as string;

                if (funRes) {
                    arr.push(funRes);
                }
            } else {
                const value = this.getSqlValue(option);

                arr.push(isVal.has(value) ? `${sqlKey} is ${value}` : `${sqlKey} = ${value}`);
            }
        }
        return arr;
    }

    public update(update: UpdateOption<OBJECT>, tableAlias: string): string {
        const arr: Array<string> = [];

        for (const key in update) {
            arr.push(`${tableAlias}."${key}" = ${this.getSqlValue(update[key])}`);
        }
        return arr.join(', ');
    }
};
