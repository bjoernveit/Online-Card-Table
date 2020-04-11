<template>
  <div class="login">
    <form>
      <div class="form-group">
        <label for="usernameInput">Username</label>
        <input
          v-model="username"
          type="text"
          :class="{'form-control': true,'border-dark': (username === ''), 'border-success': isUserValid, 'border-danger': (username != '' && !isUserValid)}"
          id="usernameInput"
          aria-describedby="usernameInfo"
          placeholder="Enter Username"
        />
        <small
          id="usernameInfo"
          class="form-text text-muted"
        >Entering an unused Username, will automatically register that name for you.</small>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input
          type="password"
          :class="{'form-control': true,'border-dark': (password === ''), 'border-success': isPasswordValid, 'border-danger': (password != '' && !isPasswordValid)}"
          v-model="password"
          id="exampleInputPassword1"
          placeholder="Password"
        />
      </div>
      <button
        type="submit"
        :class="{'btn btn-primary btn-block btn-success btn-lg': true, 'border-dark': (password === ''), 'border-success': isPasswordValid} "
        @click.prevent="loginOrRegister"
      >Login / Register</button>
    </form>
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
    return this.password.length > 6 && this.password.length < 20;
  }

  get buttonClasses() {
    return {};
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
  width: 300px;
  margin: auto;
  border-radius: 10px;
  background: #c4c4c4;
  padding: 20px;
  box-sizing: border-box;

  & button {
    margin: auto;
  }

  & input {
    margin-bottom: 10px;
  }
}
</style>
