import { User } from "@/classes/User";
import firebase from "firebase";
import { firebaseApp } from "@/firebase";
export class GlobalStore {
  public user: User | null;

  constructor(public isDebug: boolean = false) {
    // this.user = new User("Developer", "Developer");
    this.user = null;
  }

  public async isRegistered(username: string) {
    this.log(`Checking if user is registered...`);
    const success = await firebase
      .auth(firebaseApp)
      .fetchSignInMethodsForEmail(`${username}@card-table.live`)
      .then(result => {
        return result.length != 0;
      })
      .catch(() => {
        return false;
      });

    this.log(`User ${success ? "is" : "is not"} registered at the moment.`);
    return success;
  }

  public async login(username: string, password: string): Promise<boolean> {
    return await firebase
      .auth(firebaseApp)
      .signInWithEmailAndPassword(`${username}@card-table.live`, password)
      .then(firebaseCredentials => {
        this.log(`Successfully logged in as ${username}.`);
        this.user = new User(firebaseCredentials.user?.uid as string, username);
        return true;
      })
      .catch(reason => {
        this.log(`Error: Login failed. Because of: ${reason}`);
        this.user = null;
        return false;
      });
  }

  public async registerUser(
    username: string,
    password: string
  ): Promise<boolean> {
    return await firebase
      .auth(firebaseApp)
      .createUserWithEmailAndPassword(`${username}@card-table.live`, password)
      .then(firebaseCredentials => {
        this.user = new User(firebaseCredentials.user?.uid as string, username);
        this.log(`Successfully logged in as ${username}.`);
        return true;
      })
      .catch(reason => {
        this.log(`Error: Login failed. Because of: ${reason}`);
        this.user = null;
        return false;
      });
  }

  public isLoggedIn() {
    return this.user != null;
  }

  private log(text: string) {
    if (this.isDebug) {
      console.log(`[GlobalStore]: ${text}`);
    }
  }
}
