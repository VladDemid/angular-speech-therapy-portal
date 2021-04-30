import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-security-page',
  templateUrl: './security-page.component.html',
  styleUrls: ['./security-page.component.sass']
})
export class SecurityPageComponent implements OnInit {

  email: string
  passwordChangeSuccessfulMessage = ""
  passwordChangeErrMessage = ""

  newEmail = ""
  emailChangeSuccessfulMessage = ""
  emailChangeErrMessage = ""

  constructor(
    private firebase: FirebaseService,
    private popupService: PopupService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.firebase.getCurrentUser()
  }

  passwordRecovery() {
    this.firebase.sendPasswordResetEmail(this.email)
    .then(() => {
      console.log("email sent");
      this.passwordChangeSuccessfulMessage = "На вашу почту было отправлено письмо"
    })
    .catch((err) => {
      console.log("email sent ERROR", err);
      this.passwordChangeErrMessage = `Ошибка отправки письма на почту: ${err}`
    })
  }

  changeEmail() {
    this.firebase.changeEmail(this.newEmail)
      .then(() => {
        console.log("почта изменена");
        this.emailChangeSuccessfulMessage = "Почта изменена"
      })
      .catch((err) => {
        console.log("ошибка изменения почты: ", err);
        this.emailChangeSuccessfulMessage = `Ошибка изменения почты: ${err}`
      })
  }

  alert() {
    this.auth.logout()
    this.popupService.toggleLoginPopup()
    this.router.navigate(["/"], {
      queryParams: {
          needLogin: true
      }
    })
  }

}
