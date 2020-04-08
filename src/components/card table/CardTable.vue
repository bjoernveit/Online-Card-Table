<template>
  <div class="card-table">
    <Table :gameStore="gameStore">
      <Card
        v-for="(card, index) in gameStore.cards"
        :key="index"
        :gameStore="gameStore"
        :index="index"
      ></Card>
    </Table>
    <button @click="resetCards">Reset Cards</button>
    <!-- <div class="card-table__player-area" @dragover.prevent="dragOver" @drop.prevent="tableDrop"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Card from "./Card.vue";
import Table from "./Table.vue";
import { DeckConfig } from "@/interfaces/Deck";
import { GameStore } from "@/stores/GameStore";

@Component({
  components: {
    Card,
    Table
  }
})
export default class CardTable extends Vue {
  @Prop() deckConfig!: DeckConfig;
  private gameStore: GameStore = new GameStore(this.deckConfig, true);

  mounted() {
    this.resetCards();
  }

  resetCards() {
    this.gameStore.resetCards();
  }
}
</script>

<style lang="stylus">
@require '../../styles/index';

$card-corner-space = 7px;
$card-size = 100px;
$card-border-size = 10px;
$card-line-height = 50px;
$card-font-size = 70px;
$card-font-size--corner = 16px;
$drag-zoom-factor = 1;

.card-table {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;

  &__table {
    position: relative;
    width: 90vw;
    height: 90vh;
    background: $table-color;
    border-radius: 100px;
    margin: 20px;
  }

  &__player-area {
    width: 500px;
    height: 200px;
    border-radius: 20px;
    background: $player-area-color;
    box-sizing: border-box;
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
    border-radius: 20px;
    font-family: Arial;
    background: #609BF4;
    filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.2));
    top: 20%;
    left: 20%;

    &.dragging {
      width: ($card-size * $drag-zoom-factor);
      height: ($card-size * $drag-zoom-factor);
      font-size: ($card-font-size * $drag-zoom-factor);
      line-height: ($card-line-height * $drag-zoom-factor);
      filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.3));
    }

    .drag-in-progress & {
      pointer-events: none;
    }

    &--revealed {
      background: #ffffff;
      border: none;
    }
  }
}

.card {
  &__face {
    font-style: normal;
    font-weight: bold;
    text-align: center;
    position: absolute;
    top: 25%;
    right: 25%;
    bottom: 25%;
    left: 25%;
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
