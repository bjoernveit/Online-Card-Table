<template>
  <div class="text-center">
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
      <span class="ignore-on-drag owner-name">{{ ownerName }}</span>
      <hr v-if="!isFree" />
      <slot />
      <div
        class="player-area__text ignore-on-drag"
        v-if="isFree"
        style="padding: 10px; border-radius: 10px; margin: 10px; width: 100%"
        @click="sitDown"
      >
        <div>{{ defaultText1 }}</div>
        <div>{{ defaultText2 }}</div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { User } from "@/classes/User";
import { GameStore } from "@/stores/GameStore";
import { GlobalStore } from "@/stores/GlobalStore";
import * as DragEventHandler from "@/functions/DragEventListeners";
import { EMPTY_SEAT } from "@/Constants";

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
    return this.owner != EMPTY_SEAT ? (this.owner as User).getUsername() : "";
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
      this.gameStore.placeUser(this.index, this.globalStore.user as User);
      document.addEventListener("beforeunload", () => {
        this.gameStore.freeSeat(this.index);
      });
    }
  }

  @Watch("owner")
  onOwnerChange() {
    this.gameStore.cards.forEach((card, index) => {
      if (card.state.location.placedOnId == this.id) {
        this.gameStore.setCardOwner(index, this.globalStore.user as User);
      }
    });
  }
}
</script>

<style lang="stylus">
@require '../../styles/index';

.owner-name {
  color: $player-name-color;
  text-align: center;
  font-weight: bold;
  font-size: 1.3em;
  // text-shadow: 0px 2px 2px $player-name-shadow-color;
}

.card-room__player-area {
  & hr {
    margin: 0 25px;
    border: 0;
    border-top: 1px solid #ffc107;
  }
}
</style>
