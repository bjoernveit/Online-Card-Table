<template>
  <div
    id="table"
    class="card-table__table"
    @drop.prevent="tableDrop"
    @dragover.prevent
    @dragenter.prevent="dragEnter"
    @dragleave.prevent="dragLeave"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class CardTable extends Vue {
  dragLeave(e: DragEvent) {
    const target = e.target as HTMLElement;
    if (target.id === "table") {
      //console.log("Unsetting Table drag mode.");
      target.classList.remove("drag-in-progress");
    }
  }
  dragEnter(e: DragEvent) {
    const target = e.target as HTMLElement;
    if (target.id === "table") {
      target.classList.add("drag-in-progress");
      //console.log("Setting Table drag mode.");
    }
  }

  tableDrop(e: DragEvent) {
    const target = e.target as HTMLElement;
    target.classList.remove("drag-in-progress");
    if (target.id === "table") {
      const dataTransfer = e.dataTransfer;
      if (dataTransfer) {
        const cardElementId = dataTransfer.getData("card-id");
        const cardElement = document.getElementById(cardElementId);
        if (cardElement) {
          const mouseOffsetX = Number(dataTransfer.getData("mouse-offset-x"));
          const mouseOffsetY = Number(dataTransfer.getData("mouse-offset-y"));
          target.appendChild(cardElement);
          cardElement.style.display = "block";
          cardElement.style.position = "absolute";
          cardElement.classList.remove("dragging");
          cardElement.style.left = `${e.offsetX - mouseOffsetX}px`;
          cardElement.style.top = `${e.offsetY - mouseOffsetY}px`;
          // console.log(`Offset: X ${e.offsetX} Y ${e.offsetY}`);
        }
      }
    }
  }
}
</script>
