<template>
  <div class="deckConfig__overlay">
    <div class="deckConfig">
      <form>
        <h4>Deck Config</h4>
        <hr />
        <div
          v-for="(faceCollection, collectionIndex) in faceCollections"
          :key="'faceCollection-' + collectionIndex"
        >
          <span @click="removeCollection(collectionIndex)" class="float-right">
            <fa-icon icon="trash" />
          </span>
          <label :for="'faceCollection-' + collectionIndex">Card-Faces:</label>
          <div :id="'faceCollection-' + collectionIndex" class="form-group row">
            <!-- <label for="example-number-input" class="col-2 col-form-label">Number</label> -->

            <input
              @input="
              e => {
                handleInput(e, collectionIndex);
              }
            "
              class="form-control col"
              type="text"
              :placeholder="commaSeparatedFaceCollections[collectionIndex]"
              id="example-text-input"
            />
            <div class="col-1" style="margin-top: 7px;">
              <fa-icon icon="times" />
            </div>
            <input class="form-control col-2" type="number" value="1" id="number-input1" min="1" />
          </div>
          <label :for="'colorCollection-' + collectionIndex">in Colors:</label>
          <div :id="'colorCollection-' + collectionIndex" class="form-group row">
            <input
              v-for="(color, index) in colorCollections[collectionIndex]"
              :key="'deck-color-' + index"
              class="form-control colorpicker col-2 m-1"
              @change="
              e => {
                handleColorPicker(e, collectionIndex, index);
              }
            "
              :value="color.hexString"
              type="color"
            />
            <button class="btn col-2 m-1" @click.prevent="addColor(collectionIndex)">
              <fa-icon icon="plus" size="2x" />
            </button>
          </div>
          <hr />
        </div>
        <div class="row">
          <button class="btn col btn-outline-darkm-1" style @click.prevent="addCollection">
            <fa-icon icon="plus" />More Cards
          </button>
        </div>
        <hr />
        <button class="btn col-2 m-1 btn-success" @click.prevent="save">Save</button>
        <button
          class="btn col-2 m-1 btn-danger float-right"
          @click.prevent="$emit('hide-config')"
        >Close</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { GameStore } from "@/stores/GameStore";
import { HTMLColor } from "@/classes/HTMLColor";
import { DeckConfig } from "@/interfaces/Deck";
import { RoomConfig } from "@/classes/RoomConfig";

@Component
export default class DeckConfigEditor extends Vue {
  @Prop(GameStore) readonly gameStore!: GameStore;
  private localConfig: DeckConfig = Object.assign(
    {},
    this.gameStore.roomConfig.deckConfig
  );

  get faceCollections() {
    return this.localConfig.cardFaces;
  }
  get colorCollections() {
    return this.localConfig.cardColors;
  }
  get commaSeparatedFaceCollections() {
    const seperatedCollections: Array<string> = [];
    this.faceCollections.forEach(collection => {
      let values = "";
      collection.forEach(face => {
        values += face + ",";
      });
      seperatedCollections.push(values);
    });
    return seperatedCollections;
  }

  addColor(collectionIndex: number) {
    this.colorCollections[collectionIndex].push(new HTMLColor(1, 1, 1));
  }

  addCollection() {
    this.localConfig.cardFaces.push([]);
    this.localConfig.cardColors.push([]);
  }

  handleInput(e: InputEvent, collectionIndex: number) {
    const target = e.target as HTMLInputElement;
    this.localConfig.cardFaces[collectionIndex] = target.value.split(",");
  }

  handleColorPicker(e: Event, collectionIndex: number, colorIndex: number) {
    const target = e.target as HTMLInputElement;
    this.localConfig.cardColors[collectionIndex][
      colorIndex
    ] = HTMLColor.fromHex(target.value) as HTMLColor;
  }

  @Emit("hide-config")
  save() {
    this.gameStore.setRoomConfig(
      new RoomConfig(
        this.localConfig,
        this.gameStore.roomConfig.numberOfPlayers
      )
    );
  }

  hide() {
    const htmlElement = document.getElementsByClassName(
      "deckConfig"
    )[0] as HTMLElement;
    htmlElement.style.display = "none";
  }

  removeCollection(collectionIndex: number) {
    this.localConfig.cardFaces.splice(collectionIndex);
    this.localConfig.cardColors.splice(collectionIndex);
  }
}
</script>

<style lang="stylus">
.deckConfig {
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  margin: auto;
  border-radius: 10px;
  background: #c4c4c4;
  width: 500px;
  box-sizing: border-box;
  padding: 30px;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #1c1c1cc2;
  }
}

.colorpicker {
  height: 60px;
  padding: 0;
  border: 0;
}
</style>
