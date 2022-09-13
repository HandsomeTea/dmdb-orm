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
    new(accuracy: number): TIME;
    (accuracy: number): TIME;
}

/**
 *
 *
 * @export
 * @class TIMESTAMP
 * @extends {BaseType}
 */
export class TIMESTAMP extends BaseType {
    constructor(accuracy?: number) {
        super('TIMESTAMP', { acc: accuracy || 6 });
    }

    static toString() {
        return 'TIMESTAMP(6)';
    }
}

export interface TimestampConstructor {
    new(accuracy?: number): TIMESTAMP;
    (accuracy?: number): TIMESTAMP;
}

/**
 *
 *
 * @export
 * @class DATETIME
 * @extends {BaseType}
 */
export class DATETIME extends BaseType {
    constructor(accuracy?: number) {
        super('DATETIME', { acc: accuracy || 6 });
    }

    static toString() {
        return 'DATETIME(6)';
    }
}

export interface DatetimeConstructor {
    new(accuracy?: number): DATETIME;
    (accuracy?: number): DATETIME;
}
