import {Injectable} from "@angular/core";
import {Request} from "../_models/request.model";
import {HttpWrap} from "../_commonServices/httpWrap.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {ConverterUtils} from "../_commonServices/converter.service";
import {PartnerService} from "./partner.service";
import {Partner} from "../_models/partner.model";


@Injectable()
export class ScheduleService {
  private _newReserve: Request = <Request>{};

  private _schedule: any[] = [];
  private _requestsOfPartner: Request[] = [];
  private _selectedEvent: Request = <Request>{};

  private _showEventDetails: boolean = false;
  private _creatingEventDetails: boolean = false;

  private _acceptedRequests: Request[];
  private _unAcceptedRequests: Request[];
  private _completedRequests: Request[];

  constructor(private httpWrap: HttpWrap, private partnerService: PartnerService) {

  }


  get requestsOfPartner(): Request[] {
    return this._requestsOfPartner;
  }

  set requestsOfPartner(value: Request[]) {
    this._requestsOfPartner = value;
  }

  get acceptedRequests(): Request[] {
    return this._acceptedRequests;
  }

  set acceptedRequests(value: Request[]) {
    this._acceptedRequests = value;
  }

  get unAcceptedRequests(): Request[] {
    return this._unAcceptedRequests;
  }

  set unAcceptedRequests(value: Request[]) {
    this._unAcceptedRequests = value;
  }

  get completedRequests(): Request[] {
    return this._completedRequests;
  }

  set completedRequests(value: Request[]) {
    this._completedRequests = value;
  }

  get newReserve(): Request {
    return this._newReserve;
  }

  set newReserve(value: Request) {
    this._newReserve = value;
  }


  get schedule(): any[] {
    return this._schedule;
  }

  set schedule(value: any[]) {
    this._schedule = value;
  }


  get selectedEvent(): Request {
    return this._selectedEvent;
  }

  set selectedEvent(value: Request) {
    this._selectedEvent = value;
  }


  get showEventDetails(): boolean {
    return this._showEventDetails;
  }

  set showEventDetails(value: boolean) {
    this._showEventDetails = value;
  }


  get creatingEventDetails(): boolean {
    return this._creatingEventDetails;
  }

  set creatingEventDetails(value: boolean) {
    this._creatingEventDetails = value;
  }

  initAllRequestsOfClient(clientId: number): void {
    this.initReservationsForClient(clientId, 2);
    this.initReservationsForClient(clientId, 1);
    this.initReservationsForClient(clientId, 3);

  }

  addEvent(request: Request): Observable<string> {
    return this.saveReservation(request)


  }

  handleEventClick(e) {
    this.selectedEvent = <Request>{};
    this.selectedEvent.description = e.calEvent.title;
    let start = e.calEvent.start;
    let end = e.calEvent.end;
    this.selectedEvent.id = e.calEvent.id;
    this.selectedEvent.startTime = start.format();
    this.showEventDetails = true;
  }

  handleDayClick(event: any) {
    this.newReserve = <Request>{};
    this.newReserve.newRequestStartTime = new Date();
    this.newReserve.startTime = event.date._d;
    this.newReserve.startTime.setHours(this.newReserve.newRequestStartTime.getHours());
    this.newReserve.startTime.setMinutes(this.newReserve.newRequestStartTime.getMinutes());
    this.creatingEventDetails = true;
  }



  findEventIndexById(id: number) {
    let index = -1;
    for (let i = 0; i < this.schedule.length; i++) {
      if (id == this.schedule[i].id) {
        index = i;
        break;
      }
    }

    return index;
  }

  initReservationsForClient(clientId: number, status: number): void {
    this.getReservationsForClient(clientId, status).subscribe(data => {
        let requests:Request[] = [];
        if (status === 1) {
          this.acceptedRequests = ConverterUtils.reservationsFromJson(data);
          requests = this.acceptedRequests;
        } else if (status === 2) {
          this.unAcceptedRequests = ConverterUtils.reservationsFromJson(data);
          requests = this.unAcceptedRequests;
        } else if (status === 3) {
          this.completedRequests = ConverterUtils.reservationsFromJson(data);
          requests = this.completedRequests;
        }
        for (let request of requests) {
          this.partnerService.getPartnerMainDetailsById(request.partnerId).subscribe(
            data => {
              request.partner = ConverterUtils.partnerFromJson(data);
            }
          );
        }
      }
    );
  }

  initReservationsForPartner(partnerId: number, status: number): void {
    this.getReservationsForPartner(partnerId, status).subscribe(
      (data: string) => {
        this._requestsOfPartner = ConverterUtils.reservationsFromJson(data);
        this.schedule = [];
        for (let request of this._requestsOfPartner) {
          let endOfRequest = request.startTime.getMinutes() + +request.duration;
          request.endTime = new Date(request.startTime);
          request.endTime.setMinutes(endOfRequest);
          this.schedule.push({
              "id": request.id,
              "clientId": request.clientId,
              "title": request.description,
              "start": request.startTime,
              "end": request.endTime,
              "status": request.status,
              "responseText": request.responseText,
              "duration": request.duration,
              "isRated": request.israted
            }
          )
        }

      }
    );
  }


  getReservationsForPartner(partnerId: number, status: number): Observable<string> {
    return this.httpWrap.get('http://soso-partner.herokuapp.com/partner/reservationsforpartner/' + partnerId + '/' + status)
      .map((response: Response) => response.text());

  }


  getReservationsForClient(clientId: number, status: number): Observable<string> {
    return this.httpWrap.get('http://soso-partner.herokuapp.com/partner/reservationsforclient/' + clientId + '/' + status)
      .map((response: Response) => response.text());

  }


  saveReservation(request: Request): Observable<string> {
    let requesNew: Request = new Request(request.id, request.clientId, request.partnerId, request.startTime, request.description, request.status, request.responseText, request.duration, request.serviceId, request.israted);
    let data: string = requesNew.toJsonString();
    return this.httpWrap.post('http://soso-partner.herokuapp.com/partner/addReserve', data)
      .map((response: Response) => response.text());
  }

  deleteReservation(requestId: number,clientid:number): void {
    this.httpWrap.delete('http://soso-partner.herokuapp.com/partner/deletereserve/' + requestId)
      .map((response: Response) => response.text()).subscribe(data => {
      let index: number = this.findEventIndexById(requestId);
      if (index >= 0) {
        this.schedule.splice(index, 1);
      }
      this.showEventDetails = false;
      this.initReservationsForClient(clientid,2);
    });
  }

  initMyAccpetedRequests() {
  }


}
