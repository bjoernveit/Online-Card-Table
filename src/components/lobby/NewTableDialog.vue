<template>
  <div class="new-table-dialog">
    <form class="row">
      <div class="col-4">
        <input
          id="roomNameInput"
          type="text"
          v-model="name"
          placeholder="Room Name"
          class="form-control border-dark"
        />
      </div>
      <div class="col-4">
        <input
          id="roomNameInput"
          type="text"
          v-model="password"
          placeholder="Password (optional)"
          class="form-control border-dark"
        />
      </div>
      <div class="col-1">
        <input
          class="form-control"
          type="number"
          v-model="numberOfSeats"
          id="number-input1"
          min="0"
          max="10"
        />
      </div>
      <div class="col-2 offset-1">
        <button
          class="btn btn-success float-right"
          @click.prevent="createAndJoinRoom"
        >
          Create Room
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GlobalStore } from "@/stores/GlobalStore";
import { RoomConfig } from "@/classes/RoomConfig";
import { STANDARD_CARD_CONFIG } from "@/interfaces/Deck";

@Component({})
export default class NewTableDialog extends Vue {
  @Prop() readonly globalStore!: GlobalStore;
  private name = "";
  private password = "";
  private numberOfSeats = 8;

  createAndJoinRoom() {
    this.globalStore
      .createCardRoom(
        this.name,
        new RoomConfig(STANDARD_CARD_CONFIG, this.numberOfSeats),
        this.password
      )
      .then((key) => {
        this.globalStore.joinRoom(key);
      });
  }
}
</script>

<style lang="stylus">
.new-table-dialog {
  font-family: Rubik;
  margin: auto;
  border-radius: 10px;
  background: #c4c4c4;
  //padding: 20px;
  box-sizing: border-box;
}
</style>
