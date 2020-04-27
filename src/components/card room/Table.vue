<template>
  <div
    :id="id"
    class="card-room__table"
    @drop.prevent="tableDrop"
    @dragover.prevent
    @dragenter.prevent="dragEnter"
    @dragleave.prevent="dragLeave"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GameStore } from "@/stores/GameStore";
import { CardLocation } from "@/classes/CardData";
import { TABLE_ID } from "@/Constants";
import * as DragEventHandler from "@/functions/DragEventListeners";

@Component({})
export default class CardTable extends Vue {
  @Prop(GameStore) readonly gameStore!: GameStore;
  private readonly id = TABLE_ID;

  dragLeave(e: DragEvent) {
    DragEventHandler.dragLeave(e);
  }

  dragEnter(e: DragEvent) {
    DragEventHandler.dragEnter(e);
  }
  tableDrop(e: DragEvent) {
    DragEventHandler.cardDrop(e, this.gameStore);
  }
}
</script>
