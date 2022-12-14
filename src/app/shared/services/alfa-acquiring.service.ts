import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlfaAcquiringService {

  alfaTestUrl = "https://web.rbsuat.com/ab_by/rest/"
  data = {
    userName: "logogo.online-api",
    password: "HnnlT8Et",
    orderNumber: "2021_6_16_18_dawRBLNTpDV5gep3mG9TyGAACrE3",
    amount: "1000", //10рублей?
    returnUrl: "https://logogo.online"
  }

  constructor(
    private http: HttpClient,
  ) { }

  test1() {
    this.http.post(`${this.alfaTestUrl}register.do`, this.data).subscribe(
      (resp) => {
        console.log(resp)
      },
      (err) => {
        console.log("ОШИБКА альфа: ", err)
      }
    )
    
  }

  async test2() {
    const response = await fetch(`${this.alfaTestUrl}register.do`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'no-cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(this.data) // body data type must match "Content-Type" header
    });
    return await response.json()
  }

}
