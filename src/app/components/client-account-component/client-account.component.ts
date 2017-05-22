import {Component, OnInit, SecurityContext, Sanitizer, ViewEncapsulation} from "@angular/core";
import {Client} from "../../_models/client.model";
import {ClientService} from "../../_services/client.service";
import {ConverterUtils} from "../../_commonServices/converter.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Service} from "../../_models/service.model";
import {ClassifierService} from "../../_services/classifier.service";
import {SelectItem} from "primeng/primeng";
import {Partner} from "../../_models/partner.model";
import {PartnerService} from "../../_services/partner.service";
import {LocationService} from "../../_services/location.service";
import {ScheduleService} from "../../_services/schedule.service";
import {Request} from "../../_models/request.model";
import {AuthenticationService} from "../../_services/authentication.service";
import {EventListenerService} from "../../_services/event-listener.service";
import {Event} from "../../_models/event.model";
import {Feedback} from "../../_models/feedback.model";
import {PartnerServiceDetail} from "../../_models/partner-service-detail.model";
import {ServiceUrlProvider} from "../../_commonServices/mode-resolver.service";
import {TranslateService} from "../../translate/translate.service";


@Component({
  moduleId: module.id,
  templateUrl: './client-account.component.html',
  selector: 'client-account',
  styleUrls: ['client-account.component.css']
})
export class ClientAccountComponent implements OnInit {
  private _client: Client = <Client>{};
  private _services: Service[];

  private _servicesAsSelectItems: SelectItem[];
  private _selectedService: Service = <Service>{};

  private _filteredPartnersByService: Partner[];
  private _showAvailableServices:boolean = false;

  private _selectedPartner: Partner = <Partner>{};
  private _reservePartner: boolean = false;

  private _showPartnerImages: boolean = false;
  private _imagesForView: any[];

  private _showPartnerFeedbacks: boolean = false;
  private _showLocation: boolean = true;

  private _partnerServicesAsSelectItems: SelectItem[] = [];

  private header: any = {left: 'prev,next', center: 'title', right: 'agendaDay,agendaWeek,month'};

  private _newFeedback: Feedback = <Feedback>{};

  private _searchTerm: string = '';

  private _selectedRadiusForSearch: number = 10;


  constructor(private partnerService: PartnerService,
              private _translate: TranslateService,
              private classierService: ClassifierService,
              private sanitizer: Sanitizer,
              private clientService: ClientService,
              private activatedRoute: ActivatedRoute,
              private locationService: LocationService,
              private scheduleService: ScheduleService,
              private authenticationService: AuthenticationService,
              private eventListenerService: EventListenerService) {

  }

  ngOnInit(): void {
    this.authenticationService.checkSignedClient();
    this.intiClient();
    this.initServices();
    this.locationService.initMapDetails();
  }

  deleteEvent(request: Request) {
    this.scheduleService.deleteReservation(request.id, this._client.id);
    this.scheduleService.initReservationsForClient(this._client.id, 2);

  }

  showAvailableServices(){
    this._showAvailableServices = true;
  }

  hideAvailableServices(){
    this._showAvailableServices = false;
  }

  soso(): void {
    if (this.selectedService != null) {
      this.partnerService.getPartnersByServiceId(this.selectedService._id).subscribe(data => {
        this._filteredPartnersByService = ConverterUtils.partnersFromJson(data);

      });
    } else {
      this._filteredPartnersByService = [];
    }
  }



  filterSosoResult(): void {
    if (this._searchTerm !== null && this._searchTerm.length != 0) {
      this.partnerService.getPartnersByServiceTermId(this.selectedService._id, this._searchTerm).subscribe(data => {
        this._filteredPartnersByService = ConverterUtils.partnersFromJson(data);
      });
    } else {
      this.partnerService.getPartnersByServiceId(this.selectedService._id).subscribe(data => {
        this._filteredPartnersByService = ConverterUtils.partnersFromJson(data);
      });
    }
  }

  setAndFilterService(service: Service) {
    this.selectedService = service;
    this.soso();
  }

  private _isWatchingPartnerServices: boolean = false;

  showPartnerServices(partner:Partner){
    this.selectedPartner = partner
    this.prepareServiceNames(partner.serviceId)

  }

