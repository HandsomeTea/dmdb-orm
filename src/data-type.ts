interface DmTypeConst {
    // date
    DATE: 'DATE'
    DATETIME: (acc: number) => `DATETIME(${number})`
    TIME: 'TIME' | ((acc: number) => `TIME(${number})`)
    TIMESTAMP: 'TIMESTAMP' | ((acc: number) => `TIMESTAMP(${number})`)

    // boolean
    /**
     * 布尔数据类型
     * 达梦数据库没有布尔数据类型，BOOLEAN是为方便实用而在orm层设置的一个数据类型，该类型实际为BIT，存在库中为0/1,
     * 实际使用dmdb-orm存入和查询时，model会转化为false/true，无需手动转换.
     * 官方说明参考:
     * https://eco.dameng.com/document/dm/zh-cn/pm/dm_sql-introduction.html#1.4.2%20%E4%BD%8D%E4%B8%B2%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B
     */
    BOOLEAN: 'BOOLEAN'
    BIT: 'BIT'

    // number
    NUMERIC: 'NUMERIC' | ((acc: number, sca?: number) => `NUMERIC(${number})` | `NUMERIC(${number},${number})`)
    NUMBER: 'NUMBER' | ((acc: number, sca?: number) => `NUMBER(${number})` | `NUMBER(${number},${number})`)
    DECIMAL: 'DECIMAL' | ((acc: number, sca?: number) => `DECIMAL(${number})` | `DECIMAL(${number},${number})`)
    DEC: 'DEC' | ((acc: number, sca?: number) => `DEC(${number})` | `DEC(${number},${number})`)
    INTEGER: 'INTEGER'
    INT: 'INT'
    BIGINT: 'BIGINT'
    TINYINT: 'TINYINT'
    BYTE: 'BYTE'
    SMALLINT: 'SMALLINT'

    // bunary
    BINARY: 'BINARY' | ((len: number) => `BINARY(${number})`)
    VARBINARY: 'VARBINARY' | ((len: number) => `VARBINARY(${number})`)
    FLOAT: 'FLOAT' | ((acc: number) => `FLOAT(${number})`)
    DOUBLE: 'DOUBLE' | ((acc: number) => `DOUBLE(${number})`)
    'DOUBLE PRECISION': 'DOUBLE PRECISION' | ((acc: number) => `DOUBLE PRECISION(${number})`)
    REAL: 'REAL'

    // string
    STRING: 'VARCHAR(255)'
    CHAR: (len: number) => `CHAR(${number})`
    CHARACTER: (len: number) => `CHARACTER(${number})`
    VARCHAR: (len: number) => `VARCHAR(${number})`
    VARCHAR2: (len: number) => `VARCHAR2(${number})`

    // media
    TEXT: 'TEXT'
    LONG: 'LONG'
    LONGVARCHAR: 'LONGVARCHAR'
    IMAGE: 'IMAGE'
    LONGVARBINARY: 'LONGVARBINARY'
    BLOB: 'BLOB'
    CLOB: 'CLOB'
    BFILE: 'BFILE'
}

export const DmType: DmTypeConst = {
    DATE: 'DATE',
    TIME: 'TIME',
    BOOLEAN: 'BOOLEAN',
    BIT: 'BIT',
    INTEGER: 'INTEGER',
    INT: 'INT',
    BIGINT: 'BIGINT',
    TINYINT: 'TINYINT',
    BYTE: 'BYTE',
    SMALLINT: 'SMALLINT',
    STRING: 'VARCHAR(255)',
    CHAR: (len: number) => `CHAR(${len})`,
    CHARACTER: (len: number) => `CHARACTER(${len})`,
    VARCHAR: (len: number) => `VARCHAR(${len})`,
    VARCHAR2: (len: number) => `VARCHAR2(${len})`
};

export type DmdbDataType = typeof DmType;
