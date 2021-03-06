"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
/**
 * Created by Garik.Kalashyan on 1/5/2017.
 */
var WelcomePageComponent = (function () {
    function WelcomePageComponent(router) {
        this.router = router;
    }
    WelcomePageComponent.prototype.registerClient = function () {
        this.router.navigate(["/register"]);
    };
    WelcomePageComponent.prototype.registerProvider = function () {
        this.router.navigate(["/register-client-component"]);
    };
    WelcomePageComponent.prototype.signin = function () {
        this.router.navigate(["/register"]);
    };
    WelcomePageComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'wlcPage-component',
            templateUrl: 'wlcPage.component.html',
            styleUrls: ['wlcPage.component.css']
        }),
        __metadata('design:paramtypes', [router_1.Router])
    ], WelcomePageComponent);
    return WelcomePageComponent;
}());
exports.WelcomePageComponent = WelcomePageComponent;
//# sourceMappingURL=wlcPage.component.js.map
