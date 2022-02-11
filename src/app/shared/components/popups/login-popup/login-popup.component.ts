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
  form: FormGroup
  passwordMinLength = 6
  serverErrMessage = ""
  accessErrMessage = ""
  
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
        this.accessErrMessage = "Время сессии вышло. Для доступа в личный кабинет необходимо заново войти в аккаунт"
      } else if (params["needLoginToMakeAnAppointment"]) {
        this.accessErrMessage = "Чтобы записаться к доктору нужно, нужно сначала зайти в профиль"
      }
    })

    this.form = new FormGroup({
      email: new FormControl(environmentOther.emailDefault, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(environmentOther.passwordDefault, [
        Validators.required,
        Validators.minLength(this.passwordMinLength)
      ])
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
    // ---Obsolete--->
    // this.firebase.signInWithPass(user) //вход юзера
    //   .then((result) => {
    //     console.log("user:", result);
    //     this.loggingIn = false
    //   })
    //   .catch((err) => {
    //     this.loggingIn = false
    //     console.log("ошибка входа чз firebase: ", err);
    //   })
    
    // this.authServise.login(user).subscribe((response) => { 
    //   this.form.reset()
    //   this.loggingIn = false
    //   this.popupService.toggleLoginPopup()
    //   this.helper.toConsole("При логине был получен ответ: ",response)
    //   this.router.navigate(['/profile'])

    // },
    // (err)=> {
    //   console.log("ERROR:", err);
    //   this.loginErrorHandler(err)
    //   this.loggingIn = false
    // })
    // <---Obsolete---

    // --test1-->
    // this.firebase.signInWithPassNew(user)
    // .then((result) => {
      //   console.log("firebase.signInWithPass: ", result);
      //   this.form.reset()
      //   this.loggingIn = false
      //   // this.popupService.toggleLoginPopup()
      //   // this.router.navigate(['/profile'])
      //   // this.loggingIn = false
      // })
      // .catch((err) => {
      //   console.log("ошибка входа чз firebase: ", err);
      //   this.loggingIn = false
      // })
      // <--test1--
      

      this.firebase.setPersistence()
      .then(() => {
        this.firebase.signInWithPass(user)
        .then((userCredentials: any) => { //успешный вход в юзера
          console.log("userCredentials: ", userCredentials)
          // this.firebase.setUid(userCredentials)
          localStorage.setItem("user-Id",  userCredentials.user.uid)
          this.form.reset()
          this.loggingIn = false
          this.popupService.toggleLoginPopup()
          this.router.navigate(['/profile'])
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
