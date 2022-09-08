/**
 *
 *
 * @export
 * @class BOOLEAN
 */
export class BOOLEAN {
    static toString() {
        return 'BOOLEAN';
    }
}

export interface BooleanTypeConstructor {
    new(): BOOLEAN;
}

/**
 *
 *
 * @export
 * @class BIT
 */
export class BIT {
    static toString() {
        return 'BIT';
    }
}

export interface BitConstructor {
    new(): BOOLEAN;
}
