/**
 * Created by Home on 3/4/2017.
 */
import {Injectable} from "@angular/core";
import {HttpWrap} from "./httpWrap.service";

@Injectable()
export class ServiceInfoProvider {
  private _serviceId: number;

  //for live http://pure-badlands-72083.herokuapp.com/
  private _serviceBaseUrl: string = "http://localhost:9011/";

  constructor(private  httpWrap: HttpWrap) {

  }

}
