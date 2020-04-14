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
      config.defaultState = new CardState(
        false,
        new CardLocation(TABLE_ID, 100, 100)
      );
    }

    config.cardColors.forEach((group, index) => {
      group.forEach((color: RGBAColor) => {
        config.cardFaces[index].forEach((face: string) => {
          this.cards.push(
            new CardData(face, color, { ...(config.defaultState as CardState) })
          );
        });
      });
    });

    this.shuffle();
  }
}
