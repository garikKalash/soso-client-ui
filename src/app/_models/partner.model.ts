import {Feedback} from "./feedback.model";
import {Client} from "./client.model";
import {PartnerServiceDetail} from "./partner-service-detail.model";
import {Photo} from "./photo.model";
/**
 * Created by Home on 3/4/2017.
 */
export class Partner {
  get reservable(): boolean {
    return this._reservable;
  }

  set reservable(value: boolean) {
    this._reservable = value;
  }
  get averageRate(): number {
    return this._averageRate;
  }

  set averageRate(value: number) {
    this._averageRate = value;
  }
  get serviceName(): string {
    return this._serviceName;
  }

  set serviceName(value: string) {
    this._serviceName = value;
  }

  get imgpath(): string {
    return this._imgpath;
  }


  get photoDtos(): Photo[] {
    return this._photoDtos;
  }

  set photoDtos(value: Photo[]) {
    this._photoDtos = value;
  }

  set imgpath(value: string) {
    this._imgpath = value;
  }
  public _id: number;
  public _name: string;
  public _telephone: string;
  public _serviceId: number;
  public _serviceName:string;
  public _username: string;
  public _password: string;
  public _address: string;
  public _feedbacks: Feedback[];
  public _photoDtos: Photo[] = [];

  public _notices: string;
  public _followers: string[];
  public _longitude: number;
  public _latitude: number;
  public _imgpath: string;
  public _averageRate: number;
  public _reservable:boolean;
  public _services:PartnerServiceDetail[] = [];
  public _hasSubServices:boolean;
  public _imagesView:any[] = [];

  constructor(id: number,
              number: string,
              telephone: string,
              serviceId: number,
              username: string,
              password: string,
              notices:string,
              longitute: number,
              latitude:number,
              reservable:boolean) {
    this._id = id;
    this._name = number;
    this._telephone = telephone;
    this._serviceId = serviceId;
    this._username = username;
    this._password = password;
    this._longitude = longitute;
    this._latitude = latitude;
    this._notices = notices;
    this._reservable = reservable;
  }

  get longitude(): number {
    return this._longitude;
  }

  set longitude(value: number) {
    this._longitude = value;
  }

  get latitude(): number {
    return this._latitude;
  }


  get imagesView(): any[] {
    return this._imagesView;
  }

  set imagesView(value: any[]) {
    this._imagesView = value;
  }

  get hasSubServices(): boolean {
    return this._hasSubServices;
  }

  set hasSubServices(value: boolean) {
    this._hasSubServices = value;
  }


  set latitude(value: number) {
    this._latitude = value;
  }


  get services(): PartnerServiceDetail[] {
    return this._services;
  }

  set services(value: PartnerServiceDetail[]) {
    this._services = value;
  }

  get address(): string {
    return this._address;
  }

  set address(value: string) {
    this._address = value;
  }

  get feedbacks(): Feedback[] {
    return this._feedbacks;
  }

  set feedbacks(value: Feedback[]) {
    this._feedbacks = value;
  }

  get notices(): string {
    return this._notices;
  }

  set notices(value: string) {
    this._notices = value;
  }

  get followers(): string[] {
    return this._followers;
  }

  set followers(value: string[]) {
    this._followers = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get telephone(): string {
    return this._telephone;
  }

  set telephone(value: string) {
    this._telephone = value;
  }

  get serviceId(): number {
    return this._serviceId;
  }

  set serviceId(value: number) {
    this._serviceId = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }
}
