import {NgZone, Injectable} from "@angular/core";
import {Response, Http, RequestOptions, ResponseContentType} from "@angular/http";
import {Observable} from "rxjs";
import {Partner} from "../_models/partner.model";
import {MapsAPILoader} from "angular2-google-maps/core";
/**
 * Created by Home on 4/20/2017.
 */

const GET_ADDRESS_OF_MARKER_URL: string = "http://maps.googleapis.com/maps/api/geocode/json?latlng=";
@Injectable()
export class LocationService {
  public latitude: number;
  public longitude: number;
  public zoom: number;


  public selectedAddress: string;

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private http: Http) {

  }

  initMapDetails(): void {

    //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;
    //set current position
    this.setCurrentPosition();

  }

  private setCurrentPosition(): void {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
        this.getAddressByCoordinates(this.latitude, this.longitude).subscribe(
          data => {
            for (let node of JSON.parse(data)["results"]) {
              this.selectedAddress = node.formatted_address;
              break;
            }
          }
        );
      });
    }

  }

  getAddressByCoordinates(lat: number, long: number): Observable<string> {
    let data: string;
    let options = new RequestOptions({responseType: ResponseContentType.Json});

    return this.http.get(GET_ADDRESS_OF_MARKER_URL + lat + "," + long + "&sensor=true", options).map((response: Response) => response.text());
  }

  getDistanceToPartner(partner: Partner): string {

      let partnerslatLng = new google.maps.LatLng(partner.latitude,partner.longitude);
      let myLatLng = new google.maps.LatLng(this.latitude,this.longitude);
      return (google.maps.geometry.spherical.computeDistanceBetween(partnerslatLng, myLatLng)/1000).toFixed(2);

  }
}
