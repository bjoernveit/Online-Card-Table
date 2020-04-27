import { GameStore } from "@/stores/GameStore";
import { CardLocation } from "@/classes/CardData";
import { User } from "@/classes/User";
import { EMPTY_SEAT } from "@/Constants";

export function dragLeave(e: DragEvent) {
  const target = e.target as HTMLElement;
  target.classList.remove("hovered-by-card");
}
export function dragEnter(e: DragEvent) {
  const target = e.target as HTMLElement;
  target.classList.add("hovered-by-card");
}

export function cardDrop(
  e: DragEvent,
  gameStore: GameStore,
  newOwner: User | string = EMPTY_SEAT
) {
  //Remove all Drag related Classes
  const dragProgressElements = document.getElementsByClassName(
    "drag-in-progress"
  );
  for (let index = 0; index < dragProgressElements.length; index++) {
    dragProgressElements[index].classList.remove("drag-in-progress");
  }
  const hoveredElements = document.getElementsByClassName("hovered-by-card");
  for (let index = 0; index < hoveredElements.length; index++) {
    hoveredElements[index].classList.remove("hovered-by-card");
  }

  const target = e.target as HTMLElement;
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
      if (
        gameStore.moveCard(
          index,
          cardElement,
          new CardLocation(
            target.id,
            e.offsetX - mouseOffsetX,
            e.offsetY - mouseOffsetY
          )
        )
      ) {
        gameStore.setCardOwner(index, newOwner);
      }
    }
  }
}
