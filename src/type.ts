/* eslint-disable @typescript-eslint/no-explicit-any */

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

export interface DmModelOption<M extends Record<string, any>, K extends keyof M> {
    type: 'DATE' | 'NUMBER' | 'STRING'
    set?: (a: unknown) => M[K],
    defaultValue?: M[K] | (() => M[K])
}

export type DmModel<M extends Record<string, any>> = {
    [K in keyof M]: DmModelOption<M, K>
}
