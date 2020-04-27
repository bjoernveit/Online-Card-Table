import { User } from "./User";
import { EMPTY_SEAT } from "@/Constants";

export class SeatData {
  constructor(public owner: User | string = EMPTY_SEAT) {}

  isFree(): boolean {
    return this.owner === EMPTY_SEAT;
  }
  static fromPojo(pojo: any): SeatData {
    if (pojo.owner === EMPTY_SEAT) {
      return new SeatData(EMPTY_SEAT);
    }
    return new SeatData(User.fromPojo(pojo.owner));
  }
}
