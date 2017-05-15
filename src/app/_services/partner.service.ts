import {Injectable} from "@angular/core";
import {HttpWrap} from "../_commonServices/httpWrap.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {ServiceInfoProvider} from "../_commonServices/base-service.service";
import {ConverterUtils} from "../_commonServices/converter.service";
import {ServiceUrlProvider} from "../_commonServices/mode-resolver.service";
/**
 * Created by Home on 3/4/2017.
 */
@Injectable()
export class PartnerService {
  private myUrl:string = ServiceUrlProvider.getPartnerServiceUrl();

  constructor(private httpWrap: HttpWrap) {


  }

  getPartnerById(partnerId: number): Observable<string> {
    return this.httpWrap.get(this.myUrl + "partner/partnerRoom/" + partnerId)
      .map((response: Response) => response.text());
  }

  getPartnerMainDetailsById(partnerId: number): Observable<string> {
    return this.httpWrap.get(this.myUrl + "partner/partnermaindetails/" + partnerId)
      .map((response: Response) => response.text());
  }

  getPartnerImage(partnerId: number): Observable<string> {
    return this.httpWrap.get(this.myUrl + 'partner/accountImage/' + partnerId)
      .map((response: Response) => response.text());
  }

  getPartnerPhotos(partnerId: number): Observable<string> {
    return this.httpWrap.get(this.myUrl + 'partner/partnerPhotos/' + partnerId)
      .map((response: Response) => response.text());
  }

  getPartnersByServiceId(serviceId: number): Observable<string> {
    return this.httpWrap.get(this.myUrl + 'partner/partnerByService/' + serviceId)
      .map((response: Response) => response.text());
  }

  getPartnersByServiceTermId(serviceId: number,searchTerm:string): Observable<string> {
    return this.httpWrap.get(this.myUrl + 'partner/filteredpartners/' + serviceId + '/' + searchTerm)
      .map((response: Response) => response.text());
  }


  savePartnerAddress(data: string) {
    return this.httpWrap.post(this.myUrl + 'partner/saveEditedAddress', data)
      .map((response: Response) => response.text())

  }

  savePartnerNotices(data: string) {
    return this.httpWrap.post(this.myUrl + 'partner/saveEditedNotice', data)
      .map((response: Response) => response.text())

  }

  getPartnerServiceDetails(partnerId: number): Observable<string> {
    return this.httpWrap.get(this.myUrl + 'partner/getservicedetailsforpartner/' + partnerId)
      .map((response: Response) => response.text());
  }

  addFeedbackToPartnier(feedback: string): Observable<string> {
    return this.httpWrap.post(this.myUrl + 'partner/addfeedback', feedback)
      .map((response: Response) => response.text())
  }


}
