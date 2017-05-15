import {Component, OnInit, SecurityContext, Sanitizer} from '@angular/core';
import {TranslateService} from "./translate/translate.service";
import {MenuItem} from "primeng/components/common/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public supportedLanguages:any[];

  constructor(private _translate: TranslateService,private sanitizer: Sanitizer) { }

  ngOnInit() {
    // standing datad
    this.supportedLanguages = [
      { display: 'Հայերեն', value: 'am', flagpath:"http://flagpedia.net/data/flags/mini/am.png" },
      { display: 'English', value: 'en', flagpath:"http://flagpedia.net/data/flags/mini/gb.png" },
    ];

    this.selectLang('am');

  }

  isCurrentLang(lang: string) {
    return lang === this._translate.currentLang;
  }

  selectLang(lang: string) {
    // set default;
    this._translate.use(lang);

  }


}
