import BaseType from './base';

/**
 *
 *
 * @export
 * @class CHAR
 * @extends {BaseType}
 */
export class CHAR extends BaseType {
    constructor(length: number) {
        super('CHAR', { len: length });
    }

    static toString() {
        return 'CHAR';
    }
}

export interface CharConstructor {
    new(length: number): CHAR;
    (length: number): CHAR;
}

/**
 *
 *
 * @export
 * @class CHARACTER
 * @extends {BaseType}
 */
export class CHARACTER extends BaseType {
    constructor(length: number) {
        super('CHARACTER', { len: length });
    }

    static toString() {
        return 'CHARACTER';
    }
}

export interface CharacterConstructor {
    new(length: number): CHARACTER;
    (length: number): CHARACTER;
}

/**
 *
 *
 * @export
 * @class VARCHAR
 * @extends {BaseType}
 */
export class VARCHAR extends BaseType {
    constructor(length: number) {
        super('VARCHAR', { len: length });
    }

    static toString() {
        return 'VARCHAR';
    }
}

export interface VarcharConstructor {
    new(length: number): VARCHAR;
    (length: number): VARCHAR;
}

/**
 *
 *
 * @export
 * @class VARCHAR2
 * @extends {BaseType}
 */
export class VARCHAR2 extends BaseType {
    constructor(length: number) {
        super('VARCHAR2', { len: length });
    }

    static toString() {
        return 'VARCHAR2';
    }
}

export interface Varchar2Constructor {
    new(length: number): VARCHAR2;
    (length: number): VARCHAR2;
}

/**
 *
 *
 * @export
 * @class STRING
 */
export class STRING extends VARCHAR {
    constructor(length: number) {
        super(length);
    }
    static toString() {
        return 'VARCHAR(255)';
    }
}

export interface StringTypeConstructor {
    new(length: number): STRING;
    (length: number): STRING;
}

/**
 *
 *
 * @export
 * @class TEXT
 */
export class TEXT {
    static toString() {
        return 'TEXT';
    }
}

export interface TextConstructor {
    new(): TEXT;
}

/**
 *
 *
 * @export
 * @class LONG
 */
export class LONG {
    static toString() {
        return 'LONG';
    }
}

export interface LongConstructor {
    new(): LONG;
}

/**
 *
 *
 * @export
 * @class LONGVARCHAR
 */
export class LONGVARCHAR {
    static toString() {
        return 'LONGVARCHAR';
    }
}

export interface LongVarcharConstructor {
    new(): LONGVARCHAR;
}

/**
 *
 *
 * @export
 * @class CLOB
 */
export class CLOB {
    static toString() {
        return 'CLOB';
    }
}

export interface ClobConstructor {
    new(): CLOB;
}
