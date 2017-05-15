import {Partner} from "../_models/partner.model";
import {Service} from "../_models/service.model";
import {CountryCode} from "../_models/countryCode.model";
import {Client} from "../_models/client.model";
import {Feedback} from "../_models/feedback.model";
import {Request} from "../_models/request.model";
import {Event} from "../_models/event.model";


/**
 * Created by Garik Kalashyan on 3/4/2017.
 */

export class ConverterUtils {
  public static getTokenFromJsonString(jsonString: string): string {
    return <string>JSON.parse(jsonString)["token"];
  }

  public static getServiceUrlFromJsonString(jsonString: string): string {
    return <string>JSON.parse(jsonString)["serviceDetail"]["url"];
  }

  public static getAccountImageBase64FromJsonString(jsonString: string): string {
    return <string>JSON.parse(jsonString)["accountImage"];
  }

  public static partnerFromJson(responseJson: string): Partner {
    return <Partner>(JSON.parse(responseJson)["partner"]);
  }

  public static partnersFromJson(responseJson: string): Partner[] {
    let partners: Partner[] = [];
    for (let node of JSON.parse(responseJson)["partners"]) {
      node.averageRate = ConverterUtils.getAverageRateForFeedbacks(node.feedbacks);
      partners.push(node);
    }
    for(let partner of partners){
      partner.imagesView = [];
      for(let image of partner.photoDtos){
        partner.imagesView.push({source:image.image_path, thumbnail: image.image_path});
      }
    }
    return partners;

  }

  public static requestFromJsonString(jsonString:string,key:string):Request{
    return <Request>JSON.parse(jsonString)[key];
  }

  public static eventsFromJson(responseJson: string): Event[] {
    let events: Event[] = [];
    for (let node of JSON.parse(responseJson)["events"]) {
      events.push(node);
    }
    return events;

  }

  private static  getAverageRateForFeedbacks(feedbacks: Feedback[]): number {
    let averageRate: number = 0;
    if (feedbacks.length != 0) {
      for (let feedback of feedbacks) {
        averageRate += feedback.rate;
      }
      averageRate = averageRate / feedbacks.length;
    }
    return averageRate;
  }


  public static clientFromJson(responseJson: string): Client {
    return <Client>(JSON.parse(responseJson)["client"]);
  }

  public static newClientIdFromJson(responseJson: string): string {
    return (JSON.parse(responseJson)["newClientId"]);
  }

  public static clientIdFromJson(responseJson: string): string {
    return (JSON.parse(responseJson)["clientId"]);
  }


  public static getPartnerPhotosInBase64FromJsonString(jsonString: string): string[] {
    let photosINBase64: string[] = [];

    JSON.parse(jsonString)["photos"]["image"].forEach((node: any) => {
      photosINBase64.push(node.toString());
    });
    return photosINBase64;
  }

  public static countryCodesFromJson(responseJson: string): CountryCode[] {
    let countryCodeList: CountryCode[] = [];
    JSON.parse(responseJson)["phoneCodes"].forEach((node: any) => {
      countryCodeList.push(new CountryCode(node.id,
        node.iso,
        node.nicename,
        node.iso3,
        node.name,
        node.numcode,
        node.phonecode));
    });
    return countryCodeList;
  }

  public static servicesFromJson(responseJson: string): Service[] {
    let serviceList: Service[] = [];
    JSON.parse(responseJson)["sosoServices"].forEach((node: any) => {
      serviceList.push(new Service(node.id,
        node.serviceName_eng,
        node.serviceName_arm,
        node.imgpath));
    });
    return serviceList;
  }

  public static reservationsFromJson(responseJson: string): Request[] {
    let requestList: Request[] = [];
    JSON.parse(responseJson)["reservations"].forEach((node: any) => {
      let date = new Date(node.startTime);

      requestList.push(new Request(node.id,
        node.clientId,
        node.partnerId,
        date,
        node.description,
        node.status,
        node.responseText,
        node.duration,
        node.serviceId,
        node.israted));

    });
    return requestList;
  }

  public static getRequesTypeString(): string {
    let json = JSON.stringify(this);
    Object.keys(this).filter(key => key[0] === "_").forEach(key => {
      json = json.replace(key, key.substring(1));
    });

    return json;
  }

}
