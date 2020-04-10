export class RGBAColor {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number = 1
  ) {}

  getRGBAString(): string {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
  }

  static fromPojo(pojo: any) {
    return new RGBAColor(pojo.r, pojo.g, pojo.b, pojo.a);
  }
}
