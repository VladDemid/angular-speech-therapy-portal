import { Injectable } from '@angular/core';
import { allCookies } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class CookieService {

  cookiesAccepted = true
  allCookies: allCookies = {}

  constructor() { 
    this.checkCookies()
  }

  

  acceptCookies() {
    const name = "acceptCookie",
          value = true,
          daysToLive = 30 
    let cookie = name + "=" + encodeURIComponent(value)
    cookie += "; max-age=" + (daysToLive*60*60*24 ) + ";path=/; secure; samesite=strict"
    document.cookie = cookie
    this.checkCookies()
  }


  addCookie() {
    const name = "some",
          value = true,
          path = "/",
          daysToLive = 2 
    let cookie = name + "=" + encodeURIComponent(value)
    cookie += "; max-age=" + (daysToLive*60*60*24 ) + "; secure"
    console.log(cookie)

    document.cookie = cookie
    this.checkCookies()
  }

  // setCookie(name, value, options: any = {}) {

  //   options = {
  //     path: '/',
  //     // при необходимости добавьте другие значения по умолчанию
  //     ...options
  //   };
  
  //   if (options.expires instanceof Date) {
  //     options.expires = options.expires.toUTCString();
  //   }
  
  //   let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  
  //   for (let optionKey in options) {
  //     updatedCookie += "; " + optionKey;
  //     let optionValue = options[optionKey];
  //     if (optionValue !== true) {
  //       updatedCookie += "=" + optionValue;
  //     }
  //   }
  
  //   document.cookie = updatedCookie;
  // }


  checkCookies() {
    let cookie = this.getCookies()
    this.allCookies = cookie
    // console.log(this.allCookies)
  }

  getCookies() {
    let cookies = {}
    const all = document.cookie
    if (all === "") {
      return cookies
    }
    const list = all.split("; ")
    for (let i = 0; i < list.length; i++) {
      const cookie = list[i]
      const p = cookie.indexOf("=")
      const name = cookie.substring(0, p)
      const value = cookie.substring(p+1)
      cookies[name] = decodeURIComponent(value)
    }
    
    return cookies;
  }

  deleteCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    this.checkCookies()
  }


}
