export class User {
  constructor(
    public email: string | null,
    public id: string | null,
    private _token: string,
    private _tokenExpirationDate: Date | null
  ) {}

  get token(): string {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return "";
    }
    return this._token;
  }
}
