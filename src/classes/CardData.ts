import { RGBAColor } from "./RGBAColor";
import { User } from "./User";
export class CardData {
  constructor(
    private value: string,
    private color: RGBAColor,
    public state: CardState
  ) {}

  getValue(): string {
    return this.value;
  }

  getColor(): RGBAColor {
    return this.color;
  }
}

// State object containing meta data of the state of on specific card
export class CardState {
  constructor(
    public isFaceUp: boolean,
    public location: CardLocation,
    public owner: User | null = null
  ) {
    CardState.prototype.toString = this.toString;
  }

  public toString(): string {
    return `{ isFaceUp: ${
      this.isFaceUp
    }, location: ${this.location.toString()} }`;
  }
}

export class CardLocation {
  constructor(public placedOnId: string, public x: number, public y: number) {
    CardLocation.prototype.toString = this.toString;
  }

  public toString(): string {
    return `{ placedOn: ${this.placedOnId}, x: ${this.x}, y: ${this.y} }`;
  }
}
