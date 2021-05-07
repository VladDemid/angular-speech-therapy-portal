import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { UserData } from '../../services/user-data.service';

@Component({
  selector: 'app-email-verify-popup',
  templateUrl: './email-verify-popup.component.html',
  styleUrls: ['./email-verify-popup.component.sass']
})
export class EmailVerifyPopupComponent implements OnInit {

  @Input() emailSendSuccess = -1

  constructor(
    public popupService: PopupService,
    private auth: AuthService,
    private firebase: FirebaseService,
    private userData: UserData,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.sendEmailVerification()
    // this.checkQuerry()
    // this.firebase.userObserver()
  }

  checkQuerry() {
    // this.activatedRoute.queryParams.subscribe((params: Params) => {
    //   console.log("PARAMS:", params );
    //   if (params["oobCode"] ) {
    //     // setInterval(this.checkCurrentUser(), 500)
    //     let timerCheckAuthentication = setInterval(() => {
    //       const isAuthenticated = this.checkCurrentUser()
    //       if (isAuthenticated) {
    //         clearInterval(timerCheckAuthentication)
    //         this.firebase.applyActionCode(params["oobCode"])
    //       }
    //     }, 500);
    //   } 
    // })
  }


  checkCurrentUser() {
    return this.firebase.checkUser()
  }

  changeEmailVerifyBoolean() {
    console.log("changeEmailVerifyBoolean changeEmailVerifyBoolean");
  }

  manuallyCheck() {
    console.log("------------------------");
    // this.firebase.
    
  }

  // sendEmailVerification() {
  //   const email = this.userData.myData.email
  //   console.log(`отправка письма для подтверждения на почту ${email}`);
  //   this.firebase.sendVerificationEmail(email)
  //     .then(() => {
  //       console.log("письмо отправлено на имеил");
  //     })
  //     .catch((err) => {
  //       console.log("ошибка отправки письма для верификации: ", err);
  //     })
  // }

  logOut() {
    this.auth.logout()
    this.auth.toHomePage()

    this.firebase.signOutCurrentUser()
      .then(() => {
        console.log("currentUser clear");
      })
      .catch((err) => {
        console.log("currentUser not clear: ", err);
      })
  }

  pageReload() {
    location.reload()
  }

}
function input() {
  throw new Error('Function not implemented.');
}

