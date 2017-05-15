/**
 * Created by Home on 12/28/2016.
 */
import {Component, OnInit} from "@angular/core";
import {Client} from "../../_models/client.model";
import {ClientService} from "../../_services/client.service";
import {ConverterUtils} from "../../_commonServices/converter.service";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  templateUrl: './login.component.html',
  selector: 'login-component',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  _clientModel: Client = <Client>{};

  _isShortTelephone: boolean = false;
  _isInvalidPassword: boolean = false;
  _wrongclient: boolean = false;


  ngOnInit(): void {
  }

  constructor(private router: Router, private clientService: ClientService) {

  }


  signin(): void {
    this.clientService.signin(this._clientModel).subscribe(
      data => {
        this._isShortTelephone = JSON.parse(data)["isShortTelephone"] === 'true';
        this._isInvalidPassword = JSON.parse(data)["isInvalidPassword"] === 'true';
        this._wrongclient = JSON.parse(data)["wrongclient"] === 'true';

        if (!this._isShortTelephone && !this._isInvalidPassword && !this._wrongclient) {
          this._clientModel.id = +ConverterUtils.clientIdFromJson(data);
          this.clientService.getAndPutToken(this._clientModel);
        }
      });
  }
}

