import BaseType from './base';

/**
 *
 *
 * @export
 * @class BINARY
 * @extends {BaseType}
 */
export class BINARY extends BaseType {
    constructor(length: number) {
        super('BINARY', { len: length });
    }

    static toString() {
        return 'BINARY';
    }
}

export interface BinaryTypeConstructor {
    new(): BINARY;
    (length: number): BINARY;
}

/**
 *
 *
 * @export
 * @class VARBINARY
 * @extends {BaseType}
 */
export class VARBINARY extends BaseType {
    constructor(length: number) {
        super('VARBINARY', { len: length });
    }

    static toString() {
        return 'VARBINARY';
    }
}

export interface VarbinaryTypeConstructor {
    new(): VARBINARY;
    (length: number): VARBINARY;
}

/**
 *
 *
 * @export
 * @class BLOB
 */
export class BLOB {
    static toString() {
        return 'BLOB';
    }
}

export interface BlobTypeConstructor {
    new(): BLOB;
}