  prepareServiceNames(parentServiceId:number){
    this.classierService.getSubServices(parentServiceId).subscribe(
      data=>{
        let services:Service[] = ConverterUtils.servicesFromJson(data);
        for(let service of services){
          for(let serviceDetail of this.selectedPartner.services){
            if(service._id === serviceDetail.serviceId){
              serviceDetail.service = service;
            }
          }
        }
        this._isWatchingPartnerServices = true;
      }
    )
  }

  onServicesDetailClose(){
    this._isWatchingPartnerServices = false;
  }

  get acceptedRequests(): Request[] {
    return this.scheduleService.acceptedRequests;
  }

  get unAcceptedRequests(): Request[] {
    return this.scheduleService.unAcceptedRequests;
  }

  get completedRequests(): Request[] {
    return this.scheduleService.completedRequests;
  }


  showLocationPicker() {
    this._showLocation = true;
  }

  closeLocationPicker() {
    this._showLocation = false;
  }

  mapLongitude(): number {
    return this.locationService.longitude;
  }

  mapLatitude(): number {
    return this.locationService.latitude;
  }

  mapZoom(): number {
    return this.locationService.zoom;
  }

  distanceToPartner(partner: Partner): number {
    return +this.locationService.getDistanceToPartner(partner);
  }


  addressMarkerDragEnd(event: any): void {
    this.locationService.longitude = event.coords.lng;
    this.locationService.latitude = event.coords.lat;
    this.locationService.getAddressByCoordinates(event.coords.lat, event.coords.lng)
      .subscribe(
        data => {
          for (let node of JSON.parse(data)["results"]) {
            this.locationService.selectedAddress = node.formatted_address;
            break;
          }

        }
      )
  }

  mySelectedLocation(): string {
    return this.locationService.selectedAddress;
  }

  setSelectedPartnier(partner: Partner) {
    this.selectedPartner = partner;
    this.scheduleService.initReservationsForPartner(this.selectedPartner.id, 1);
    this.initPartnerServicesAsSelectItems();
    this._reservePartner = true;
  }

  closeSelectedPartnierDetails() {
    this._reservePartner = false;
  }

  initPartnerServicesAsSelectItems(): void {
    this.classierService.getSubServices(this.selectedPartner.serviceId).subscribe(
      data => {
        let services: Service[] = ConverterUtils.servicesFromJson(data);
        this.selectedPartner.hasSubServices = this.selectedPartner.services.length != 0;
        this._partnerServicesAsSelectItems = [];
        this._partnerServicesAsSelectItems.push({label: '-- Select service --', value: null});
        this.selectedPartner.services.forEach(partnerService => {
          for (let service of services) {
            if (partnerService.serviceId === service._id) {
              this._partnerServicesAsSelectItems.push({label: service._serviceName_arm, value: partnerService});
            }
          }
        });
      }
    );
  }

  get hasSubServices(): boolean {
    return this.selectedPartner.services.length !== 0;
  }

  private _hasAcceptedRequest: boolean;


  get hasAcceptedRequest(): boolean {
    this._hasAcceptedRequest = this.eventListenerService.thereIsAcceptedEvent;
    return this.eventListenerService.thereIsAcceptedEvent;
  }

  public needSoso:boolean = true;

  changePageContentToRequests(){
    this.needSoso = false;
  }

  changePageContentToSearch(){
    this.needSoso = true;
  }


  set hasAcceptedRequest(value: boolean) {
    this._hasAcceptedRequest = value;
  }

  acceptedEvents(): Event[] {
    return this.eventListenerService.acceptedEvents;
  }

  private _hasDoneRequest: boolean;

  get hasDoneRequest(): boolean {
    this._hasDoneRequest = this.eventListenerService.thereIsDoneEvent;
    return this.eventListenerService.thereIsDoneEvent;
  }


  set hasDoneRequest(value: boolean) {
    this._hasDoneRequest = value;
  }

  doneEvents(): Event[] {
    return this.eventListenerService.doneEvents;
  }

  closeDoneRequests(): void {
    this.eventListenerService.deleteDoneEventsFromClient();
    this.scheduleService.initReservationsForClient(this._client.id, 3);
  }

