import {Injectable} from "@angular/core";
import {Client} from "../_models/client.model";
import {HttpWrap} from "../_commonServices/httpWrap.service";

@Injectable()
export class ClientValidator{


  constructor(private httpWrap:HttpWrap){

  }

  validateNewClient(client:Client):any{
    let infoProvider:any = <any>{}
    if(client.name === null || client.name === undefined || client.name.length === 0 ){
      infoProvider.namemessage = "Name is required."
    }else if(client.name.length === 3){
      infoProvider.namemessage = "Length of name should be more than 3."
    }

    if(client.telephone === null || client.telephone === undefined || client.telephone.length === 0 ){
      infoProvider.telephonemessage = "Telephone is required."
    }else if(client.name.length === 3){
      infoProvider.telephonemessage = "Length of telephone should be more than 3."
    }





  }
}
