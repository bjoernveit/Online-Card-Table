import { User } from "@/classes/User";
import firebase from "firebase";
import { firebaseApp } from "@/firebase";
export class GlobalStore {
  public user: User | null;

  constructor(public isDebug: boolean = false) {
    this.user = new User("Developer", "Developer");
  }

  public async login(username: string, password: string): Promise<boolean> {
    await firebase
      .auth(firebaseApp)
      .signInWithEmailAndPassword(`${username}@card-table.live`, password)
      .then(firebaseCredentials => {
        this.log(`Successfully logged in as ${username}.`);
        this.user = this.getUserOfFirebaseCredentials(firebaseCredentials);
      })
      .catch(reason => {
        this.log(`Error: Login failed. Because of: ${reason}`);
        this.user = null;
      });
    if (this.isLoggedIn()) {
      this.log(`Successfully logged in as ${username}.`);
    }
    return this.isLoggedIn();
  }

  public async registerUser(
    username: string,
    password: string
  ): Promise<boolean> {
    await firebase
      .auth(firebaseApp)
      .createUserWithEmailAndPassword(`${username}@card-table.live`, password)
      .then(firebaseCredentials => {
        this.user = this.getUserOfFirebaseCredentials(firebaseCredentials);
      })
      .catch();

    if (this.isLoggedIn()) {
      this.log(`Successfully logged in as ${username}.`);
    }
    return this.isLoggedIn();
  }

  public isLoggedIn() {
    return this.user != null;
  }

  private getUserOfFirebaseCredentials(
    credentials: firebase.auth.UserCredential
  ): User | null {
    console.log(credentials);
    const firebaseUser = credentials.user;
    const username = firebaseUser?.displayName
      ? firebaseUser?.displayName
      : firebaseUser?.email;
    const uid = firebaseUser?.uid;
    if (username && uid) {
      return new User(uid, username);
    }
    return null;
  }

  private log(text: string) {
    if (this.isDebug) {
      console.log(`[GlobalStore]: ${text}`);
    }
  }
}
