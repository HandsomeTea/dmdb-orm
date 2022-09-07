import BaseType from './base';

export class DATE {
    static toString() {
        return 'DATE';
    }
}

export class DATETIME extends BaseType {
    constructor(accuracy: number) {
        super('DATETIME', { acc: accuracy });
    }

    static toString() {
        return 'DATETIME';
    }
}

export class TIME extends BaseType {
    constructor(accuracy: number) {
        super('TIME', { acc: accuracy });
    }

    static toString() {
        return 'TIME';
    }
}

export class TIMESTAMP extends BaseType {
    constructor(accuracy: number) {
        super('TIMESTAMP', { acc: accuracy });
    }

    static toString() {
        return 'TIMESTAMP';
    }
}
