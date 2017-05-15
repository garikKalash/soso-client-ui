import {PartnerServiceDetail} from "./partner-service-detail.model";
import {Partner} from "./partner.model";
export class Request{
  private _id:number;
  private _clientId:number;

  private _partnerId:number;
  private _partner:Partner;

  private _startTime:Date;
  private _description:string;
  private _status:number;
  private _responseText:string;
  private _duration:number;
  private _endTime:Date;
  private _newRequestStartTime : Date;
  private _serviceId:number;
  private _service:PartnerServiceDetail;
  private _israted:boolean;

  constructor(id: number, clientId: number, partnerId:number,
              startTime: Date, description: string,
              status: number, responseText: string,
              duration:number, serviceId:number, isRated:boolean) {
    this._id = id;
    this._clientId = clientId;
    this._partnerId = partnerId;
    this._startTime = startTime;
    this._description = description;
    this._status = status;
    this._responseText = responseText;
    this._duration = duration;
    this._serviceId = serviceId;
    this._israted = isRated;
  }

  get israted(): boolean {
    return this._israted;
  }

  set israted(value: boolean) {
    this._israted = value;
  }

  get endTime(): Date {
    return this._endTime;
  }

  set endTime(value: Date) {
    this._endTime = value;
  }


  get partner(): Partner {
    return this._partner;
  }

  set partner(value: Partner) {
    this._partner = value;
  }

  get newRequestStartTime(): Date {
    return this._newRequestStartTime;
  }

  set newRequestStartTime(value: Date) {
    this._newRequestStartTime = value;
  }


  get service(): PartnerServiceDetail {
    return this._service;
  }

  set service(value: PartnerServiceDetail) {
    this._service = value;
  }

  get serviceId(): number {
    return this._serviceId;
  }

  set serviceId(value: number) {
    this._serviceId = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }


  get duration(): number {
    return this._duration;
  }

  set duration(value: number) {
    this._duration = value;
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

  get startTime(): Date {
    return this._startTime;
  }

  set startTime(value: Date) {
    this._startTime = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get status(): number {
    return this._status;
  }

  set status(value: number) {
    this._status = value;
  }

  get responseText(): string {
    return this._responseText;
  }

  set responseText(value: string) {
    this._responseText = value;
  }

  public toJsonString(): string {
    let json = JSON.stringify(this);
    Object.keys(this).filter(key => key[0] === "_").forEach(key => {
      json = json.replace(key, key.substring(1));
    });

    return json;
  }

}
