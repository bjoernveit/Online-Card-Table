<template>
  <div
    id="table"
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
@Component({})
export default class CardTable extends Vue {
  @Prop(GameStore) readonly gameStore!: GameStore;
  dragLeave(e: DragEvent) {
    const target = e.target as HTMLElement;
    if (target.id === TABLE_ID) {
      //console.log("Unsetting Table drag mode.");
      target.classList.remove("drag-in-progress");
    }
  }
  dragEnter(e: DragEvent) {
    const target = e.target as HTMLElement;
    if (target.id === TABLE_ID) {
      target.classList.add("drag-in-progress");
      //console.log("Setting Table drag mode.");
    }
  }

  tableDrop(e: DragEvent) {
    const target = e.target as HTMLElement;
    target.classList.remove("drag-in-progress");
    if (target.id === TABLE_ID) {
      const dataTransfer = e.dataTransfer;
      if (dataTransfer) {
        const cardElementId = dataTransfer.getData("card-id");
        const cardElement = document.getElementById(cardElementId);
        if (cardElement) {
          const mouseOffsetX = Number(dataTransfer.getData("mouse-offset-x"));
          const mouseOffsetY = Number(dataTransfer.getData("mouse-offset-y"));
          const index = Number(dataTransfer.getData("card-index"));
          // remove drag related css properties/classes
          cardElement.style.display = "block";
          // cardElement.style.position = "absolute";
          cardElement.classList.remove("dragging");

          //move card
          this.gameStore.moveCard(
            index,
            cardElement,
            new CardLocation(
              target.id,
              e.offsetX - mouseOffsetX,
              e.offsetY - mouseOffsetY
            )
          );
        }
      }
    }
  }
}
</script>
