import { CardData, CardState, CardLocation } from "@/classes/CardData";
import { RGBAColor } from "@/classes/RGBAColor";
import { TABLE_ID } from "@/Constants";
export interface Deck {
  cards: Array<CardData>;

  // Removes one Card from this deck.
  pop(): CardData;

  // Shuffles the cards in this deck.
  shuffle(): void;
}

export interface DeckConstructor {
  new (config: DeckConfig): Deck;
}

export interface DeckConfig {
  cardFaces: Array<string>;
  cardColors: Array<RGBAColor>;
  defaultState?: CardState;
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

export const STANDARD_CARD_CONFIG: DeckConfig = {
  cardFaces: STANDARD_CARD_FACES,
  cardColors: STANDARD_CARD_COLORS,
  defaultState: {
    isFaceUp: false,
    location: new CardLocation(TABLE_ID, 100, 100),
  },
};
