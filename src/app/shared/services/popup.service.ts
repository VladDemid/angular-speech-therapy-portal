import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  imgName = ""
  imgUrl = "https://storiavoce.com/wp-content/plugins/lightbox/images/No-image-found.jpg"
  imgPopup = false
  homePageLoginPopup = false
  homePagePassRecoveryPopup = false
  registrTermsOfUsePopup = false
  emailVerifyPopup = false

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
  
  toggleTermsOfUsePopup() {
    this.registrTermsOfUsePopup = !this.registrTermsOfUsePopup
  }

  toggleEmailVerifyPopup() {
    this.emailVerifyPopup = !this.emailVerifyPopup
  }

  toggleLoginAndPass() {
    this.toggleLoginPopup()
    this.togglePassRecoveryPopup()
  }

}

