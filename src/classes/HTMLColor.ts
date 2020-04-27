export class HTMLColor {
  public rgbaString: string;
  public hexString: string;
  constructor(
    private r: number,
    private g: number,
    private b: number,
    private a: number = 1
  ) {
    this.rgbaString = `rgba(${this.r},${this.g},${this.b},${this.a})`;
    this.hexString =
      "#" +
      (this.r | (1 << 8)).toString(16).slice(1) +
      (this.g | (1 << 8)).toString(16).slice(1) +
      (this.b | (1 << 8)).toString(16).slice(1);
  }

  static fromPojo(pojo: any) {
    return new HTMLColor(pojo.r, pojo.g, pojo.b, pojo.a);
  }

  static fromHex(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? new HTMLColor(
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        )
      : null;
  }
}
