/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORM_DMDB_SETTING } from '../dmdb';
import { OBJECT, SQLOption, UpdateOption, WhereOption } from '../type';
import { typeIs } from '../utils';


export default new class UtilFactory {
    constructor() {
        //
    }

    public getSqlValue(value: string | number | boolean | undefined | null | Date): string {
        const type = typeIs(value);

        if (!new Set(['string', 'number', 'boolean', 'bigint', 'undefined', 'date', 'null']).has(type)) {
            throw new Error(`SQL does not support storage of this data type: ${type}`);
        }

        if (type === 'string') {
            return `'${value}'`;
        } else if (type === 'number' || type === 'boolean' || type === 'bigint') {
            return `${value}`;
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

    public where(where: WhereOption<OBJECT>): Array<string> {
        const arr: Array<string> = [];
        const isVal = new Set(['null', true, false]);

        for (const key in where) {
            const option = where[key];

            if (typeIs(option) === 'object'
                && (typeof option.$between !== 'undefined' ||
                    typeof option.$gt !== 'undefined' ||
                    typeof option.$gte !== 'undefined' ||
                    typeof option.$in !== 'undefined' ||
                    typeof option.$like !== 'undefined' ||
                    typeof option.$lt !== 'undefined' ||
                    typeof option.$lte !== 'undefined' ||
                    typeof option.$ne !== 'undefined' ||
                    typeof option.$notIn !== 'undefined' ||
                    typeof option.$regexp !== 'undefined' ||
                    typeof option.useFn !== 'undefined'
                )) {
                const { $between, $gt, $gte, $in, $like, $lt, $lte, $ne, $notIn, $regexp, useFn } = option as SQLOption<OBJECT>;

                if ($between) {
                    arr.push(`${key} between ${this.getSqlValue($between[0])} and ${this.getSqlValue($between[1])}`);
                }
                if (typeof $gt !== 'undefined') {
                    arr.push(`${key} > ${this.getSqlValue($gt)}`);
                }
                if (typeof $gte !== 'undefined') {
                    arr.push(`${key} >= ${this.getSqlValue($gte)}`);
                }
                if ($in) {
                    const _in = $in.map(a => this.getSqlValue(a));

                    arr.push(`${key} in (${_in.join(', ')})`);
                }
                if ($like) {
                    arr.push(`${key} like '%${$like}%'`);
                }
                if (typeof $lt !== 'undefined') {
                    arr.push(`${key} > ${this.getSqlValue($lt)}`);
                }
                if (typeof $lte !== 'undefined') {
                    arr.push(`${key} >= ${this.getSqlValue($lte)}`);
                }
                if (typeof $ne !== 'undefined') {
                    const value = this.getSqlValue($ne);

                    arr.push(isVal.has(value) ? `${key} is not ${value}` : `${key}!=${value}`);
                }
                if ($notIn) {
                    const _notIn = $notIn.map(a => this.getSqlValue(a));

                    arr.push(`${key} not in (${_notIn.join(', ')})`);
                }
                if ($regexp) {
                    let regStr = new RegExp($regexp as string | RegExp, '').toString();

                    regStr = regStr.substring(1, regStr.length - 1);
                    arr.push(`${key} regexp ${regStr}`);
                }
                if (useFn) {
                    const { useForCol, fn, value } = useFn;

                    if (typeof useForCol === 'string') {
                        arr.push(`${useForCol}(${key}) = ${fn}(${this.getSqlValue(value)})`);
                    } else if (Boolean(useForCol) === true) {
                        arr.push(`${fn}(${key}) = ${fn}(${this.getSqlValue(value)})`);
                    } else {
                        arr.push(`${key} = ${fn}(${this.getSqlValue(value)})`);
                    }
                }
            } else {
                const value = this.getSqlValue(option);

                arr.push(isVal.has(value) ? `${key} is ${value}` : `${key}=${value}`);
            }
        }
        return arr;
    }

    public update(update: UpdateOption<OBJECT>): string {
        if (Object.keys(update).length === 0) {
            throw new Error('one field must be updated at least!');
        }
        const arr: Array<string> = [];

        for (const key in update) {
            const aa = update[key];

            if (aa.$pull && aa.$split) {
                arr.push(`${key}=replace(replace(${key}, '${aa.$pull}${aa.$split}', ''), '${aa.$pull}', '')`);
            } else {
                arr.push(`${key}=${this.getSqlValue(update[key])}`);
            }
        }
        return arr.join(', ');
    }
};
