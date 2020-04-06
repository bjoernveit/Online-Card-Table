class RGBAColor {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor (r: number, g:number, b:number, a:number = 1){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    getRGBAString (): string {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }
}