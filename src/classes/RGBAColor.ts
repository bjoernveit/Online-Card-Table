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

  public asHexWithoutAlpha(): string {
    return (
      (this.a | (1 << 8)).toString(16).slice(1) +
      (this.b | (1 << 8)).toString(16).slice(1) +
      (this.g | (1 << 8)).toString(16).slice(1)
    );
  }
}