  closeAcceptedRequests(): void {
    this.eventListenerService.deleteAcceptedEventsFromPartner();
    this.scheduleService.initReservationsForClient(this._client.id, 1);
  }


  showSelectedPartnerDetails(partner: Partner) {
    this.selectedPartner = partner;
    for (let path of partner.photoDtos) {
      this._imagesForView = [];
      this._imagesForView.push({source: this.safeImage(path.image_path), thumbnail: this.safeImage(path.image_path)});
    }
    this._showPartnerImages = true;
  }

  showSelectedPartnerFeedbacks(partner: Partner) {
    this.selectedPartner = partner;
    this._showPartnerFeedbacks = true;
  }

  closePartnerDetails() {
    this._showPartnerImages = false;
  }

  closePartnerFeedbacks() {
    this._showPartnerFeedbacks = false;
  }

  servicePhoto(serviceId) : string{
    return serviceId !== undefined ? this.safeImage(ServiceUrlProvider.getCommonDataServiceUrl() + 'commonData/servicephoto/' + serviceId) : this.safeImage(null);
  }

  safeImage(imgBase64: string) {
    if (imgBase64 === undefined || imgBase64 === null) {
      return this.sanitizer.sanitize(SecurityContext.URL, `http://phylo.cs.mcgill.ca/assets/img/loading.gif`);
    }
    return this.sanitizer.sanitize(SecurityContext.URL, `${imgBase64}`);
  }

