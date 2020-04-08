import { Deck, DeckConfig, DeckConstructor } from "@/interfaces/Deck";
import { CardData, CardState, CardLocation } from "./CardData";
import { RGBAColor } from "./RGBAColor";
import { TABLE_ID } from "@/Constants";
export class StandardDeck implements Deck {
  cards: CardData[] = [];

  pop(): CardData {
    throw new Error("Method not implemented.");
  }

  shuffle(): void {
    let j, x, i;
    for (i = this.cards.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = x;
    }
  }

  constructor(config: DeckConfig) {
    if (config.defaultState === undefined) {
      config.defaultState = {
        isFaceUp: false,
        location: new CardLocation(TABLE_ID, 100, 100),
      };
    }
    config.cardColors.forEach((color: RGBAColor) => {
      config.cardFaces.forEach((face: string) => {
        this.cards.push(
          new CardData(face, color, { ...(config.defaultState as CardState) })
        );
      });
    });
    this.shuffle();
  }
}

export const STANDARD_CARD_FACES: Array<string> = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
];

export const STANDARD_CARD_COLORS: Array<RGBAColor> = [
  new RGBAColor(182, 5, 5),
  new RGBAColor(10, 168, 6),
  new RGBAColor(0, 0, 0),
  new RGBAColor(36, 93, 203),
];
