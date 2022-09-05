// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OBJECT = Record<string, any>;

export const DmType = {
    // date
    DATE: 'DATE',

    // number
    INTEGER: 'INTEGER',
    INT: 'INT',
    BIGINT: 'BIGINT',
    TINYINT: 'TINYINT',
    BYTE: 'BYTE',
    SMALLINT: 'SMALLINT',

    // string
    STRING: 'VARCHAR(255)',
    CHAR: (len: number) => `CHAR(${len})`,
    CHARACTER: (len: number) => `CHARACTER(${len})`,
    VARCHAR: (len: number) => `VARCHAR(${len})`,
    VARCHAR2: (len: number) => `VARCHAR2(${len})`
} as const;

export type DmdbDataType = typeof DmType;

export interface SQLOption<M, P extends keyof M = keyof M> {
    $ne?: M[P]
    $in?: Array<M[P]>
    $notIn?: Array<M[P]>
    $like?: string
    $regexp?: string | RegExp
    $between?: [M[P], M[P]]
    $gt?: M[P]
    $lt?: M[P]
    $gte?: M[P]
    $lte?: M[P]
    // useFn?: { value: M[P], fn: DMFnType, useForCol?: boolean | DMFnType }
    useFn?: { value: M[P], fn: string, useForCol?: boolean | string }
}

export type WhereOption<M> = {
    [P in keyof M]?: M[P] | SQLOption<M, P>
}

type OneOf<T, P extends keyof T = keyof T> = { [K in P]-?: Required<Pick<T, K>> & Partial<Record<Exclude<P, K>, never>>; }[P];

export interface QueryOption<M> {
    where?: WhereOption<M> & { $or?: Array<WhereOption<M>> }
    /** 数组每项应为一对键值对，如：[{ id: 'asc' }] */
    order?: Array<OneOf<Record<keyof M, 'asc' | 'desc'>>>
    limit?: number
    offset?: number
}

// export type UpsertOption<M> = { [P in keyof M]?: M[P] }
export type UpdateOption<M> = {
    [P in keyof M]?: M[P] extends string ? (string | { $pull: M[P], $split: ',' }) : M[P]
}

export interface DmModelOption {
    modelName?: string
    tenantId?: string | (() => string),
    createdAt?: string | boolean
    updatedAt?: string | boolean
}

export interface DmModelConfig<M extends OBJECT, K extends keyof M> {
    type: DmdbDataType[keyof DmdbDataType]
    set?: (a: unknown) => M[K],
    defaultValue?: M[K] | (() => M[K])
}

export type DmModel<M extends OBJECT> = {
    [K in keyof M]: DmModelConfig<M, K>
}
