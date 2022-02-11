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
    // 
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
      this.passwordChangeErrMessage = `Ошибка отправки письма на почту (изменения пароля): ${err}`
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
        this.emailErrorHandler(err)
      })
  }

  emailErrorHandler(error) {
    console.log("в обработчик пришло: ", error);
    switch (error.code) {
      case "auth/requires-recent-login":
        this.emailChangeErrMessage = "Необходимо перезайти в аккаунт для переноса почты"
        break
      default: 
      this.emailChangeErrMessage = `Неизвестная ошибка при изменении почты: ${error}`
        break
    }
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

  // code: auth/requires-recent-login

}
