import BaseType from './base';

export class STRING {
    static toString() {
        return 'VARCHAR(255)';
    }
}

export class CHAR extends BaseType {
    constructor(length: number) {
        super('CHAR', { len: length });
    }

    static toString() {
        return 'CHAR';
    }
}

export class CHARACTER extends BaseType {
    constructor(length: number) {
        super('CHARACTER', { len: length });
    }

    static toString() {
        return 'CHARACTER';
    }
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
export class TEXT {
    static toString() {
        return 'TEXT';
    }
}
