import { User } from "./User";

export class SeatData {
  public owner: User | null;
  constructor() {
    this.owner = null;
  }

  isFree(): boolean {
    return this.owner === null;
  }
}
