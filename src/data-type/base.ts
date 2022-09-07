export default class BaseType {
    private type: string;
    private length?: number;
    private accuracy?: number;
    private scale?: number;

    constructor(type: string, option: { len: number } | { acc: number, sca?: number }) {
        this.type = type;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.length = option.len;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.accuracy = option.acc;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.scale = option.sca;
    }

    public toString() {
        if (typeof this.length !== 'undefined') {
            return `${this.type}(${this.length})`;
        } else if (typeof this.scale !== 'undefined') {
            return `${this.type}(${this.accuracy}, ${this.scale})`;
        } else {
            return `${this.type}(${this.accuracy})`;
        }
    }
}
