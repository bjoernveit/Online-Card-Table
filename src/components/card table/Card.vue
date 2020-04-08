<template>
  <div
    :id="id"
    :class="{
      'card-table__card': true,
      'card-table__card--revealed': isFaceUp
    }"
    :style="cssStyleProperties"
    draggable="true"
    @dragstart="dragStart"
    @dragend="dragEnd"
    @click="flip"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
  >
    <span class="card__corner card__corner--top-left" v-if="isFaceUp">{{ cardValue }}</span>
    <span class="card__corner card__corner--top-right" v-if="isFaceUp">{{ cardValue }}</span>
    <span class="card__corner card__corner--bottom-left" v-if="isFaceUp">{{ cardValue }}</span>
    <span class="card__corner card__corner--bottom-right" v-if="isFaceUp">{{ cardValue }}</span>
    <span class="card__face" v-if="isFaceUp">{{ cardValue }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GameStore } from "@/stores/GameStore";

interface TouchDragInfo {
  startXAbsolute: string;
  startYAbsolute: string;
}

@Component
export default class Card extends Vue {
  @Prop(Number) readonly index!: number;
  @Prop(GameStore) readonly gameStore!: GameStore;

  private touchDragInfo!: TouchDragInfo;

  get cardValue() {
    return this.cardData.getValue();
  }

  get isFaceUp() {
    return this.cardData.state.isFaceUp;
  }

  get colorCSS() {
    return `color: ${this.cardData.getColor().getRGBAString()};`;
  }

  get id() {
    return "Card-" + this.index;
  }

  get cardData() {
    return this.gameStore.cards[this.index];
  }

  get cssStyleProperties() {
    return `${this.colorCSS}`;
  }

  dragStart(e: DragEvent) {
    const target = e.target as HTMLElement;
    const dataTransfer = e.dataTransfer;
    // console.log(`Cardoffset: X ${e.offsetX} Y ${e.offsetY}`);
    if (dataTransfer) {
      dataTransfer.setData("card-id", this.id);
      dataTransfer.setData("card-index", "" + this.index);
      dataTransfer.setData("mouse-offset-x", "" + e.offsetX);
      dataTransfer.setData("mouse-offset-y", "" + e.offsetY);
    }

    target.classList.add("dragging");

    setTimeout(() => {
      target.style.display = "none";
      const table = document.getElementById("table") as HTMLElement;
      table.classList.add("drag-in-progress");
    }, 0);
  }

  touchStart(e: TouchEvent) {
    const touchObj = e.changedTouches[0];
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const startY = touchObj.clientY;
    const startX = touchObj.clientX;
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;
    console.log(`Touch Offset: X ${offsetX} Y ${offsetY}`);
  }

  touchMove(e: TouchEvent) {
    console.log(`${e.target as HTMLElement} is moving...`);
  }

  touchEnd(e: TouchEvent) {
    console.log(`${e.target as HTMLElement} touch end.`);
  }

  dragEnd(e: DragEvent) {
    const target = e.target as HTMLElement;

    // remove draging related css prorties/classes
    target.style.display = "block";
    target.classList.remove("dragging");

    const table = document.getElementById("table") as HTMLElement;
    table.classList.remove("drag-in-progress");
  }

  flip() {
    return this.gameStore.flipCard(this.index);
  }
}
</script>

<style lang="stylus"></style>
