/**
 *
 *
 * @export
 * @class IMAGE
 */
export class IMAGE {
    static toString() {
        return 'IMAGE';
    }
}

export interface ImageConstructor {
    new(): IMAGE;
}

/**
 *
 *
 * @export
 * @class LONGVARBINARY
 */
export class LONGVARBINARY {
    static toString() {
        return 'LONGVARBINARY';
    }
}

export interface LongVarbinaryConstructor {
    new(): LONGVARBINARY;
}
