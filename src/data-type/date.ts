import BaseType from './base';

/**
 *
 *
 * @export
 * @class DATE
 */
export class DATE {
    static toString() {
        return 'DATE';
    }
}

export interface DateTypeConstructor {
    new(): DATE;
}

/**
 *
 *
 * @export
 * @class TIME
 * @extends {BaseType}
 */
export class TIME extends BaseType {
    constructor(accuracy: number) {
        super('TIME', { acc: accuracy });
    }

    static toString() {
        return 'TIME';
    }
}

export interface TimeConstructor {
    new(): TIME;
    (accuracy: number): TIME;
}

/**
 * default: TIMESTAMP(6)
 *
 * @export
 * @class TIMESTAMP
 * @extends {BaseType}
 */
export class TIMESTAMP extends BaseType {
    constructor(accuracy: number) {
        super('TIMESTAMP', { acc: accuracy });
    }

    static toString() {
        return 'TIMESTAMP(6)';
    }
}

export interface TimestampConstructor {
    new(): TIMESTAMP;
    (accuracy: number): TIMESTAMP;
}

/**
 * default: DATETIME(6)
 *
 * @export
 * @class DATETIME
 * @extends {BaseType}
 */
export class DATETIME extends BaseType {
    constructor(accuracy: number) {
        super('DATETIME', { acc: accuracy });
    }

    static toString() {
        return 'DATETIME(6)';
    }
}

export interface DatetimeConstructor {
    new(): DATETIME;
    (accuracy: number): DATETIME;
}
