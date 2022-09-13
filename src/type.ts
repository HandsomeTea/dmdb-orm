import { DmdbDataType } from './data-type';

export type OBJECT = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface WhereAttributes<M, P extends keyof M = keyof M> {
    $ne?: M[P]
    $in?: Array<M[P]>
    $notIn?: Array<M[P]>
    $like?: string
    $notLike?: string
    $regexp?: string | RegExp
    $between?: [number, number] | [Date, Date]
    $notBetween?: [number, number] | [Date, Date]
    $gt?: number | Date
    $gte?: number | Date
    $lt?: number | Date
    $lte?: number | Date
}

type FunctionWhere = (fieldName: string) => string

export type WhereOption<M> = {
    [P in keyof M]?: M[P] | WhereAttributes<M> | FunctionWhere
}

type OneOf<T, P extends keyof T = keyof T> = { [K in P]-?: Required<Pick<T, K>> & Partial<Record<Exclude<P, K>, never>>; }[P];

export type ProjectionType<M> =
    Array<keyof M> |
    {
        exclude?: Array<keyof M>
        include?: Array<keyof M>
    }

export interface QueryOption<M> {
    where?: WhereOption<M> & { $or?: Array<WhereOption<M>> }
    /** 数组每项应为一对键值对，如：[{ id: 'asc' }] */
    order?: Array<OneOf<Record<keyof M, 'asc' | 'desc'>>>
    limit?: number
    offset?: number
}

export type ComputeFn = 'min' | 'max' | 'avg' | 'median' | 'sum' | 'count'

export type ComputeOption<M> = {
    [P in keyof M]?: { fn: ComputeFn, distinct?: boolean }
}

export type UpdateOption<M> = {
    [P in keyof M]?: M[P]
}

export interface DmModelOption {
    /** table所在的模式，会覆盖全局modelName的设置 */
    modelName?: string
    tenantId?: string | (() => string)
    createdAt?: string | boolean
    updatedAt?: string | boolean
}

export interface DmModelAttributes<M extends OBJECT, K extends keyof M = keyof M> {
    type: DmdbDataType
    primaryKey?: boolean
    allowNull?: boolean
    comment?: string
    unique?: boolean
    autoIncrement?: boolean
    set?: (a: unknown) => M[K]
    /** 默认值并不会放在创建表的时候定义字段的sql语句中，而是在存数据或者更新数据的时候，如果数据为空值，则取defaultValue给定的值 */
    defaultValue?: M[K] | (() => M[K])
}

export type DmModel<M extends OBJECT> = {
    [K in keyof M]: DmModelAttributes<M>
}
