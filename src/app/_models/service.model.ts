/**
 * Created by Home on 3/4/2017.
 */
export class Service {
  private id: number;
  private serviceName_eng: string;
  private serviceName_arm: string;
  private _imgpath: string;

  constructor(id: number, servicename_eng: string, servicename_arm: string, imgpath: string) {
    this.id = id;
    this.serviceName_eng = servicename_eng;
    this.serviceName_arm = servicename_arm;
    this._imgpath = imgpath;
  }

  get _id(): number {
    return this.id;
  }

  set _id(value: number) {
    this.id = value;
  }

  get _serviceName_eng(): string {
    return this.serviceName_eng;
  }

  set _serviceName_eng(value: string) {
    this.serviceName_eng = value;
  }

  get _serviceName_arm(): string {
    return this.serviceName_arm;
  }

  set _serviceName_arm(value: string) {
    this.serviceName_arm = value;
  }


  get imgpath(): string {
    return this._imgpath;
  }

  set imgpath(value: string) {
    this._imgpath = value;
  }
}
