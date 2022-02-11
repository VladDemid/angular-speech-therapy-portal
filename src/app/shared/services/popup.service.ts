import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  monthsNamesWhomCase = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"]
  imgName = ""
  imgUrl = "https://storiavoce.com/wp-content/plugins/lightbox/images/No-image-found.jpg"
  appointmentDetails = { "year": 2000, "month": 0, "day": 0, "hour": 0 }
  imgPopup = false
  eventDetails = { "date": { "day": 0, "month": 0, "year": 0 }, "doctorId": "", "doctorName": "0", "doctorsConfirmation": false, "patientId": "", "patientName": "", "problemDescription": "описание проблемы...", "time": 0, "zoom": { "id": "", "link": "", "password": "" }, "daysLeft": 0 }
  homePageLoginPopup = false
  homePagePassRecoveryPopup = false
  homePageFbSecurityPopup = false
  homePageClientPopup = false
  homePageSpecialistPopup = false
  registrTermsOfUsePopup = false
  emailVerifyPopup = false
  eventDetailsPopup = false
  appointmentDeatailsPopup = false
  requisitesPopup = false
  

  constructor() { }

  showImgPopup(link, name?) {
    if (link) {
      this.imgUrl = link
    }
    this.imgName = name
    this.toggleImgPopup()
  }

  hideAllPopups() {
    this.imgPopup = false
    this.homePageLoginPopup = false
    this.homePagePassRecoveryPopup = false
    this.homePageFbSecurityPopup = false
    this.homePageClientPopup = false
    this.homePageSpecialistPopup = false
    this.registrTermsOfUsePopup = false
    this.emailVerifyPopup = false
    this.eventDetailsPopup = false
    this.appointmentDeatailsPopup = false
    this.requisitesPopup = false
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

  toggleHoPgClientPopup() {
    this.homePageClientPopup = !this.homePageClientPopup
  }

  toggleHoPgSpecialistPopup() {
    this.homePageSpecialistPopup = !this.homePageSpecialistPopup
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

  toggleappointmentDeatailsPopup() {
    this.appointmentDeatailsPopup = !this.appointmentDeatailsPopup
  }

  toggleRequisitesPopup() {
    this.requisitesPopup = !this.requisitesPopup
  }

  toggleLoginAndPass() {
    this.toggleLoginPopup()
    this.togglePassRecoveryPopup()
  }

  goToTerms() {
    window.open(`/terms-of-use`, "_blank")
  }

}

