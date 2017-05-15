import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Service} from "../../_models/service.model";
import {ClassifierService} from "../../_services/classifier.service";
import {Client} from "../../_models/client.model";
import {ClientService} from "../../_services/client.service";
import {ConverterUtils} from "../../_commonServices/converter.service";


@Component({
  moduleId: module.id,
  templateUrl: './connectToSystem.component.html',
  selector: 'connect-to-system-component',
  styleUrls: ['connectToSystem.component.css']
})
export class ConnectToSystemComponent implements OnInit {
  _newClient: Client = <Client>{};
  loading = false;

  private services: Service[] = [];
  private selectedService: string;

  _isShortTelephone: boolean = false;
  _isInvalidPassword: boolean = false;
  _isInvalidName: boolean = false;
  _isUniqueTelephoneError: boolean = false;


  constructor(private router: Router,
              private clientService: ClientService,
              private classifierService: ClassifierService) {
  }

  ngOnInit(): void {
    /*this.services = this.classifierService.getAllServices();
     this.selectedService = this.labelForService(this.services[0]);*/
  }

  register() {

    this.clientService.register(this._newClient).subscribe(
      data => {
        this._isShortTelephone = JSON.parse(data)["isShortTelephone"] === 'true';
        this._isInvalidPassword = JSON.parse(data)["isInvalidPassword"] === 'true';
        this._isInvalidName = JSON.parse(data)["isInvalidName"] === 'true';
        this._isUniqueTelephoneError = JSON.parse(data)["isUniqueTelephoneError"] === 'true';

        if (!this._isShortTelephone && !this._isInvalidPassword && !this._isInvalidName && !this._isUniqueTelephoneError) {
          this._newClient.password = '';
          this._newClient.id = +ConverterUtils.newClientIdFromJson(data);
          this.clientService.getAndPutToken(this._newClient);
        }


      });
  }
}

