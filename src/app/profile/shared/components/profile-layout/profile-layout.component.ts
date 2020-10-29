import { Component, OnInit } from '@angular/core';
import { UserData } from '../../services/user-data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { rejects } from 'assert';
import { ActivatedRoute, Params } from '@angular/router';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.sass']
})
export class ProfileLayoutComponent implements OnInit {


  constructor(
    public userData: UserData,
    private firebase: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private popupService: PopupService
  ) { }

  ngOnInit(): void {
    this.userData.initialization()
    
    this.fbUserObserver()
  }

  fbUserObserver() {
    this.firebase.userObserver()

    let timerUserCheck = setInterval(() => { //чекать к.500мс пока не найдет юзера
      if (this.firebase.checkUser()) { //юзер найден
        clearInterval(timerUserCheck)
        const user = this.firebase.getUser()
        if (user.emailVerified === false && !this.userData.myData.emailVerified) {
          this.popupService.emailVerifyPopup = true
          this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (params["oobCode"] ) {
              this.firebase.actionCode = params["oobCode"]
              this.firebase.applyActionCode()
                .then(() => {
                  console.log("email verified successfully")
                  this.popupService.emailVerifyPopup = false
                  const newUserData = this.userData.myData
                  newUserData.emailVerified = true
                  this.userData.changeMyLocalData(newUserData) //обновление локальных данных 
                  this.userData.sendMyDataChanges(newUserData) //обновление данных на серваке
                    .subscribe(() => console.log("база даных обновлена для пользователя"))
                })
                .catch((err) => {console.log("code send error: ", err)})
            } else if (!params["oobCode"] ) {
              this.firebase.sendVerificationEmail()
                .then(() => console.log("письмо отправлено"))
                .catch((err) => console.log("ошибка отправления письма: ", err))
            }
          })
        }
      }
    }, 500)
    // timerUserCheck
  }

}
