export class Feedback {
  get id(): number {
    return this._id;
  }

  get fromClientName(): number {
    return this._fromClientName;
  }

  get rate(): number {
    return this._rate;
  }

  get context(): string {
    return this._context;
  }


  get clientId(): number {
    return this._clientId;
  }

  set clientId(value: number) {
    this._clientId = value;
  }

  get partnerId(): number {
    return this._partnerId;
  }

  set partnerId(value: number) {
    this._partnerId = value;
  }


  get requestId(): number {
    return this._requestId;
  }

  set requestId(value: number) {
    this._requestId = value;
  }

  constructor(id: number, rate: number, context: string, clientId: number, partnerId: number,requestId:number) {
    this._id = id;
    this._rate = rate;
    this._context = context;
    this._clientId = clientId;
    this._partnerId = partnerId;
    this._requestId = requestId;
  }

  private _id: number;
  private _fromClientName: number;
  private _rate: number;
  private _context: string;
  private _clientId:number;
  private _partnerId:number;
  private _requestId:number;

  public toJsonString(): string {
    let json = JSON.stringify(this);
    Object.keys(this).filter(key => key[0] === "_").forEach(key => {
      json = json.replace(key, key.substring(1));
    });

    return json;
  }
}
