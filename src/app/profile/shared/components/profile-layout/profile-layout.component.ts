import { Component, OnInit } from '@angular/core';
import { UserData } from '../../services/user-data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { rejects } from 'assert';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.sass']
})
export class ProfileLayoutComponent implements OnInit {


  emailSendSuccess = -1

  constructor(
    public userData: UserData,
    private firebase: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private popupService: PopupService
    
  ) { }

  ngOnInit(): void {
    this.userData.initialization()
    // this.UserTypeUpdate()
    this.fbUserObserver()
  }

  fbUserObserver() {
    this.firebase.userObserver()

    let timerUserCheck = setInterval(() => { //чекать к.200мс пока не найдет юзера //*ждет логина через signInWithPass()
      if (this.firebase.checkUser()) { //юзер найден
        clearInterval(timerUserCheck)
        const user = this.firebase.getUser()

        // user.updateProfile({
        //   displayName: this.userData.myData.userType
        // }).then(()=> {
        //   console.log('userTypeUpdate Success')
        // }).catch((err) => {
        //   console.log('userTypeUpdate ERROR: ', err)
        // })

        // this.UserTypeUpdate(user)
        //если юзер не подтвердил почту и в 
        if (user.emailVerified === false && this.userData.myData.emailVerified == false) {
          this.popupService.emailVerifyPopup = true
          // this.activatedRoute.queryParams.subscribe((params: Params) => {
          //   if (params["oobCode"] ) {
          //     this.firebase.actionCode = params["oobCode"]
          //     this.firebase.applyActionCode()
          //       .then(() => {
          //         console.log("email verified successfully")
          //         this.popupService.emailVerifyPopup = false
          //         const newUserData = this.userData.myData
          //         newUserData.emailVerified = true
          //         this.userData.changeMyLocalData(newUserData) //обновление локальных данных 
          //         this.userData.sendMyDataChanges(newUserData) //обновление данных на серваке
          //           .subscribe(() => console.log("база даных обновлена для пользователя"))
          //       })
          //       .catch((err) => {console.log("code send error: ", err)})
          //   } else if (!params["oobCode"] ) {
          //     console.log("отправка письма заблокирована");
          this.firebase.sendVerificationEmail()
            .then(() => {
              this.emailSendSuccess = 1
              console.log("письмо отправлено", this.emailSendSuccess)
            })
            .catch((err) => {
              this.emailSendSuccess = 0
              console.log("ошибка отправления письма: ", err, this.emailSendSuccess)

          })
          //   }
          // })
        } else if (user.emailVerified == true) { //после подтверждения
          this.popupService.emailVerifyPopup = false
          if(!this.userData.myData.emailVerified) {
            const emailVerifyUpdate = {emailVerified: true}
            
            this.userData.sendMyDataChanges(emailVerifyUpdate)
            .subscribe((resp) => {
              console.log('верификация почты обновлена!', resp)
              window.location.reload()
            },
            (err) => {
              console.log('ошибка обновления верификации почты')
            })
          }
        }
      }
    }, 200)
    // timerUserCheck
  }

  // UserTypeUpdate(user) {
  //   user.updateProfile({userType: this.userData.myData.userType})
    
  // }

}
