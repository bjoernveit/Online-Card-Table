<template>
  <div id="app">
    <CardTable :deckConfig="deckConfig" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CardTable from "./components/card table/CardTable.vue";
import { StandardDeck } from "./classes/StandardDeck";
import { Deck, STANDARD_CARD_CONFIG, DeckConfig } from "./interfaces/Deck";

@Component({
  components: {
    CardTable
  }
})
export default class App extends Vue {
  private deckConfig: DeckConfig = STANDARD_CARD_CONFIG;
}
</script>

<style lang="stylus">
@require './styles/index';

body {
  background: $background-color;
}
</style>
