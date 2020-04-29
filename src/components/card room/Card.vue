<template>
  <div
    :id="id"
    :class="{
      'card-room__card': true,
      'card-room__card--revealed': isFaceUp,
      'ignore-on-drag': true
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
    <span class="card__corner card__corner--top-left" v-if="isFaceUp">
      {{
      cardValue
      }}
    </span>
    <span class="card__corner card__corner--top-right" v-if="isFaceUp">
      {{
      cardValue
      }}
    </span>
    <span class="card__corner card__corner--bottom-left" v-if="isFaceUp">
      {{
      cardValue
      }}
    </span>
    <span class="card__corner card__corner--bottom-right" v-if="isFaceUp">
      {{
      cardValue
      }}
    </span>
    <span class="card__face" v-if="isFaceUp">{{ cardValue }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GameStore } from "@/stores/GameStore";
import { EMPTY_SEAT } from "@/Constants";
import { GlobalStore } from "../../stores/GlobalStore";
import { User } from "@/classes/User";
import { IdFactory } from "@/classes/IdFactory";

interface TouchDragInfo {
  startXAbsolute: string;
  startYAbsolute: string;
}

@Component
export default class Card extends Vue {
  @Prop(Number) readonly index!: number;
  @Prop(GameStore) readonly gameStore!: GameStore;
  @Prop(GlobalStore) readonly globalStore!: GlobalStore;

  private touchDragInfo!: TouchDragInfo;
  private htmlElement!: HTMLElement;

  get cardValue() {
    return this.cardData.getValue();
  }

  get isFaceUp() {
    if (this.cardData.state.location.placedOnId === IdFactory.getTableId()) {
      return this.cardData.state.isFaceUp;
    } else {
      const placedOnSeatIndex = IdFactory.getIndexOfId(
        this.cardData.state.location.placedOnId
      );
      const isUserTheOwner =
        this.gameStore.seats[placedOnSeatIndex].owner != EMPTY_SEAT &&
        (this.gameStore.seats[placedOnSeatIndex].owner as User).getUid() ===
          (this.globalStore.user as User).getUid();
      return isUserTheOwner;
    }
  }

  get colorCSS() {
    return `color: ${this.cardData.getColor().rgbaString};`;
  }

  get id() {
    return IdFactory.getCardId(this.index);
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
      const parent = target.parentElement as HTMLElement;
      document
        .getElementsByTagName("body")[0]
        .classList.add("drag-in-progress");
      parent.classList.add("hovered-by-card");
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

    // remove dragging related css properties/classes
    target.style.display = "block";
    target.classList.remove("dragging");

    const body = document.getElementsByTagName("body")[0] as HTMLElement;
    body.classList.remove("drag-in-progress");
  }

  flip() {
    return this.gameStore.flipCard(this.index);
  }

  reposition() {
    if (
      this.htmlElement.style.top != `${this.cardData.state.location.y}px` ||
      this.htmlElement.style.left != `${this.cardData.state.location.x}px`
    ) {
      this.gameStore.repositionCardLocally(this.index, this.htmlElement);
    }
  }
  mounted() {
    this.htmlElement = document.getElementById(this.id) as HTMLElement;
    this.reposition();
  }

  updated() {
    this.reposition();
  }
}
</script>

<style lang="stylus"></style>
