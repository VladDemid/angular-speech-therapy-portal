import { HostListener, Injectable } from '@angular/core';
import { ManualOrderDetails, PopupOrderDetails } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  monthsNamesWhomCase = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"]
  imgName = ""
  imgUrl = "https://storiavoce.com/wp-content/plugins/lightbox/images/No-image-found.jpg"
  appointmentDetails = { "year": 2000, "month": 0, "day": 0, "hour": 0 }
  manualOrderDetails: ManualOrderDetails
  popupOrderDetails: PopupOrderDetails
  imgPopup = false
  sertifLinks = []
  activeSertIndex = 0
  homePageLoginPopup = false
  homePagePassRecoveryPopup = false
  homePageFbSecurityPopup = false
  homePageClientPopup = false
  homePageSpecialistPopup = false
  registrTermsOfUsePopup = false
  emailVerifyPopup = false
  eventDetailsPopup = false
  appointmentDeatailsPopup = false
  manualOrderPopup = false
  requisitesPopup = false

  passwordsHidden = true

  eventDetails = {
    date: { 
      day: 0, 
      month: 0, 
      year: 0, 
      time: 0 
    }, 
    doctorId: "", 
    doctorName: "0", 
    doctorsConfirmation: false, 
    patientId: "", 
    childDate: "",
    childName: "",
    patientName: "", 
    problemDescription: "описание проблемы...", 
    time: 0, 
    zoom: { 
      id: "", 
      link: "", 
      password: "" 
    }, 
    daysLeft: 0, 
    zoomLink: "",
    hoursLeft: 0,
    paymentFormUrl: null,
    state: "",
    orderId: ""
  }
  

  constructor() { }

  showImgPopup(links, i?, name?) {
    console.log(links, i, name )
    if (links[i]) {
      this.activeSertIndex = i
      this.sertifLinks = links
      this.imgUrl = links[this.activeSertIndex]
    }
    this.imgName = name
    this.toggleImgPopup()
  }

  incActiveSertIndex() {
    const maxLength = this.sertifLinks.length
    if (this.activeSertIndex < maxLength - 1) {
      this.activeSertIndex++
    } else {
      this.activeSertIndex = 0
    }
    this.imgUrl = this.sertifLinks[this.activeSertIndex]
    console.log("++")
  }

  decrActiveSertIndex() {
    const maxLength = this.sertifLinks.length
    if (this.activeSertIndex !== 0) {
      this.activeSertIndex--
    } else {
      this.activeSertIndex = maxLength - 1
    }
    this.imgUrl = this.sertifLinks[this.activeSertIndex]
    console.log("--")
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

  openLoginPopup() {
    this.homePageLoginPopup = true
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

  toggleAppointmentDeatailsPopup() {
    this.appointmentDeatailsPopup = !this.appointmentDeatailsPopup
  }

  toggleRequisitesPopup() {
    this.requisitesPopup = !this.requisitesPopup
  }

  toggleManualOrderPopup() {
    this.manualOrderPopup = !this.manualOrderPopup
  }

  toggleLoginAndPass() {
    this.toggleLoginPopup()
    this.togglePassRecoveryPopup()
  }

  // @HostListener("click", ["$event"])
  goToTerms(event: any): void {
    event.preventDefault()
    window.open(`/terms-of-use`, "_blank")
  }

  revealPass () {
    this.passwordsHidden = false
  }

  hidePass() {
    this.passwordsHidden = true
  }


}

