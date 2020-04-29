export class IdFactory {
  private static CARD_ID_PREFIX = "card";
  private static PLAYER_AREA_ID_PREFIX = "player_area";
  private static TABLE_ID = "card_table";
  private static INDEX_DELIMITER = "#";

  public static getCardId(forIndex: number): string {
    return this.CARD_ID_PREFIX + this.INDEX_DELIMITER + forIndex;
  }

  public static getPlayerAreaId(forIndex: number): string {
    return this.PLAYER_AREA_ID_PREFIX + this.INDEX_DELIMITER + forIndex;
  }

  public static getTableId(): string {
    return this.TABLE_ID;
  }

  public static getIndexOfId(id: string) {
    const idSplit = id.split(this.INDEX_DELIMITER);
    return Number(idSplit[idSplit.length - 1]);
  }
}
