import {Injectable} from "@angular/core";
import {HttpWrap} from "../_commonServices/httpWrap.service";
import {ConverterUtils} from "../_commonServices/converter.service";
import {Response} from "@angular/http";
import {Event} from "../_models/event.model";
import {PartnerService} from "./partner.service";
import {Partner} from "../_models/partner.model";
import {ServiceInfoProvider} from "../_commonServices/base-service.service";
import {ServiceUrlProvider} from "../_commonServices/mode-resolver.service";


@Injectable()
export class EventListenerService {
  private myUrl:string = ServiceUrlProvider.getEventListenerServiceUrl();
  private _acceptedEvents: Event[] = [];
  private _thereIsAcceptedEvent: boolean = false;
  private _doneEvents:Event[] = [];

  private _thereIsDoneEvent:boolean = false;
  constructor(private httpWrap: HttpWrap,private partnerService:PartnerService) {

  }

  autoCheckAcceptedEvents(clientId: number): void {
    if (!this._thereIsAcceptedEvent) {
      this.httpWrap.get(this.myUrl+'eventsListener/acceptedeventsbyclient/' + clientId).map((response: Response) => response.text()).subscribe(
        (data: string) => {
          this._acceptedEvents = ConverterUtils.eventsFromJson(data);
          for(let event of this._acceptedEvents){
            this.partnerService.getPartnerMainDetailsById(event.partnerId).subscribe(
              partner=>{
                event.partner =  ConverterUtils.partnerFromJson(partner);
              }
            )
          }

          this._thereIsAcceptedEvent = this._acceptedEvents.length != 0;
        }
      );
    }
  }

  autoCheckDoneEvents(clientId: number): void {
    if (!this._thereIsDoneEvent) {
      this.httpWrap.get(this.myUrl + 'eventsListener/completedeventsbyclient/' + clientId).map((response: Response) => response.text()).subscribe(
        (data: string) => {
          this._doneEvents = ConverterUtils.eventsFromJson(data);
          this._thereIsDoneEvent = this._doneEvents.length != 0;
          if(this._doneEvents.length === 1){
            this.partnerService.getPartnerMainDetailsById(this._doneEvents[0].partnerId).subscribe(
              data=>{
                let partner:Partner =  ConverterUtils.partnerFromJson(data);
                this._doneEvents[0].partner = partner;
              }
            )
          }
        }
      );
    }
  }

  deleteAcceptedEventsFromPartner(): void {
    for (let event of this._acceptedEvents) {
      this.httpWrap.delete(this.myUrl + 'eventsListener/deleteacceptedeventbyclient/' + event.id).map((response: Response) => response.text()).subscribe(
        (data: string) => {
          this._thereIsAcceptedEvent = false;
        }
      );
    }
  }

  deleteDoneEventsFromClient(): void {
    for (let event of this._doneEvents) {
      this.httpWrap.delete(this.myUrl + 'eventsListener/deletedoneeventbypartner/' + event.id).map((response: Response) => response.text()).subscribe(
        (data: string) => {
          this._thereIsDoneEvent = false;
        }
      );
    }
  }

  get thereIsAcceptedEvent(): boolean {
    return this._thereIsAcceptedEvent;
  }

  set thereIsAcceptedEvent(value: boolean) {
    this._thereIsAcceptedEvent = value;
  }

  get doneEvents(): Event[] {
    return this._doneEvents;
  }

  set doneEvents(value: Event[]) {
    this._doneEvents = value;
  }


  get acceptedEvents(): Event[] {
    return this._acceptedEvents;
  }

  set acceptedEvents(value: Event[]) {
    this._acceptedEvents = value;
  }

  get thereIsDoneEvent(): boolean {
    return this._thereIsDoneEvent;
  }

  set thereIsDoneEvent(value: boolean) {
    this._thereIsDoneEvent = value;
  }
}


