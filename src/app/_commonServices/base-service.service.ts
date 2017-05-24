/**
 * Created by Home on 3/4/2017.
 */
import {Injectable} from "@angular/core";
import {HttpWrap} from "./httpWrap.service";

@Injectable()
export class ServiceInfoProvider {
  public _serviceId: number;

  //for live http://pure-badlands-72083.herokuapp.com/
  public _serviceBaseUrl: string = "https://localhost:9011/";

  constructor(public  httpWrap: HttpWrap) {

  }

}
