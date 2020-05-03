<template>
  <div class="login">
    <form>
      <div class="form-group">
        <div
          class="alert alert-danger"
          role="alert"
          v-if="isFailed"
        >Password incorrect. Please enter the correct password, or register a different user.</div>
        <label for="usernameInput">Username</label>
        <input
          id="usernameInput"
          type="text"
          v-model="username"
          @change.prevent="checkUser"
          aria-describedby="usernameInfo"
          placeholder="Enter Username"
          :class="{
            'form-control': true,
            'border-dark': username === '',
            'border-success': isUserValid,
            'border-danger': username != '' && !isUserValid
          }"
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
          :class="{
            'form-control': true,
            'border-dark': password === '',
            'border-success': isPasswordValid,
            'border-danger': password != '' && !isPasswordValid
          }"
          v-model="password"
          id="exampleInputPassword1"
          placeholder="Password"
        />

        <input
          id="exampleInputPassword1"
          v-if="isUserRegistered === false"
          v-model="password2"
          type="password"
          :class="{
            'form-control': true,
            'border-dark': password === '',
            'border-success': arePasswordsEqual,
            'border-danger': !arePasswordsEqual
          }"
          placeholder="Repeat Password"
        />
      </div>

      <button
        type="submit"
        :disabled="isButtonDisabled"
        :class="{
          'btn btn-primary btn-block btn-success btn-lg border-dark': true
        }"
        @click.prevent="loginOrRegister"
      >{{ buttonText }}</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GlobalStore } from "@/stores/GlobalStore";
import { View } from "../Constants";

@Component
export default class Login extends Vue {
  @Prop(GlobalStore) readonly globalStore!: GlobalStore;
  private username = "";
  private password = "";
  private password2 = "";
  private isFailed = false;
  private isUserRegistered: null | boolean = null;

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

  get arePasswordsEqual() {
    return this.password === this.password2;
  }

  get buttonText() {
    if (this.isUserRegistered === null) {
      return "Login / Register";
    } else if (this.isUserRegistered) {
      return "Login";
    }
    return "Register";
  }

  get isButtonDisabled() {
    return (
      !this.isInputValid || (!this.isUserRegistered && !this.arePasswordsEqual)
    );
  }

  async checkUser() {
    this.isUserRegistered = await this.globalStore
      .isRegistered(this.username)
      .then(success => {
        return success;
      })
      .catch(() => {
        return false;
      });
  }

  async loginOrRegister() {
    const isRegistered = await this.globalStore.isRegistered(this.username);
    let success = false;
    if (isRegistered) {
      //login
      success = await this.globalStore
        .login(this.username, this.password)
        .then(success => {
          return success;
        })
        .catch(() => {
          return false;
        });
    } else {
      //register
      success = await this.globalStore
        .registerUser(this.username, this.password)
        .then(success => {
          return success;
        })
        .catch(() => {
          return false;
        });
    }

    this.isFailed = !success;
  }
}
</script>

<style lang="stylus">
.login {
  font-family: Rubik;
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
