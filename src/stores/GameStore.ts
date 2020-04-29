import { RoomConfig } from "@/classes/RoomConfig";
import { CardData, CardState, CardLocation } from "@/classes/CardData";
import { StandardDeck } from "@/classes/StandardDeck";
import { User } from "@/classes/User";
import { SeatData } from "@/classes/SeatData";
import { cardsRef, seatsRef, roomConfigRef, roomRef } from "@/firebase";
import { EMPTY_SEAT, TABLE_ID } from "@/Constants";
import { STANDARD_CARD_CONFIG } from "@/interfaces/Deck";
import { IdFactory } from "@/classes/IdFactory";

export class GameStore {
  public cards: Array<CardData> = [];
  public seats: Array<SeatData> = [];
  public roomConfig: RoomConfig = new RoomConfig(STANDARD_CARD_CONFIG, 8);

  public isReady = false;

  constructor(private isDebug: boolean = false) {
    roomRef.once("value", this.roomInitOfSnapshot.bind(this));
    //cardsRef.once("value", this.setCardsOfSnapshot.bind(this));
    cardsRef.on("value", this.setCardsOfSnapshot.bind(this));

    //seatsRef.once("value", this.setSeatsOfSnapshot.bind(this));
    seatsRef.on("value", this.setSeatsOfSnapshot.bind(this));

    //roomConfigRef.once("value", this.setRoomConfigOfSnapshot.bind(this));
    roomConfigRef.on("value", this.setRoomConfigOfSnapshot.bind(this));
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

  // public setCardOwner(index: number, owner: User | string) {
  //   if (
  //     this.isValidIndex(index, this.cards) &&
  //     this.cards[index].state.owner != owner
  //   ) {
  //     if (owner != EMPTY_SEAT) {
  //       this.log(`Setting card owner to ${owner} for Card-${index}.`);
  //     } else {
  //       this.log(`Resetting card ownership of Card-${index}.`);
  //     }
  //     cardsRef
  //       .child(index + "")
  //       .child("state")
  //       .child("owner")
  //       .set(owner);
  //     //this.cards[index].state.owner = owner;
  //   }
  // }

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
    const formTable = this.cards[index].state.location.placedOnId === TABLE_ID;
    const toUser = newLocation.placedOnId != TABLE_ID;
    if (this.isValidIndex(index, this.cards)) {
      const htmlParentElement = this.getHTMLElementFromId(
        newLocation.placedOnId
      );
      if (htmlParentElement) {
        this.log(
          `Moving Card-${index}:\n${this.cards[index].state.location} ==> ${newLocation}.`
        );

        const updatedCardState: CardState = new CardState(
          formTable && toUser ? false : this.cards[index].state.isFaceUp,
          newLocation
          //this.cards[index].state.owner
        );

        cardsRef
          .child("" + index)
          .child("state")
          .set(updatedCardState);

        this.repositionCardLocally(index, cardElement);
        return true;
      }
    }
    return false;
  }

  public repositionCardLocally(index: number, cardElement: HTMLElement) {
    if (this.isValidIndex(index, this.cards)) {
      const htmlParentElement = this.getHTMLElementFromId(
        this.cards[index].state.location.placedOnId
      );
      if (htmlParentElement) {
        htmlParentElement.appendChild(cardElement);
        cardElement.style.position = "absolute";
        cardElement.style.left = this.cards[index].state.location.x + "px";
        cardElement.style.top = this.cards[index].state.location.y + "px";
      }
    }
  }

  public takeSeat(index: number, user: User) {
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

  public setRoomConfig(config: RoomConfig) {
    roomConfigRef.set(config);
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
      roomConfig: this.roomConfig,
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

  private roomInitOfSnapshot(snapshot: firebase.database.DataSnapshot) {
    let isError = false;
    if (snapshot.val()) {
      //init cards
      if (snapshot.val().cards) {
        //reset list
        this.cards = [];
        snapshot.val().cards.forEach((card: any) => {
          this.cards.push(CardData.fromPojo(card));
        });
      } else {
        isError = true;
      }

      //init seats
      if (snapshot.val().seats) {
        //reset seats
        this.seats = [];
        snapshot.val().seats.forEach((seat: any) => {
          this.seats.push(SeatData.fromPojo(seat));
        });
      } else {
        isError = true;
      }

      //init roomConfig
      if (snapshot.val().roomConfig) {
        this.roomConfig = RoomConfig.fromPojo(snapshot.val().roomConfig);
      } else {
        isError = true;
      }
    }
    if (isError) {
      this.log(
        "Error: Something is wrong, GameStore could not be initializied correctly with the given firebase data."
      );
    } else {
      this.isReady = true;
      this.log("Initialization with firebase data complete.");
    }
  }

  private log(text: string) {
    if (this.isDebug) {
      console.log(`[GameStore]: ${text}`);
    }
  }

  private setCardsOfSnapshot(cardsSnapshot: firebase.database.DataSnapshot) {
    this.cards = [];
    if (cardsSnapshot.val()) {
      cardsSnapshot.val().forEach((card: any) => {
        this.cards.push(CardData.fromPojo(card));
      });
    }
  }

  private setSeatsOfSnapshot(seatsSnapshot: firebase.database.DataSnapshot) {
    this.seats = [];
    seatsSnapshot.val().forEach((seat: any) => {
      this.seats.push(SeatData.fromPojo(seat));
    });
  }

  private setRoomConfigOfSnapshot(
    configSnapshot: firebase.database.DataSnapshot
  ) {
    this.roomConfig = RoomConfig.fromPojo(configSnapshot.val());
  }
}

export interface GameStoreData {
  cards: Array<CardData>;
  seats: Array<SeatData>;
  roomConfig: RoomConfig;
}
