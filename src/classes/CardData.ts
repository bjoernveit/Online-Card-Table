import { HTMLColor } from "./HTMLColor";
import { User } from "./User";
import { EMPTY_SEAT } from "@/Constants";

export class CardLocation {
  constructor(public placedOnId: string, public x: number, public y: number) {
    CardLocation.prototype.toString = this.toString;
  }

  public toString(): string {
    return `{ placedOn: ${this.placedOnId}, x: ${this.x}, y: ${this.y} }`;
  }

  static fromPojo(pojo: any): CardLocation {
    return new CardLocation(pojo.placedOnId, pojo.x, pojo.y);
  }
}
export class CardState {
  constructor(
    public isFaceUp: boolean,
    public location: CardLocation
  ) //public owner: User | string = EMPTY_SEAT
  {
    CardState.prototype.toString = this.toString;
  }

  public toString(): string {
    return `{ isFaceUp: ${
      this.isFaceUp
    }, location: ${this.location.toString()} }`;
  }

  static fromPojo(pojo: any): CardState {
    return new CardState(
      pojo.isFaceUp,
      CardLocation.fromPojo(pojo.location)
      //pojo.owner != EMPTY_SEAT ? User.fromPojo(pojo.owner) : EMPTY_SEAT
    );
  }
}

export class CardData {
  constructor(
    private value: string,
    private color: HTMLColor,
    public state: CardState
  ) {}

  getValue(): string {
    return this.value;
  }

  getColor(): HTMLColor {
    return this.color;
  }

  static fromPojo(pojo: any): CardData {
    return new CardData(
      pojo.value,
      HTMLColor.fromPojo(pojo.color),
      CardState.fromPojo(pojo.state)
    );
  }
}

// State object containing meta data of the state of on specific card
