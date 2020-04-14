<template>
  <div class="card-room" v-if="gameStore.isReady">
    <div class="player-area__wrapper">
      <PlayerArea
        v-for="(_, index) in new Array(roomConfig.numberOfPlayers / 2)"
        :key="'PlayerArea' + index"
        :index="index"
        :gameStore="gameStore"
        :globalStore="globalStore"
      ></PlayerArea>
    </div>
    <div>
      <Table :gameStore="gameStore">
        <Card
          v-for="(card, index) in gameStore.cards"
          :key="index"
          :gameStore="gameStore"
          :globalStore="globalStore"
          :index="index"
        ></Card>
        <div style="position:absolute;bottom:3%;left:50%;transform:translate(-50%,0);">
          <button class="btn btn-lg btn-success" @click="resetCards">Reset Cards</button>
          <button class="btn btn-lg btn-danger" @click="resetSeats">Reset Seats</button>
        </div>
      </Table>
    </div>
    <div class="player-area__wrapper">
      <PlayerArea
        v-for="(_, index) in new Array(roomConfig.numberOfPlayers / 2)"
        :key="'PlayerArea' + (index + roomConfig.numberOfPlayers / 2)"
        :index="index + roomConfig.numberOfPlayers / 2"
        :gameStore="gameStore"
        :globalStore="globalStore"
      ></PlayerArea>
    </div>
    <div>
      <!-- <DeckConfig :gameStore="gameStore" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Card from "./Card.vue";
import Table from "./Table.vue";
import PlayerArea from "./PlayerArea.vue";
import { RoomConfig } from "@/classes/RoomConfig";
import { GameStore, GameStoreData } from "@/stores/GameStore";
import { GlobalStore } from "@/stores/GlobalStore";
import DeckConfig from "./DeckConfig.vue";

@Component({
  components: {
    Card,
    Table,
    PlayerArea,
    DeckConfig
  }
})
export default class CardRoom extends Vue {
  @Prop() readonly roomConfig!: RoomConfig;
  @Prop() readonly globalStore!: GlobalStore;
  private gameStore: GameStore = new GameStore(this.roomConfig, true);
  mounted() {
    //this.resetCards();
  }

  resetCards() {
    this.gameStore.resetCards();
    //this.gameStore.initData();
  }

  resetSeats() {
    for (let index = 0; index < this.roomConfig.numberOfPlayers; index++) {
      this.gameStore.freeSeat(index);
    }
  }
}
</script>

<style lang="stylus">
@require '../../styles/index';

$scale-factor = 0.8;
$card-corner-space = 7px * $scale-factor;
$card-size = 100px * $scale-factor;
$card-border-size = 3px;
$card-line-height = 50px * $scale-factor;
$card-font-size = 70px * $scale-factor;
$card-font-size--corner = 16px * $scale-factor;
$drag-zoom-factor = 1;

.card-room {
  // margin-top: 5vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;

  &__table {
    position: relative;
    // width: 70vw;
    // height: 50vh;
    width: 900px;
    height: 500px;
    background: $table-color;
    background-image: url('~@/assets/table_dark.png');
    background-size: 100%;
    border-radius: 30px;
    margin: 20px;
    filter: drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.5));
  }

  &__player-area {
    min-width: $card-size * 4;
    min-height: $card-size * 2;
    border-radius: 20px;
    background: $player-area-color;
    box-sizing: border-box;
    text-align: center;
    position: relative;
    padding-top: 5px;
    margin: 0 10px;
    color: #FFF;

    // filter: drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.5));
    &--empty {
      font-size: 30px;
      // min-width: auto;
      // min-height: auto;
      background: $player-area-color--empty;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__card {
    box-sizing: border-box;
    border: solid #FFF $card-border-size;
    position: absolute;
    width: $card-size;
    height: $card-size;
    line-height: $card-line-height;
    font-size: $card-font-size;
    background: #FFF;
    border-radius: $card-border-size;
    font-family: Rubik, Arial;
    background: #609BF4;
    background-image: url('~@/assets/card_bg.png');
    background-size: 100%;
    filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5));
    top: 100px;
    left: 100px;

    &.dragging {
      width: ($card-size * $drag-zoom-factor);
      height: ($card-size * $drag-zoom-factor);
      font-size: ($card-font-size * $drag-zoom-factor);
      line-height: ($card-line-height * $drag-zoom-factor);
      filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.3));
    }

    &--revealed {
      background: #ffffff;
      border: none;
    }
  }

  & button {
    margin: 0 5px;
    padding: 10px;
    filter: drop-shadow(0px 0px 1px #000);
  }
}

.drag-in-progress .ignore-on-drag {
  pointer-events: none;
}

.player-area__wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;
}

.card {
  &__face {
    font-style: normal;
    font-weight: bold;
    text-align: center;
    position: absolute;
    display: block;
    top: 25%;
    width: 100%;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  &__corner {
    position: absolute;
    line-height: $card-font-size--corner;
    font-size: $card-font-size--corner;

    .dragging & {
      font-size: ($card-font-size--corner * $drag-zoom-factor);
      line-height: ($card-font-size--corner * $drag-zoom-factor);
    }

    &--top-right {
      top: $card-corner-space;
      right: $card-corner-space;
    }

    &--top-left {
      top: $card-corner-space;
      left: $card-corner-space;
    }

    &--bottom-right {
      bottom: $card-corner-space;
      right: $card-corner-space;
    }

    &--bottom-left {
      bottom: $card-corner-space;
      left: $card-corner-space;
    }
  }
}
</style>
