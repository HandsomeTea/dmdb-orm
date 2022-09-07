import BaseType from './base';

export class NUMERIC extends BaseType {
    constructor(accuracy: number, scale?: number) {
        super('NUMERIC', { acc: accuracy, sca: scale });
    }

    static toString() {
        return 'NUMERIC';
    }
}

export class NUMBER extends BaseType {
    constructor(accuracy: number, scale?: number) {
        super('NUMBER', { acc: accuracy, sca: scale });
    }

    static toString() {
        return 'NUMBER';
    }
}

export class DECIMAL extends BaseType {
    constructor(accuracy: number, scale?: number) {
        super('DECIMAL', { acc: accuracy, sca: scale });
    }

    static toString() {
        return 'DECIMAL';
    }
}

export class DEC extends BaseType {
    constructor(accuracy: number, scale?: number) {
        super('DEC', { acc: accuracy, sca: scale });
    }

    static toString() {
        return 'DEC';
    }
}

export class INTEGER {
    static toString() {
        return 'INTEGER';
    }
}
export class INT {
    static toString() {
        return 'INT';
    }
}
export class BIGINT {
    static toString() {
        return 'BIGINT';
    }
}
export class TINYINT {
    static toString() {
        return 'TINYINT';
    }
}
export class BYTE {
    static toString() {
        return 'BYTE';
    }
}
export class SMALLINT {
    static toString() {
        return 'SMALLINT';
    }
}
