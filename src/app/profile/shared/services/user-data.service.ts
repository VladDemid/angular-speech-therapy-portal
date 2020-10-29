import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserClient, UserDoctor, AnyUser, UserDbInfo } from 'src/app/shared/interfaces';
import { tap } from 'rxjs/operators';
import { DebugHelper } from 'protractor/built/debugger';
import { DevelopHelp } from 'src/app/shared/services/develop-help.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { PopupService } from 'src/app/shared/services/popup.service';

@Injectable()

export class UserData {


   myData: UserDbInfo = {
      name: "",
      surname: "",
      patronymic: "",
      userType: "client",
      description: "",
      // sertificatesLinks: [],
      // sertificatesNames: []
   }

   constructor(
      private helper: DevelopHelp,
      private auth: AuthService,
      private http: HttpClient,
      private firebase: FirebaseService,
      private popupService: PopupService
   ) {}


   initialization() {
      this.getMyData()
      .subscribe(
         (response: UserDbInfo) => {
            this.helper.toConsole("Инициализация пользователя: ",response)
            this.changeMyLocalData(response)
            if (this.myData.userType === "doctor") {
               this.getSertificates()
            }
         },
         (err) => {
            console.log("ERROR: getting data from server");
         })
   }

   getMyData() {
      return this.http.get(`${environment.FbDbUrl}/users/${localStorage.getItem("user-Id")}.json`)
   }

   getSertificates() {
      this.firebase.getSertificatesList()
      .then((files) => {
         console.log("мои файлы", files.items)

         this.saveSertificatesNames(files.items)
         

         
         this.firebase.getDownloadLinks(files.items)
         .then((links) => {
            // console.log("полученные ссылки на скачку: ", links)
            this.myData.sertificatesLinks = links
         })
           
         
      })
   }

   saveSertificatesNames(sertificates) {
      this.myData.sertificatesNames = []
      for (let file in sertificates) {
         if (!isNaN(+file)) {
            // console.log("добавление ", sertificates[file].name);
            
            this.myData.sertificatesNames[file] = (sertificates[file].name)
         }
      }
      console.log("мои сертификаты: ", this.myData.sertificatesNames);
   }

   changeMyLocalData(userData: UserDbInfo) {
      this.myData = userData
   }

   // checkEmailVerify() {
   //    // console.log(this.myData.emailVerified);
   //    if (this.myData.emailVerified === undefined) {
   //       console.log("myData.emailVerified не найдено");
   //       this.myData.emailVerified = false
   //       const newData = {
   //          emailVerified: false,
   //       }
   //       this.sendMyDataChanges(newData)
   //       .subscribe((resp) => {
   //          console.log("добавлено поле emailVerified = false")
   //          this.popupService.emailVerifyPopup = true
   //       })
   //    } else if (this.myData.emailVerified === false) {
   //       console.log("myData.emailVerified: false");
   //       this.popupService.emailVerifyPopup = true
   //    } else if (this.myData.emailVerified === true) {
   //       console.log("myData.emailVerified: true");
   //       this.popupService.emailVerifyPopup = false
   //    }
   // }

   sendMyDataChanges(newUserData) {
      return this.http.patch(`${environment.FbDbUrl}/users/${localStorage.getItem("user-Id")}.json`, newUserData)
   }



}