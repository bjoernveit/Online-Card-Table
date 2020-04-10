import { RoomConfig } from "@/classes/RoomConfig";
import { CardData, CardState, CardLocation } from "@/classes/CardData";
import { StandardDeck } from "@/classes/StandardDeck";
import { User } from "@/classes/User";
import { SeatData } from "@/classes/SeatData";
import { cardsRef, seatsRef, roomRef } from "@/firebase";
import { EMPTY_SEAT } from "@/Constants";
import { RGBAColor } from "@/classes/RGBAColor";

export class GameStore {
  public cards: Array<CardData> = [];
  public seats: Array<SeatData> = [];

  public isReady = false;

  private cardsReady = false;
  private seatsReady = false;

  constructor(public roomConfig: RoomConfig, private isDebug: boolean = false) {
    cardsRef.once("value", this.setCardsOfSnapshot.bind(this));
    cardsRef.on("value", this.setCardsOfSnapshot.bind(this));

    seatsRef.once("value", this.setSeatsOfSnapshot.bind(this));
    seatsRef.on("value", this.setSeatsOfSnapshot.bind(this));
  }

  public setCardsOfSnapshot(cardsSnapshot: firebase.database.DataSnapshot) {
    this.cards = [];
    cardsSnapshot.val().forEach((card: any) => {
      this.cards.push(CardData.fromPojo(card));
    });
    this.cardsReady = true;
    this.isReady = this.seatsReady;
  }

  public setSeatsOfSnapshot(seatsSnapshot: firebase.database.DataSnapshot) {
    this.seats = [];
    seatsSnapshot.val().forEach((seat: any) => {
      this.seats.push(SeatData.fromPojo(seat));
    });
    this.seatsReady = true;
    this.isReady = this.cardsReady;
  }

  public resetCards(): void {
    cardsRef.set(new StandardDeck(this.roomConfig.deckConfig).cards);
    //this.cards = new StandardDeck(this.roomConfig.deckConfig).cards;
  }

  public updateCardState(index: number, state: CardState) {
    if (this.isValidIndex(index, this.cards)) {
      this.log(
        `Updating state of Card-${index}: from ${this.cards[index].state} to ${state}.`
      );
      cardsRef
        .child(index + "")
        .child("state")
        .set(state);
    }
  }

  public setCardOwner(index: number, owner: User | string) {
    if (
      this.isValidIndex(index, this.cards) &&
      this.cards[index].state.owner != owner
    ) {
      if (owner != EMPTY_SEAT) {
        this.log(`Setting card owner to ${owner} for Card-${index}.`);
      } else {
        this.log(`Resetting card ownership of Card-${index}.`);
      }
      cardsRef
        .child(index + "")
        .child("state")
        .child("owner")
        .set(owner);
      //this.cards[index].state.owner = owner;
    }
  }

  public flipCard(index: number) {
    if (this.isValidIndex(index, this.cards)) {
      this.log(`Flipping Card-${index}.`);
      cardsRef
        .child(index + "")
        .child("state")
        .child("isFaceUp")
        .set(!this.cards[index].state.isFaceUp);
    }
  }

  public moveCard(
    index: number,
    cardElement: HTMLElement,
    newLocation: CardLocation
  ): boolean {
    if (this.isValidIndex(index, this.cards)) {
      const htmlParentElement = this.getHTMLElementFromId(
        newLocation.placedOnId
      );
      if (htmlParentElement) {
        this.log(
          `Moving Card-${index}:\n${this.cards[index].state.location} ==> ${newLocation}.`
        );

        cardsRef
          .child("" + index)
          .child("state")
          .child("location")
          .set(newLocation);

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
        seatsRef
          .child("" + index)
          .child("owner")
          .set(user);
      } else {
        this.log(`Error: Seat ${index} is already taken by User: ${user}.`);
      }
    }
  }

  public freeSeat(index: number) {
    if (this.isValidIndex(index, this.seats)) {
      seatsRef
        .child("" + index)
        .child("owner")
        .set(EMPTY_SEAT);
    }
  }

  public initData() {
    const emptySeats: Array<SeatData> = [];

    for (let index = 0; index < this.roomConfig.numberOfPlayers; index++) {
      emptySeats.push(new SeatData());
    }
    const initialData: GameStoreData = {
      cards: new StandardDeck(this.roomConfig.deckConfig).cards,
      seats: emptySeats,
      roomConfig: this.roomConfig
    };
    console.log(initialData);
    roomRef.set(initialData);
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

export interface GameStoreData {
  cards: Array<CardData>;
  seats: Array<SeatData>;
  roomConfig: RoomConfig;
}
