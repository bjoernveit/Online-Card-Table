import { DeckConfig } from "@/interfaces/Deck";
import { User } from "@/classes/User";

export class RoomConfig {
  constructor(public deckConfig: DeckConfig, public numberOfPlayers: number) {}
}
