import {
    BOOLEAN,
    BooleanTypeConstructor,
    BIT,
    BitConstructor
} from './boolean';
import {
    STRING,
    StringTypeConstructor,
    CHAR,
    CharConstructor,
    CHARACTER,
    CharacterConstructor,
    VARCHAR,
    VarcharConstructor,
    VARCHAR2,
    Varchar2Constructor,
    TEXT,
    TextConstructor,
    LONG,
    LongConstructor,
    LONGVARCHAR,
    LongVarcharConstructor,
    CLOB,
    ClobConstructor
} from './string';
import {
    INTEGER,
    IntegerTypeConstructor,
    INT,
    IntConstructor,
    BIGINT,
    BigintConstructor,
    TINYINT,
    TinyintConstructor,
    BYTE,
    ByitTypeConstructor,
    SMALLINT,
    SmallintConstructor,
    NUMBER,
    NumberTypeConstructor,
    NUMERIC,
    NumericConstructor,
    DECIMAL,
    DecimalConstructor,
    DEC,
    DecConstructor,
    FLOAT,
    FloatTypeConstructor,
    DOUBLE,
    DoubleTypeConstructor,
    REAL,
    RealConstructor,
    DOUBLE_PRECISION,
    DoublePercisionConstructor
} from './number';
import {
    DATE,
    DateTypeConstructor,
    TIME,
    TimeConstructor,
    TIMESTAMP,
    TimestampConstructor,
    DATETIME,
    DatetimeConstructor
} from './date';
import {
    LONGVARBINARY,
    LongVarbinaryConstructor,
    IMAGE,
    ImageConstructor
} from './media';
import {
    BINARY,
    BinaryTypeConstructor,
    VARBINARY,
    VarbinaryTypeConstructor,
    BLOB,
    BlobTypeConstructor
} from './binary';

const DmSingleType = {
    /**
     * 布尔数据类型
     * 达梦数据库没有布尔数据类型，BOOLEAN是为方便实用而在orm层设置的一个数据类型，该类型实际为BIT，存在库中为0/1,
     * 实际使用dmdb-orm存入和查询时，model会转化为false/true，无需手动转换.
     * 官方说明参考:
     * https://eco.dameng.com/document/dm/zh-cn/pm/dm_sql-introduction.html#1.4.2%20%E4%BD%8D%E4%B8%B2%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B
     */
    BOOLEAN: BOOLEAN as BooleanTypeConstructor,
    BIT: BIT as BitConstructor,
    INTEGER: INTEGER as IntegerTypeConstructor,
    INT: INT as IntConstructor,
    BIGINT: BIGINT as BigintConstructor,
    TINYINT: TINYINT as TinyintConstructor,
    BYTE: BYTE as ByitTypeConstructor,
    SMALLINT: SMALLINT as SmallintConstructor,
    FLOAT: FLOAT as FloatTypeConstructor,
    DOUBLE: DOUBLE as DoubleTypeConstructor,
    DOUBLE_PRECISION: DOUBLE_PRECISION as DoublePercisionConstructor,
    REAL: REAL as RealConstructor,
    DATE: DATE as DateTypeConstructor,
    TEXT: TEXT as TextConstructor,
    LONG: LONG as LongConstructor,
    LONGVARCHAR: LONGVARCHAR as LongVarcharConstructor,
    LONGVARBINARY: LONGVARBINARY as LongVarbinaryConstructor,
    IMAGE: IMAGE as ImageConstructor,
    BLOB: BLOB as BlobTypeConstructor,
    CLOB: CLOB as ClobConstructor
};

const DmBothType = {
    TIME: TIME as TimeConstructor,
    TIMESTAMP: TIMESTAMP as TimestampConstructor,
    DATETIME: DATETIME as DatetimeConstructor,
    NUMERIC: NUMERIC as NumericConstructor,
    NUMBER: NUMBER as NumberTypeConstructor,
    DECIMAL: DECIMAL as DecimalConstructor,
    DEC: DEC as DecConstructor,
    BINARY: BINARY as BinaryTypeConstructor,
    VARBINARY: VARBINARY as VarbinaryTypeConstructor,
    STRING: STRING as StringTypeConstructor,
    CHAR: CHAR as CharConstructor,
    CHARACTER: CHARACTER as CharacterConstructor,
    VARCHAR: VARCHAR as VarcharConstructor,
    VARCHAR2: VARCHAR2 as Varchar2Constructor
};

for (const key in DmBothType) {
    DmBothType[key] = new Proxy(DmBothType[key], {
        apply(_target, _thisArg, args) {
            return new DmBothType[key](...args);
        }
    });
}
export const DmType = {
    ...DmSingleType,
    ...DmBothType
} as const;

type DmdbType = typeof DmType;

export type DmdbDataType = {
    [K in keyof DmdbType]: DmdbType[K] extends (...args: never) => infer R ? R : DmdbType[K]
}[keyof DmdbType]
