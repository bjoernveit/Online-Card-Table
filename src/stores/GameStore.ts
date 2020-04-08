import { DeckConfig } from "@/interfaces/Deck";
import { CardData, CardState, CardLocation } from "@/classes/CardData";
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
      this.log(`Flipping Card with index: ${index}.`);
      this.cards[index].state.isFaceUp = !this.cards[index].state.isFaceUp;
    }
  }

  public moveCard(
    index: number,
    cardElement: HTMLElement,
    newLocation: CardLocation
  ) {
    if (this.isValidIndex(index)) {
      this.cards[index].state.location = newLocation;
      const htmlParentElement = this.getHTMLElementFromId(
        newLocation.placedOnId
      );
      if (htmlParentElement) {
        this.log(
          `Moving Card with index: ${index}\n${this.cards[index].state.location} ==> ${newLocation}.`
        );
        htmlParentElement.appendChild(cardElement);
        cardElement.style.position = "absolute";
        cardElement.style.left = newLocation.x + "px";
        cardElement.style.top = newLocation.y + "px";
      }
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

  private getHTMLElementFromId(id: string): HTMLElement | null {
    const htmlParentElement = document.getElementById(id);
    if (!htmlParentElement) {
      this.log(`Error: Could not find HTML Element with id: ${id}`);
    }
    return htmlParentElement;
  }

  private log(text: string) {
    if (this.isDebug) {
      console.log(`[GameStore]: ${text}`);
    }
  }
}
