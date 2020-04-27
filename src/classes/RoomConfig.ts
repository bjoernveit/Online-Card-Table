import { DeckConfig } from "@/interfaces/Deck";
import { User } from "@/classes/User";
import { HTMLColor } from "./HTMLColor";
import { CardState } from "./CardData";

export class RoomConfig {
  constructor(public deckConfig: DeckConfig, public numberOfPlayers: number) {}

  static fromPojo(pojo: any): RoomConfig {
    const cardColors: Array<HTMLColor[]> = [];
    pojo.deckConfig.cardColors.forEach((collection: any) => {
      const colorCollection: HTMLColor[] = [];
      collection.forEach((color: any) => {
        colorCollection.push(HTMLColor.fromPojo(color));
      });
      cardColors.push(colorCollection);
    });

    return new RoomConfig(
      {
        cardFaces: pojo.deckConfig.cardFaces as Array<string[]>,
        cardColors: cardColors,
        defaultState: CardState.fromPojo(pojo.deckConfig.defaultState),
      },
      pojo.numberOfPlayers
    );
  }
}
