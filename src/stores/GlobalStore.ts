import { User } from "@/classes/User";
import firebase from "firebase";
import { firebaseApp, roomsRef } from "@/firebase";
import { RoomConfig } from "@/classes/RoomConfig";
import { RoomData } from "@/classes/RoomData";
import { faGrinTongueSquint } from "@fortawesome/free-solid-svg-icons";
import { GameStore } from "./GameStore";
import { View } from "@/Constants";

export class GlobalStore {
  public user: User | null;
  public rooms = new Map<string, RoomData>();
  public activeRoom: GameStore | null = null;
  public isReady = false;
  public activeView: View;

  constructor(public isDebug: boolean = false) {
    // this.user = new User("Developer", "Developer");
    this.user = null;
    this.activeView = View.Login;
    roomsRef.once("value", this.loadRoomsOfSnapshot.bind(this));
    roomsRef.on("value", this.loadRoomsOfSnapshot.bind(this));
  }

  public async isRegistered(username: string) {
    this.log(`Checking if user is registered...`);
    const success = await firebase
      .auth(firebaseApp)
      .fetchSignInMethodsForEmail(`${username}@card-table.live`)
      .then((result) => {
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
      .then((firebaseCredentials) => {
        this.log(`Successfully logged in as ${username}.`);
        this.user = new User(firebaseCredentials.user?.uid as string, username);
        this.activeView = View.Lobby;
        return true;
      })
      .catch((reason) => {
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
      .then((firebaseCredentials) => {
        this.user = new User(firebaseCredentials.user?.uid as string, username);
        this.log(`Successfully logged in as ${username}.`);
        this.activeView = View.Lobby;
        return true;
      })
      .catch((reason) => {
        this.log(`Error: Login failed. Because of: ${reason}`);
        this.user = null;
        return false;
      });
  }

  public deleteCardRoom(roomKey: string) {
    roomsRef.child(roomKey).remove();
  }

  public async createCardRoom(
    title: string,
    roomConfig: RoomConfig,
    password = ""
  ): Promise<string> {
    if (title.trim() != "") {
      this.log(`creating Room: ${title}.`);
      const newRoom = new RoomData(
        title,
        roomConfig,
        this.user as User,
        password
      );
      newRoom.init();

      const newRef = await roomsRef.push(newRoom);

      return newRef.key as string;
    } else {
      this.log(`creating Room failed because title was empty.`);
      return "";
    }
  }
  public joinRoom(roomKey: string) {
    if (roomKey != "") {
      this.log(`Joining room with key ${roomKey}.`);
      this.activeRoom = new GameStore(roomKey, true);
      this.activeView = View.CardTable;
    }
  }

  public leaveRoom() {
    this.log(`Leaving room current room.`);
    this.activeRoom = null;
    this.activeView = View.Lobby;
  }

  public isLoggedIn() {
    return this.user != null;
  }

  private loadRoomsOfSnapshot(snapshot: firebase.database.DataSnapshot) {
    const newRoomMap = new Map<string, RoomData>();
    const snapshotValue = snapshot.val();
    Object.entries(snapshotValue).forEach((entry) => {
      newRoomMap.set(entry[0], RoomData.fromPojo(entry[1]));
    });
    this.rooms = newRoomMap;
    this.isReady = true;
  }

  private log(text: string) {
    if (this.isDebug) {
      console.log(`[GlobalStore]: ${text}`);
    }
  }
}
