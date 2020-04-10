import { RoomConfig } from "@/classes/RoomConfig";
import { CardData, CardState, CardLocation } from "@/classes/CardData";
import { StandardDeck } from "@/classes/StandardDeck";
import { User } from "@/classes/User";
import { SeatData } from "@/classes/SeatData";

export class GameStore {
  public cards: Array<CardData> = [];
  public seats: Array<SeatData> = [];

  constructor(public roomConfig: RoomConfig, private isDebug: boolean = false) {
    this.resetCards();
    for (let index = 0; index < roomConfig.numberOfPlayers; index++) {
      this.seats.push(new SeatData());
    }
  }

  public resetCards(): void {
    this.cards = new StandardDeck(this.roomConfig.deckConfig).cards;
  }

  public updateCardState(index: number, state: CardState) {
    if (this.isValidIndex(index, this.cards)) {
      this.log(
        `Updating state of Card-${index}: from ${this.cards[index].state} to ${state}.`
      );
      this.cards[index].state = state;
    }
  }

  public setCardOwner(index: number, owner: User | null) {
    if (
      this.isValidIndex(index, this.cards) &&
      this.cards[index].state.owner != owner
    ) {
      if (owner) {
        this.log(`Setting card owner to ${owner} for Card-${index}.`);
      } else {
        this.log(`Resetting card ownership of Card-${index}.`);
      }
      this.cards[index].state.owner = owner;
    }
  }

  public flipCard(index: number) {
    if (this.isValidIndex(index, this.cards)) {
      this.log(`Flipping Card-${index}.`);
      this.cards[index].state.isFaceUp = !this.cards[index].state.isFaceUp;
    }
  }

  public moveCard(
    index: number,
    cardElement: HTMLElement,
    newLocation: CardLocation
  ): boolean {
    if (this.isValidIndex(index, this.cards)) {
      this.cards[index].state.location = newLocation;
      const htmlParentElement = this.getHTMLElementFromId(
        newLocation.placedOnId
      );
      if (htmlParentElement) {
        this.log(
          `Moving Card-${index}:\n${this.cards[index].state.location} ==> ${newLocation}.`
        );
        htmlParentElement.appendChild(cardElement);
        cardElement.style.position = "absolute";
        cardElement.style.left = newLocation.x + "px";
        cardElement.style.top = newLocation.y + "px";
        return true;
      }
    }
    return false;
  }

  public placeUser(index: number, user: User) {
    if (this.isValidIndex(index, this.seats)) {
      if (this.seats[index].isFree()) {
        this.log(`${user} is sitting down on seat ${index}.`);
        this.seats[index].owner = user;
      } else {
        this.log(`Error: Seat ${index} is already taken by User: ${user}.`);
      }
    }
  }

  public freeSeat(index: number) {
    if (this.isValidIndex(index, this.seats)) {
      this.seats[index].owner = null;
    }
  }

  private isValidIndex(index: number, array: Array<any>) {
    if (index < 0 || index >= array.length) {
      this.log(`Error: Index ${index} does not exist in ${array}.`);
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
