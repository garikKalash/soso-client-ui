import {HttpWrap} from "../_commonServices/httpWrap.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {Injectable} from "@angular/core";
import {ServiceInfoProvider} from "../_commonServices/base-service.service";
import {ConverterUtils} from "../_commonServices/converter.service";
import {ServiceUrlProvider} from "../_commonServices/mode-resolver.service";
/**
 * Created by Home on 3/4/2017.
 */

@Injectable()
export class ClassifierService {
  private myUrl:string = ServiceUrlProvider.getCommonDataServiceUrl();

  constructor(private httpWrap: HttpWrap) {

  }

  public getGeneralServices(): Observable<string> {
    return this.httpWrap.get(this.myUrl + 'commonData/getSosoServices/-1')
      .map((response: Response) => response.text());
  }

  public getSubServices(parentId:number): Observable<string> {
    return this.httpWrap.get(this.myUrl + '/commonData/getSosoServices/'+parentId)
      .map((response: Response) => response.text());
  }

  public getUrl():string{
    return this.myUrl;
  }


}
