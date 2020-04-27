<template>
  <div id="app">
    <Login :globalStore="globalStore" v-if="!isLoggedIn" />
    <CardRoom :globalStore="globalStore" v-if="isLoggedIn" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CardRoom from "./components/card room/CardRoom.vue";
import { STANDARD_CARD_CONFIG, STANDARD_CARD_COLORS } from "./interfaces/Deck";
import { RoomConfig } from "@/classes/RoomConfig";
import Login from "./components/Login.vue";
import { GlobalStore } from "./stores/GlobalStore";

@Component({
  components: {
    CardRoom,
    Login
  }
})
export default class App extends Vue {
  // private roomConfig: RoomConfig = new RoomConfig(STANDARD_CARD_CONFIG, 8);
  private globalStore: GlobalStore = new GlobalStore(true);

  get isLoggedIn() {
    return this.globalStore.isLoggedIn();
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
