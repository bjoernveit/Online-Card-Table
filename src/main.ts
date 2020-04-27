import Vue from "vue";
import App from "./App.vue";
import "./firebase";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTimes,
  faTools,
  faPlus,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faTimes);
library.add(faTools);
library.add(faPlus);
library.add(faTrash);

Vue.component("fa-icon", FontAwesomeIcon);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
