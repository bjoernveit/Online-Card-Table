<template>
  <div>
    <div class="lobby container">
      <!-- <h1>Hi I'm the Lobby</h1> -->
      <div class="row header">
        <div class="col-8">Room Name</div>
        <div class="col-1 text-center">Seats</div>
        <div class="col text-center">Creator</div>
        <div class="col text-center">created</div>
      </div>
      <hr />
      <div
        class="row lobby__room-entry"
        v-for="[key, room] of rooms"
        :key="key"
        @click="joinRoom(key)"
      >
        <div class="col-8">
          {{ room.title }}
          <div class="float-right" v-if="room.owner.uid === globalStore.user.uid">
            <fa-icon
              class="delete-icon"
              title="delete room"
              icon="trash"
              @click.prevent="(e) => deleteCardRoom(e, key)"
              size
            />
          </div>
        </div>

        <div class="col-1 text-center">{{ room.gameStoreData.roomConfig.numberOfPlayers }}</div>
        <div class="col text-center">{{ room.owner }}</div>
        <div class="col text-center">{{ getCreatedString(room.getCreationDate()) }}</div>
      </div>

      <hr />
      <hr />
      <NewTableDialog :globalStore="globalStore" />

      <!-- <button class="btn btn-success" @click="newRoom">New Room</button> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GlobalStore } from "@/stores/GlobalStore";
import NewTableDialog from "./NewTableDialog.vue";

@Component({
  components: {
    NewTableDialog
  }
})
export default class Lobby extends Vue {
  @Prop(GlobalStore) readonly globalStore!: GlobalStore;

  get rooms() {
    return Array.from(this.globalStore.rooms).sort(
      (a, b) => b[1].createdAt - a[1].createdAt
    );
  }

  joinRoom(key: string) {
    this.globalStore.joinRoom(key);
  }

  getCreatedString(createdAt: Date) {
    const now = Date.now();
    const diffMilliseconds = now - createdAt.getTime();
    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes === 0) {
      return `just now`;
    } else if (diffHours === 0) {
      return `${diffMinutes}m ago`;
    } else if (diffDays === 0) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return `yersterday`;
    } else {
      return `${diffDays} days ago`;
    }
  }

  deleteCardRoom(e: MouseEvent, roomKey: string) {
    e.stopPropagation();
    this.globalStore.deleteCardRoom(roomKey);
  }
}
</script>

<style lang="stylus">
.lobby {
  font-family: Rubik;
  margin: auto;
  border-radius: 10px;
  background: #c4c4c4;
  padding: 20px;
  box-sizing: border-box;

  & .row.header {
    font-weight: bold;
  }

  &__room-entry {
    margin-bottom: 5px;
    padding: 3px;
    border-radius: 10px;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
      box-shadow: 0 0 4px #000;
    }

    & .delete-icon:hover {
      color: red;
    }
  }
}
</style>
