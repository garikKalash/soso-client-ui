import {Injectable} from "@angular/core";
import {HttpWrap} from "../_commonServices/httpWrap.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import "rxjs/Rx";
import {Request} from "../_models/request.model";
import {ConverterUtils} from "../_commonServices/converter.service";
import {AuthenticationService} from "./authentication.service";
import {Client} from "../_models/client.model";
import {ServiceInfoProvider} from "../_commonServices/base-service.service";
import {ServiceUrlProvider} from "../_commonServices/mode-resolver.service";


@Injectable()
export class ClientService {
  private myUrl: string = ServiceUrlProvider.getClientServiceUrl();


  private _myAcceptedRequests: Request[] = [];
  private _myUnacceptedRequests: Request[] = [];
  private _doneRequests: Request[] = [];

  constructor(private httpWrap: HttpWrap, private authenticationService: AuthenticationService) {


  }

  getClientById(clientId: number): Observable<string> {
    return this.httpWrap.get(this.myUrl + "client/clientaccount?clientId=" + clientId)
      .map((response: Response) => response.text());
  }

  getClientMainDetailsById(clientId: number): Observable<string> {
    return this.httpWrap.get(this.myUrl + "client/clientmaindetails/" + clientId)
      .map((response: Response) => response.text());
  }

  initMyAcceptedRequest(clientId: number): void {
    this.getReservationsForClient(clientId, 1).subscribe(
      (data: string) => {
        this._myAcceptedRequests = ConverterUtils.reservationsFromJson(data);
      }
    );
  }

  initUnacceptedRequests(clientId: number): void {
    this.getReservationsForClient(clientId, 2).subscribe(
      (data: string) => {
        this._myUnacceptedRequests = ConverterUtils.reservationsFromJson(data);
      }
    );
  }

  initDoneRequests(clientId: number): void {
    this.getReservationsForClient(clientId, 2).subscribe(
      (data: string) => {
        this._myUnacceptedRequests = ConverterUtils.reservationsFromJson(data);
      }
    );
  }


  getReservationsForClient(clientId: number, status: number): Observable<string> {
    return this.httpWrap.get(this.myUrl + 'partner/reservationsforclient/' + clientId + '/' + status)
      .map((response: Response) => response.text());

  }

  signin(client: Client): Observable<string> {
    return this.authenticationService.signin(client);
  }

  register(client: Client): Observable<string> {
    return this.authenticationService.signup(client);
  }

  logout(client: Client): void {
    this.authenticationService.logout(client);
  }

  getAndPutToken(client: Client): void {
    this.authenticationService.getAndPutToken(client);
  }


  get myAcceptedRequests(): Request[] {
    return this._myAcceptedRequests;
  }

  set myAcceptedRequests(value: Request[]) {
    this._myAcceptedRequests = value;
  }

  get myUnacceptedRequests(): Request[] {
    return this._myUnacceptedRequests;
  }

  set myUnacceptedRequests(value: Request[]) {
    this._myUnacceptedRequests = value;
  }
}
