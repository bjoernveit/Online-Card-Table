<template>
  <div class="text-center">
    <span class="ignore-on-drag owner-name">{{ ownerName }}</span>
    <div
      :id="id"
      :class="{
        'card-room__player-area': true,
        'card-room__player-area--empty': isFree
      }"
      @drop.prevent="dragDrop"
      @dragover.prevent
      @dragenter.prevent="dragEnter"
      @dragleave.prevent="dragLeave"
    >
      <div
        class="player-area__text ignore-on-drag"
        v-if="isFree"
        style="border: 1px dashed #000; padding: 10px; border-radius: 10px; margin: 10px; width: 100%"
        @click="sitDown"
      >
        <div>{{ defaultText1 }}</div>
        <div>{{ defaultText2 }}</div>
      </div>

      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { User } from "@/classes/User";
import { GameStore } from "@/stores/GameStore";
import { GlobalStore } from "@/stores/GlobalStore";
import * as DragEventHandler from "@/functions/DragEventListeners";

@Component
export default class PlayerArea extends Vue {
  @Prop(Number) readonly index!: number;
  @Prop(GameStore) readonly gameStore!: GameStore;
  @Prop(GlobalStore) readonly globalStore!: GlobalStore;

  private readonly defaultText1: string = "Empty Seat.";
  private readonly defaultText2: string = "Click to Sit.";

  get seatData() {
    return this.gameStore.seats[this.index];
  }

  get owner() {
    return this.seatData.owner;
  }

  get isFree() {
    return this.seatData.isFree();
  }

  get ownerName() {
    return this.owner ? this.owner.getUsername() : "";
  }

  get id() {
    return "player-area-" + this.index;
  }
  dragLeave(e: DragEvent) {
    DragEventHandler.dragLeave(e);
  }

  dragEnter(e: DragEvent) {
    DragEventHandler.dragEnter(e);
  }

  dragDrop(e: DragEvent) {
    DragEventHandler.cardDrop(e, this.gameStore, this.owner);
  }

  sitDown() {
    if (this.globalStore.user) {
      this.gameStore.placeUser(this.index, this.globalStore.user);
    }
  }

  @Watch("owner")
  onOwnerChange() {
    this.gameStore.cards.forEach((card, index) => {
      if (card.state.location.placedOnId == this.id) {
        this.gameStore.setCardOwner(index, this.globalStore.user);
      }
    });
  }
}
</script>

<style lang="stylus">
.owner-name {
  color: #fd9cec;
  text-align: center;
  font-weight: bold;
  font-size: 1.3em;
}
</style>
