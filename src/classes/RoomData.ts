import { CardData } from "./CardData";
import { RoomConfig } from "./RoomConfig";
import { SeatData } from "./SeatData";
import { StandardDeck } from "./StandardDeck";
import { GameStoreData } from "@/stores/GameStore";
import { User } from "./User";

export class RoomData {
  public gameStoreData: GameStoreData;
  public createdAt!: number;

  constructor(
    public title: string,
    roomConfig: RoomConfig,
    public owner: User,
    public password: string = ""
  ) {
    this.gameStoreData = {
      roomConfig: roomConfig,
      seats: [] as Array<SeatData>,
      cards: [] as Array<CardData>,
    };
  }

  public init() {
    //init cards
    this.gameStoreData.cards = new StandardDeck(
      this.gameStoreData.roomConfig.deckConfig
    ).cards;

    //init seats
    const emptySeats: Array<SeatData> = [];
    for (let i = 0; i < this.gameStoreData.roomConfig.numberOfPlayers; i++) {
      emptySeats.push(new SeatData());
    }
    this.gameStoreData.seats = emptySeats;

    //init creation time
    this.createdAt = Date.now();
  }

  public getCreationDate() {
    return new Date(this.createdAt);
  }

  public static fromPojo(pojo: any) {
    const roomDataObj = new RoomData(
      pojo.title,
      RoomConfig.fromPojo(pojo.gameStoreData.roomConfig),
      User.fromPojo(pojo.owner),
      pojo.password
    );
    roomDataObj.createdAt = pojo.createdAt;
    roomDataObj.gameStoreData.seats = [];
    roomDataObj.gameStoreData.cards = [];
    if (pojo.gameStoreData.seats) {
      pojo.gameStoreData.seats.forEach((seat: any) => {
        roomDataObj.gameStoreData.seats.push(SeatData.fromPojo(seat));
      });
    }

    pojo.gameStoreData.cards.forEach((card: any) => {
      roomDataObj.gameStoreData.cards.push(CardData.fromPojo(card));
    });

    return roomDataObj;
  }
}