  intiClient(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let clientId = +params['clientId'];
      this.clientService.getClientById(clientId).subscribe(data => {
        this._client = ConverterUtils.clientFromJson(data);
        this.scheduleService.initAllRequestsOfClient(this._client.id);
        this.eventListenerService.autoCheckAcceptedEvents(this._client.id);
        this.eventListenerService.autoCheckDoneEvents(this._client.id);
        this._selectedRadiusForSearch = 10;
        setInterval(() => {
          this.eventListenerService.autoCheckAcceptedEvents(this._client.id);
          this.eventListenerService.autoCheckDoneEvents(this._client.id);
        }, 10 * 1000)
      });
    });
  }


  initServices(): void {
    this.classierService.getGeneralServices().subscribe(

      data => {
        this._servicesAsSelectItems = [];

        this._services = ConverterUtils.servicesFromJson(data);
        this._servicesAsSelectItems.push({label: this._translate.currentLang === 'en' ? '-- Choose one service --' : '-- Ընտրեք ծառայությունը --' , value: null});
        this.selectedService = this._servicesAsSelectItems[0].value;
        for (let service of this._services) {
          this._servicesAsSelectItems.push({label: service._serviceName_arm, value: service});
        }
      }
    )
  }



  newRequest(): Request {
    return this.scheduleService.newReserve;
  }

  selectedRequest(): Request {
    return this.scheduleService.selectedEvent;
  }

  private _isWrongDurationNewRequest: boolean = false;
  private _crossedRequestDurationNewRequest: Request;
  private _crossedRequestStartNewRequest: Request;


  newReserveEvent(): void {
    this.scheduleService.newReserve.partnerId = this.selectedPartner.id;
    this.scheduleService.newReserve.clientId = this._client.id;
    this.scheduleService.newReserve.status = 2; // it is mean is new requested
    this.scheduleService.newReserve.startTime.setHours(this.scheduleService.newReserve.newRequestStartTime.getHours());
    this.scheduleService.newReserve.startTime.setMinutes(this.scheduleService.newReserve.newRequestStartTime.getMinutes());
    if (this.scheduleService.newReserve.service) {
      this.scheduleService.newReserve.serviceId = this.scheduleService.newReserve.service.serviceId;
    }
    let request: Request = this.newRequest();
    this.scheduleService.addEvent(request).subscribe((data: string) => {
      this._isWrongDurationNewRequest = JSON.parse(data)["isWrongDuration"] === 'true';
      this._crossedRequestDurationNewRequest = ConverterUtils.requestFromJsonString(data,"crossedRequestDuration");
      this._crossedRequestStartNewRequest = ConverterUtils.requestFromJsonString(data,"crossedRequestStart");


      if (this._crossedRequestDurationNewRequest === undefined && this._crossedRequestStartNewRequest === undefined && !this._isWrongDurationNewRequest) {
        this.scheduleService.initReservationsForPartner(request.partnerId, 1);
        this.scheduleService.creatingEventDetails = false;
        this.scheduleService.newReserve.newRequestStartTime = null;
        this.scheduleService.initReservationsForClient(request.clientId, 2);
      }
    });
  }

  cancelAddingCustomEvent(): void {
    this.scheduleService.creatingEventDetails = false;

  }

  closeEventDetails(): void {
    this.scheduleService.showEventDetails = false;
  }

  getSchedule(): any[] {
    return this.scheduleService.schedule;
  }

  showEventDetails(): boolean {
    return this.scheduleService.showEventDetails;
  }

  createEvent(): boolean {
    return this.scheduleService.creatingEventDetails;
  }


  onEventClickHandler(event: any): void {
    this.scheduleService.handleEventClick(event);
  }

  onDayClickHandler(event: any): void {
    let now: Date = new Date();
    let eventDay: Date = event.date._d;


      this.scheduleService.handleDayClick(event);

  }

  logout(): void {
    this.clientService.logout(this._client);
  }

  private _isRatedFalseFrom: boolean = false;


  addFeedBack(event: any): void {
    if (this._newFeedback.rate === undefined || this._newFeedback.rate === null || this._newFeedback.rate === 0) {
      this._isRatedFalseFrom = true;
    } else {

      this._newFeedback.clientId = event.clientId;
      this._newFeedback.partnerId = event.partnerId;
      this._newFeedback.requestId = event.requestId;
      let feedbackObj: Feedback = new Feedback(null, this._newFeedback.rate, this._newFeedback.context,
        this._newFeedback.clientId, this._newFeedback.partnerId,
        this._newFeedback.requestId);
      let data: string = feedbackObj.toJsonString();
      this.partnerService.addFeedbackToPartnier(data).subscribe(
        () => {
          if (this.eventListenerService.thereIsDoneEvent === true) {
            this.eventListenerService.thereIsDoneEvent = false;
            this.eventListenerService.deleteDoneEventsFromClient();
            this._newFeedback = <Feedback>{};
            this._isRatedFalseFrom = false;
          }
        }
      );
    }
  }


  private completedRequest: Request = <Request>{};
  private _isLeavingFeedback: boolean = false;

  private _newFeedbackFromOrdersFalseRated: boolean = false;
  private _newFeedbackFromOrders: Feedback = <Feedback>{};

  setCompletedRequest(request: Request) {
    this.completedRequest = request;
    this._isLeavingFeedback = true;
  }

  addFeedbackFromOrders(request: Request) {
    if (this._newFeedbackFromOrders.rate === undefined || this._newFeedbackFromOrders.rate === null || this._newFeedbackFromOrders.rate === 1) {
      this._newFeedbackFromOrdersFalseRated = true;
    } else {

      this._newFeedbackFromOrders.clientId = request.clientId;
      this._newFeedbackFromOrders.partnerId = request.partnerId;
      this._newFeedbackFromOrders.requestId = request.id;
      let feedbackObj: Feedback = new Feedback(null, this._newFeedbackFromOrders.rate, this._newFeedbackFromOrders.context,
        this._newFeedbackFromOrders.clientId, this._newFeedbackFromOrders.partnerId,
        this._newFeedbackFromOrders.requestId);
      let data: string = feedbackObj.toJsonString();
      this.partnerService.addFeedbackToPartnier(data).subscribe(
        () => {
          this._isLeavingFeedback = false;
          this._newFeedbackFromOrders = <Feedback>{};
          this.scheduleService.initReservationsForClient(this._client.id, 3);
          this._newFeedbackFromOrdersFalseRated = false;
        }
      );
    }
  }


  get services(): Service[] {
    return this._services;
  }

  set services(value: Service[]) {
    this._services = value;
  }

  get selectedPartner(): Partner {
    return this._selectedPartner;
  }

  set selectedPartner(value: Partner) {
    this._selectedPartner = value;
  }

  get selectedService(): Service {
    return this._selectedService;
  }

  set selectedService(value: Service) {
    this._selectedService = value;
  }

  isReady():boolean{
    return !!(this._services && this._client);

  }
}
