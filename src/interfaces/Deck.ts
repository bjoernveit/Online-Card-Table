import { Card } from '../classes/Card'
export interface Deck {
    cards: Array<Card>;

    // Removes one Card from this deck.
    pop(): Card;

    // Shuffles the cards in this deck.
    shuffle(): void;
}