import {
    BOOLEAN,
    BIT
} from './boolean';
import {
    STRING,
    CHAR,
    CHARACTER,
    VarcharConstructor,
    VARCHAR,
    VARCHAR2,
    TEXT
} from './string';
import {
    INTEGER,
    INT,
    BIGINT,
    TINYINT,
    BYTE,
    SMALLINT,
    NUMBER,
    NUMERIC,
    DECIMAL,
    DEC
} from './number';
import {
    DATE,
    DATETIME,
    TIME,
    TIMESTAMP
} from './date';
import {
    BINARY,
    VARBINARY,
    FLOAT,
    DOUBLE,
    DOUBLE_PRECISION,
    LONG,
    LONGVARCHAR,
    LONGVARBINARY,
    IMAGE,
    BLOB,
    CLOB,
    BFILE
} from './media';
import {
    REAL
} from './binary';

const DmSingleType = {
    /**
     * 布尔数据类型
     * 达梦数据库没有布尔数据类型，BOOLEAN是为方便实用而在orm层设置的一个数据类型，该类型实际为BIT，存在库中为0/1,
     * 实际使用dmdb-orm存入和查询时，model会转化为false/true，无需手动转换.
     * 官方说明参考:
     * https://eco.dameng.com/document/dm/zh-cn/pm/dm_sql-introduction.html#1.4.2%20%E4%BD%8D%E4%B8%B2%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B
     */
    BOOLEAN,
    BIT,
    STRING,
    INTEGER,
    INT,
    BIGINT,
    TINYINT,
    BYTE,
    SMALLINT,
    DATE,
    TEXT,
    LONG,
    LONGVARCHAR,
    LONGVARBINARY,
    IMAGE,
    BLOB,
    CLOB,
    BFILE,
    REAL
};

const DmBothType = {
    DATETIME,
    TIME,
    TIMESTAMP,
    NUMERIC,
    NUMBER,
    DECIMAL,
    DEC,
    BINARY,
    VARBINARY,
    FLOAT,
    DOUBLE,
    DOUBLE_PRECISION,
    CHAR,
    CHARACTER,
    VARCHAR: VARCHAR as VarcharConstructor,
    VARCHAR2
};

for (const key in DmBothType) {
    DmBothType[key] = new Proxy(DmBothType[key], {
        apply(_target, _thisArg, args) {
            return new DmBothType[key](...args);
        }
    });
}

const DmFunType = {

};

export const DmType = {
    ...DmSingleType,
    ...DmFunType,
    ...DmBothType
} as const;

type DmdbType = typeof DmType;

export type DmdbDataType = {
    [K in keyof DmdbType]: DmdbType[K] extends (...args: never) => infer R ? R : DmdbType[K]
}[keyof DmdbType]
