<template>
  <div id="app">
    <Login :globalStore="globalStore" v-if="!isLoggedIn" />
    <div v-if="isLoggedIn">
      <CardRoom :globalStore="globalStore" v-if="showCardTable" />
      <Lobby :globalStore="globalStore" v-if="showLobby" />
    </div>
  </div>
</template>

<script lang="ts">
import CardRoom from "./components/card room/CardRoom.vue";
import Login from "./components/Login.vue";
import Lobby from "./components/lobby/Lobby.vue";
import { Component, Vue } from "vue-property-decorator";
import { GlobalStore } from "./stores/GlobalStore";
import { View } from "./Constants";

@Component({
  components: {
    CardRoom,
    Login,
    Lobby
  }
})
export default class App extends Vue {
  // private roomConfig: RoomConfig = new RoomConfig(STANDARD_CARD_CONFIG, 8);
  private globalStore: GlobalStore = new GlobalStore(true);

  get isLoggedIn() {
    return this.globalStore.isLoggedIn();
  }

  get showCardTable() {
    return this.globalStore.activeView === View.CardTable;
  }

  get showLobby() {
    return this.globalStore.activeView === View.Lobby;
  }
}
</script>

<style lang="stylus">
@require './styles/index';

body {
  background: $background-color;
  font-family: 'Handlee', Roboto;
}

.text-center {
  text-align: center;
}

#app {
  position: relative;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
}
</style>
