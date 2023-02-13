import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../../services/popup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DevelopHelp } from '../../../services/develop-help.service';
import { FirebaseService } from '../../../services/firebase.service';
import { environmentOther } from 'src/environments/environment';
import { UserCredentials } from '../../../interfaces';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.sass']
})
export class LoginPopupComponent implements OnInit {

  loggingIn = false
  passwordMinLength = 6
  serverErrMessage = ""
  accessErrMessage = ""
  requiredErr = false

  form = new FormGroup({
    email: new FormControl(environmentOther.emailDefault.trim(), [
      Validators.required,Validators.email
    ]),
    password: new FormControl(environmentOther.passwordDefault, [
      Validators.required, Validators.minLength(this.passwordMinLength)
    ])
  })

  get email() {return this.form.get('email')}
  get password() {return this.form.get('password')}
  
  constructor(
    private helper: DevelopHelp,
    public popupService: PopupService,
    private authServise: AuthService,
    private firebase: FirebaseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    ) {}
    
    ngOnInit(): void {
      
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params["needLogin"]) {
        this.accessErrMessage = "Для доступа в личный кабинет необходимо заново войти в аккаунт либо время сессии вышло и необходимо залогиниться заново "
      } else if (params["needLoginToMakeAnAppointment"]) {
        this.accessErrMessage = "Чтобы записаться к доктору нужно, нужно сначала зайти в профиль"
      }
    })
  }

  logIn() {
    if (this.form.invalid) {
      return
    }

    const user = {
      email: this.form.value.email.trim(),
      password: this.form.value.password.trim(),
    }
    this.loggingIn = true

      this.firebase.setPersistence()
      .then(() => {
        this.firebase.signInWithPass(user)
        .then((userCredentials: any) => { //успешный вход в юзера
          console.log("userCredentials: ", userCredentials)
          // this.firebase.setUid(userCredentials)
          localStorage.setItem("user-Id",  userCredentials.user.uid)
          this.form.reset()
          this.loggingIn = false
          const user = this.firebase.getUser()
          console.log(user)
          if (user?.emailVerified) {
            this.popupService.toggleLoginPopup()
            this.router.navigate(['/profile'])
          } else if (user && !user.emailVerified) {
            this.accessErrMessage = "Ваша почта не верифицирована, мы отправили на неё письмо. Пожалуста перейдите по ссылке в письме."
            this.firebase.sendVerificationEmail()
              .then((resp) => {
                console.log("письмо отправлено: ", resp)
                this.accessErrMessage = "Ваша почта не верифицирована, мы отправили на неё письмо. Пожалуста перейдите по ссылке в письме. (письмо доставлено)"
              })
              .catch((err) => {
                this.accessErrMessage = `Ваша почта не верифицирована, мы отправили на неё письмо. Пожалуста перейдите по ссылке в письме. ОШИБКА отправления письма: ${err}`
                console.log("ошибка отправления письма: ", err)
            })
          }

          // this.currentUser = userCredentials.user
        })
        .catch((err) => {
          this.loggingIn = false
          console.log("signInWithEmailAndPassword ERROR: ", err)
          this.loginErrorHandler(err)
        })
      })
    .catch((err) => {
        console.log("setPersistence ERROR: ", err)
        this.loggingIn = false
      })



    }  

  loginErrorHandler(error) {
    this.helper.toConsole("в обработчик пришло: ", error);
    console.log()
    switch (error.code) {
      case "auth/user-not-found":
        this.serverErrMessage = "Такая почта не найдена"
        break
      case "auth/wrong-password":
        this.serverErrMessage = "Неверный пароль"
        break
      default: 
      this.serverErrMessage = error.code
        break
    }
  }

}
