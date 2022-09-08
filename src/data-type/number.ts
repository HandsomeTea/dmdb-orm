import BaseType from './base';

/**
 *
 *
 * @export
 * @class NUMERIC
 * @extends {BaseType}
 */
export class NUMERIC extends BaseType {
    constructor(accuracy: number, scale?: number) {
        super('NUMERIC', { acc: accuracy, sca: scale });
    }

    static toString() {
        return 'NUMERIC';
    }
}

export interface NumericConstructor {
    new(accuracy: number, scale?: number): NUMERIC;
    (accuracy: number, scale?: number): NUMERIC;
}

/**
 *
 *
 * @export
 * @class DECIMAL
 * @extends {BaseType}
 */
export class DECIMAL extends BaseType {
    constructor(accuracy: number, scale?: number) {
        super('DECIMAL', { acc: accuracy, sca: scale });
    }

    static toString() {
        return 'DECIMAL';
    }
}

export interface DecimalConstructor {
    new(accuracy: number, scale?: number): DECIMAL;
    (accuracy: number, scale?: number): DECIMAL;
}

/**
 *
 *
 * @export
 * @class DEC
 * @extends {BaseType}
 */
export class DEC extends BaseType {
    constructor(accuracy: number, scale?: number) {
        super('DEC', { acc: accuracy, sca: scale });
    }

    static toString() {
        return 'DEC';
    }
}

export interface DecConstructor {
    new(accuracy: number, scale?: number): DEC;
    (accuracy: number, scale?: number): DEC;
}

/**
 *
 *
 * @export
 * @class NUMBER
 * @extends {BaseType}
 */
export class NUMBER extends BaseType {
    constructor(accuracy: number, scale?: number) {
        super('NUMBER', { acc: accuracy, sca: scale });
    }

    static toString() {
        return 'NUMBER';
    }
}

export interface NumberTypeConstructor {
    new(accuracy: number, scale?: number): NUMBER;
    (accuracy: number, scale?: number): NUMBER;
}

/**
 *
 *
 * @export
 * @class INTEGER
 */
export class INTEGER {
    static toString() {
        return 'INTEGER';
    }
}

export interface IntegerTypeConstructor {
    new(): INTEGER;
}

/**
 *
 *
 * @export
 * @class INT
 */
export class INT {
    static toString() {
        return 'INT';
    }
}

export interface IntConstructor {
    new(): INT;
}

/**
 *
 *
 * @export
 * @class BIGINT
 */
export class BIGINT {
    static toString() {
        return 'BIGINT';
    }
}

export interface BigintConstructor {
    new(): BIGINT;
}

/**
 *
 *
 * @export
 * @class TINYINT
 */
export class TINYINT {
    static toString() {
        return 'TINYINT';
    }
}

export interface TinyintConstructor {
    new(): TINYINT;
}

/**
 *
 *
 * @export
 * @class BYTE
 */
export class BYTE {
    static toString() {
        return 'BYTE';
    }
}

export interface ByitTypeConstructor {
    new(): BYTE;
}

/**
 *
 *
 * @export
 * @class SMALLINT
 */
export class SMALLINT {
    static toString() {
        return 'SMALLINT';
    }
}

export interface SmallintConstructor {
    new(): SMALLINT;
}

/**
 *
 *
 * @export
 * @class FLOAT
 */
export class FLOAT {
    static toString() {
        return 'FLOAT';
    }
}

export interface FloatTypeConstructor {
    new(): FLOAT;
}

/**
 *
 *
 * @export
 * @class DOUBLE
 */
export class DOUBLE {
    static toString() {
        return 'DOUBLE';
    }
}

export interface DoubleTypeConstructor {
    new(): DOUBLE;
}

/**
 *
 *
 * @export
 * @class REAL
 */
export class REAL {
    static toString() {
        return 'REAL';
    }
}

export interface RealConstructor {
    new(): REAL;
}

/**
 *
 *
 * @export
 * @class DOUBLE_PRECISION
 */
export class DOUBLE_PRECISION {
    static toString() {
        return 'DOUBLE PRECISION';
    }
}

export interface DoublePercisionConstructor {
    new(): DOUBLE_PRECISION;
}
