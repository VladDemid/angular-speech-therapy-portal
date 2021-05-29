import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  imgName = ""
  imgUrl = "https://storiavoce.com/wp-content/plugins/lightbox/images/No-image-found.jpg"
  imgPopup = false
  eventDetails = { "date": { "day": 0, "month": 0, "year": 0 }, "doctorId": "", "doctorName": "0", "doctorsConfirmation": false, "patientId": "", "patientName": "", "problemDescription": "описание проблемы...", "time": 0, "zoom": { "id": "", "link": "", "password": "" }, "daysLeft": 0 }
  homePageLoginPopup = false
  homePagePassRecoveryPopup = false
  homePageFbSecurityPopup = false
  registrTermsOfUsePopup = false
  emailVerifyPopup = false
  eventDetailsPopup = false

  constructor() { }

  showImgPopup(link, name) {
    if (link) {
      this.imgUrl = link
    }
    this.imgName = name
    this.toggleImgPopup()
  }
  
  toggleImgPopup() {
    this.imgPopup = !this.imgPopup
  }

  toggleLoginPopup() {
    this.homePageLoginPopup = !this.homePageLoginPopup
  }

  togglePassRecoveryPopup() {
    this.homePagePassRecoveryPopup = !this.homePagePassRecoveryPopup
  }

  toggleFbSecurityPopup() {
    this.homePageFbSecurityPopup = !this.homePageFbSecurityPopup
  }
  
  toggleTermsOfUsePopup() {
    this.registrTermsOfUsePopup = !this.registrTermsOfUsePopup
  }

  toggleEmailVerifyPopup() {
    this.emailVerifyPopup = !this.emailVerifyPopup
  }

  toggleEventDetailsPopup() {
    this.eventDetailsPopup = !this.eventDetailsPopup
  }

  toggleLoginAndPass() {
    this.toggleLoginPopup()
    this.togglePassRecoveryPopup()
  }

}

