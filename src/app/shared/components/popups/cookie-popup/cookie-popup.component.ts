import { Component, OnInit } from '@angular/core';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { Zoom } from 'swiper';

@Component({
  selector: 'app-cookie-popup',
  templateUrl: './cookie-popup.component.html',
  styleUrls: ['./cookie-popup.component.sass']
})
export class CookiePopupComponent implements OnInit {

  allCookies = this.cookieService.allCookies

  constructor(
    public cookieService: CookieService
  ) { }

  ngOnInit(): void {
  }

  // setCookie() {
  //   this.cookieService.setCookie()
  // }

  addCookie() {
    this.cookieService.addCookie()
  }

  checkCookies() {
    this.cookieService.checkCookies()
  }

  deleteCookies() {
    this.cookieService.deleteCookies()
  }
  
}
