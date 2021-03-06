import { DeckConfig } from "@/interfaces/Deck";
import { CardData, CardState } from "@/classes/CardData";
import { StandardDeck } from "@/classes/StandardDeck";

export class GameStore {
  public cards: Array<CardData> = [];
  constructor(
    private deckConfig: DeckConfig,
    private isDebug: boolean = false
  ) {
    this.resetCards();
  }

  public resetCards(): void {
    this.cards = new StandardDeck(this.deckConfig).cards;
  }

  public updateCardState(index: number, state: CardState) {
    if (this.isValidIndex(index)) {
      this.log(
        `Updating state of card with index: ${index} from ${this.cards[index].state} to ${state}.`
      );
      this.cards[index].state = state;
    }
  }

  public flipCard(index: number) {
    if (this.isValidIndex(index)) {
      this.log(`flipping Card with index: ${index}`);
      this.cards[index].state.isFaceUp = !this.cards[index].state.isFaceUp;
    }
  }

  private isValidIndex(index: number) {
    if (index < 0 || index >= this.cards.length) {
      this.log(
        `Error: Index ${index} does not exist in the cards of the store.`
      );
      return false;
    } else {
      return true;
    }
  }

  private log(text: string) {
    if (this.isDebug) {
      console.log(`[GameStore]: ${text}`);
    }
  }
}
