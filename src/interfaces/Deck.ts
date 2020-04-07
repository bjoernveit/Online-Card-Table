import { CardData } from "../classes/CardData";
export interface Deck {
  cards: Array<CardData>;

  // Removes one Card from this deck.
  pop(): CardData;

  // Shuffles the cards in this deck.
  shuffle(): void;
}
