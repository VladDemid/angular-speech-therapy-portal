import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment, zoomConfig } from 'src/environments/environment';
import { Signature } from '../interfaces';

import { ZoomMtg } from '@zoomus/websdk';


ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();
ZoomMtg.i18n.load("ru-RU");

@Injectable({
  providedIn: 'root'
})
export class ZoomService {
  
  crypto = require('crypto') // crypto comes with Node.js
  
  userName = ""


  constructor(
    public http: HttpClient
  ) {}

  
  startZoom() {
    this.getSignature()
  }



  getSignature() {
    this.http.post(zoomConfig.signatureEndpoint, {
	    meetingNumber: zoomConfig.meetingNumber,
	    role: zoomConfig.role
    }).toPromise().then((data: any) => {
      if(data.signature) {
        console.log("signature: ", data.signature)
        this.startMeeting(data.signature)
      } else {
        console.log(data)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  startMeeting(signature) {

    document.getElementById('zmmtg-root').style.display = 'block'
    ZoomMtg.init({
      leaveUrl: zoomConfig.leaveUrl,
      isSupportAV: true,
      success: (success) => {
        console.log(success)
        
        ZoomMtg.join({
          signature: signature,
          meetingNumber: zoomConfig.meetingNumber,
          userName: this.userName,
          apiKey: zoomConfig.apiKey,
          userEmail: zoomConfig.userEmail,
          passWord: zoomConfig.password,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  createMeeting() {
    const userEmail = "vlatidos@gmail.com"
    const meeting = {
      "topic": "Мой заголовок",
      "type": "2",
      "start_time": "2020-05-24T10:10:00Z",
      "duration": "40",
      "timezone": "Asia/Baku",
      "password": "XbHi78",
      "agenda": "ну тут описание про встречу. Повестка дня такк сказать",
    }
    
    this.http.post(`https://api.zoom.us/v2/users/${userEmail}/meetings`, meeting)
      .subscribe((resp) => {
        console.log(resp)
      },
      (err) => {
        console.log("ошибка создания встречи: ", err)
      })
  }
  
  getUserId() {
    const userEmail = "vlatidos@gmail.com"
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6InNTWXp5UjNUU0JXTV9FR3k3ejNxY3ciLCJleHAiOjE2MjE5MjE5NTQsImlhdCI6MTYyMTkxNjYwMn0.fpfONOo_f3UbvJXi5y4ylFLG_vXSvPc4iVtumDdRrb0'
    this.http.get("https://api.zoom.us/v2/")
    .subscribe((resp) => {
      console.log(resp)
    },
    (err) => {
      console.log("ERROR: ",err)
    }) 
  }
}
