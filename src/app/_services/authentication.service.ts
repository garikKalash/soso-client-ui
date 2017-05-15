import {Injectable} from "@angular/core";
import {HttpWrap} from "../_commonServices/httpWrap.service";
import {Router} from "@angular/router";
import {Client} from "../_models/client.model";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {ConverterUtils} from "../_commonServices/converter.service";
import {ServiceInfoProvider} from "../_commonServices/base-service.service";
import {ServiceUrlProvider} from "../_commonServices/mode-resolver.service";
/**
 * Created by Home on 3/4/2017.
 */
@Injectable()
export class AuthenticationService {
  private myUrl:string = ServiceUrlProvider.getAuthenticationServiceUrl();


  constructor(private httpWrap: HttpWrap,
              private router: Router) {

  }

  checkSignedClient(){
    let client:Client = (<Client>JSON.parse(localStorage.getItem("soso_registered_client_details")));
    if(client){
      let token:string = localStorage.getItem("soso_client_token")
      HttpWrap.getHeaders().set('token',token);
      HttpWrap.getHeaders().set('clientId',new String(client.id).toString());
      this.router.navigate(["/clientaccount"],{queryParams: {clientId: +client.id}});
    }else{
      this.router.navigate(["/home"]);
    }

  }

 /* signin(client:Client):void{
    this.signinReq(client).subscribe(
      data =>{
        client.id = +ConverterUtils.clientIdFromJson(data);
        let token =  ConverterUtils.getTokenFromJsonString(data);
        this.getAndPutToken(client);

      });
  }
*/
  signin(client:Client):Observable<string>{
   return this.signinReq(client);
  }

  signup(client:Client):Observable<string>{
    return this.registerReq(client);
  }

  logout(client:Client):void{
    this.logoutReq(client).subscribe(
      ()=>{
        this.deleteToken(client);
      }
    )
  }

  private signinReq(client:Client):Observable<string>{
    let data = JSON.stringify(client);
    return this.httpWrap.post(ServiceUrlProvider.getClientServiceUrl() + 'client/signinclient/',data)
      .map((response: Response) => response.text());
  }

  private registerReq(client:Client):Observable<string>{
    let data = JSON.stringify(client);
    return this.httpWrap.post(ServiceUrlProvider.getClientServiceUrl() + 'client/addclient/',data)
      .map((response: Response) => response.text());
  }

  private logoutReq(client:Client):Observable<string>{
    let data = JSON.stringify(client);
    return this.httpWrap.delete(ServiceUrlProvider.getAuthenticationServiceUrl() + 'authenticateService/deleteToken/1/'+client.id+'/'+HttpWrap.getHeaders().get('token'))
      .map((response: Response) => response.text());
  }

  getAndPutToken(client:Client):void {
    this.httpWrap.get(ServiceUrlProvider.getAuthenticationServiceUrl() + "authenticateService/getToken/1/" + client.id + "/" + client.telephone).map(
      (response: Response) => response.text()).subscribe(
      data => {
        let token: string = JSON.parse(data)["createdToken"]["key"];
        HttpWrap.getHeaders().set('token', token);
        localStorage.setItem("soso_client_token",token);
        HttpWrap.getHeaders().set('clientId',ConverterUtils.clientIdFromJson(data));
        localStorage.setItem("soso_registered_client_details",JSON.stringify(client));
        this.router.navigate(["/clientaccount"],{queryParams: {clientId: +client.id}});
      }
    )
  }

  private deleteToken(client:Client):void{
      this.httpWrap.delete(ServiceUrlProvider.getAuthenticationServiceUrl() + "authenticateService/deleteToken/1/"+client.id+"/"+HttpWrap.getHeaders().get('token')).map(
      (response:Response) =>response.text()).subscribe(
      data=>{
        HttpWrap.getHeaders().set('token','');
        HttpWrap.getHeaders().set('clientId','');
        localStorage.removeItem("soso_client_token");
        localStorage.removeItem("soso_registered_client_details");
        this.router.navigate(["/home"]);
      }
    )
  }


  }
