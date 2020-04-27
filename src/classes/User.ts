export class User {
  constructor(private uid: string, private username: string) {
    User.prototype.toString = this.toString;
  }
  getUsername(): string {
    return this.username;
  }

  getUid() {
    return this.uid;
  }

  toString() {
    return this.getUsername();
  }

  static fromPojo(pojo: any): User {
    return new User(pojo.uid, pojo.username);
  }
}
