<template>
  <div
    :id="id"
    :class="{
      'card-table__card': true,
      'card-table__card--revealed': isFaceUp
    }"
    :style="colorCSS"
    draggable="true"
    @dragstart="dragStart"
    @dragend="dragEnd"
    @click="flip"
  >
    <span class="card__corner card__corner--top-left" v-if="isFaceUp">{{ cardValue }}</span>
    <span class="card__corner card__corner--top-right" v-if="isFaceUp">{{ cardValue }}</span>
    <span class="card__corner card__corner--bottom-left" v-if="isFaceUp">{{ cardValue }}</span>
    <span class="card__corner card__corner--bottom-right" v-if="isFaceUp">{{ cardValue }}</span>
    <span class="card__face" v-if="isFaceUp">{{ cardValue }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { CardData } from "../../classes/CardData";
@Component
export default class Card extends Vue {
  @Prop(Number) readonly index!: number;
  @Prop(CardData) readonly cardData!: CardData;

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

  dragStart(e: DragEvent) {
    const target = e.target as HTMLElement;
    const dataTransfer = e.dataTransfer;
    // console.log(`Cardoffset: X ${e.offsetX} Y ${e.offsetY}`);
    if (dataTransfer) {
      dataTransfer.setData("card-id", this.id as string);
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

  dragEnd(e: DragEvent) {
    const target = e.target as HTMLElement;
    target.style.display = "block";
    target.classList.remove("dragging");

    const table = document.getElementById("table") as HTMLElement;
    table.classList.remove("drag-in-progress");
  }

  @Emit("flip")
  flip() {
    return this.index;
  }
}
</script>

<style lang="stylus"></style>
