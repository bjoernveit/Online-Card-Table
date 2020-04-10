<template>
  <div class="login">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" v-model="username" />
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" v-model="password" maxlength="20" />
    <button @click="loginOrRegister" :disabled="!isInputValid">Login / Register</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GlobalStore } from "@/stores/GlobalStore";

@Component
export default class Login extends Vue {
  @Prop(GlobalStore) readonly globalStore!: GlobalStore;
  private username = "";
  private password = "";

  get isInputValid(): boolean {
    return this.isUserValid && this.isPasswordValid;
  }

  get isUserValid(): boolean {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(this.username);
  }

  get isPasswordValid(): boolean {
    return this.password.length > 3 && this.password.length < 20;
  }

  async loginOrRegister() {
    console.log("logging in now.");
    await this.globalStore
      .login(this.username, this.password)
      .then(async success => {
        if (!success) {
          console.log("Login failed, trying to register now.");
          const success = await this.globalStore.registerUser(
            this.username,
            this.password
          );
          console.log(`Registration ${success ? "successfull" : "failed"}.`);
        }
      });
  }
}
</script>

<style lang="stylus">
.login {
  font-family: Arial;
  width: 200px;
  margin: auto;
  border-radius: 10px;
  background: #c4c4c4;
  padding: 10px;
  box-sizing: border-box;
}

& button {
  width: 120px;
  margin: auto;
}

& input {
  margin-bottom: 10px;
}
</style>
