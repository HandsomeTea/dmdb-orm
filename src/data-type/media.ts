import BaseType from './base';

export class BINARY extends BaseType {
    constructor(length: number) {
        super('BINARY', { len: length });
    }

    static toString() {
        return 'BINARY';
    }
}

export class VARBINARY extends BaseType {
    constructor(length: number) {
        super('VARBINARY', { len: length });
    }

    static toString() {
        return 'VARBINARY';
    }
}

export class FLOAT extends BaseType {
    constructor(accuracy: number) {
        super('FLOAT', { acc: accuracy });
    }

    static toString() {
        return 'FLOAT';
    }
}

export class DOUBLE extends BaseType {
    constructor(accuracy: number) {
        super('DOUBLE', { acc: accuracy });
    }

    static toString() {
        return 'DOUBLE';
    }
}

export class DOUBLE_PRECISION extends BaseType {
    constructor(accuracy: number) {
        super('DOUBLE PRECISION', { acc: accuracy });
    }

    static toString() {
        return 'DOUBLE PRECISION';
    }
}

export class LONG {
    static toString() {
        return 'LONG';
    }
}

export class LONGVARCHAR {
    static toString() {
        return 'LONGVARCHAR';
    }
}

export class LONGVARBINARY {
    static toString() {
        return 'LONGVARBINARY';
    }
}

export class IMAGE {
    static toString() {
        return 'IMAGE';
    }
}

export class BLOB {
    static toString() {
        return 'BLOB';
    }
}

export class CLOB {
    static toString() {
        return 'CLOB';
    }
}

export class BFILE {
    static toString() {
        return 'BFILE';
    }
}
