import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  homePageLoginPopup = false
  homePagePassRecoveryPopup = false
  registrTermsOfUsePopup = false

  constructor() { }

  toggleLoginPopup() {
    this.homePageLoginPopup = !this.homePageLoginPopup
  }

  togglePassRecoveryPopup() {
    this.homePagePassRecoveryPopup = !this.homePagePassRecoveryPopup
  }
  
  toggleTermsOfUsePopup() {
    this.registrTermsOfUsePopup = !this.registrTermsOfUsePopup
  }

  toggleLoginAndPass() {
    this.toggleLoginPopup()
    this.togglePassRecoveryPopup()
  }

}

