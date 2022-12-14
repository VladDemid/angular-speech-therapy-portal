import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-fb-security-popup',
  templateUrl: './fb-security-popup.component.html',
  styleUrls: ['./fb-security-popup.component.sass']
})
export class FbSecurityPopupComponent implements OnInit {

  resetPasswordMode = false
  verifyEmailMode = false
  recoverEmailMode = false
  requiredErr = false
  
  emailVerify = false

  // newPassword = ""

  oobCode = ""
  errMessage = ""
  message = ""

  passwordChangeForm = new FormGroup({
    newPassword: new FormControl(null)
  })

  get newPassword() {return this.passwordChangeForm.get('newPassword')}


  constructor(
    public popupService: PopupService,
    private firebase: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkMode()
  }

  checkMode() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params["mode"] ) {
        // console.log(params["mode"], params["oobCode"], params["apiKey"]);
        this.oobCode = params["oobCode"]
        this.applyFirebaseCodes(params["mode"], params["oobCode"], params["apiKey"])
      } 
    })
  }

  passwordRecovery() {
    this.firebase.resetPassword(this.oobCode, this.newPassword.value)
      .then(() => {
        this.message = "Ваш пароль изменен"
        setTimeout(() => {
          this.popupService.toggleFbSecurityPopup()
          this.router.navigate(['/profile'])
        }, 3000)
        
      })
      .catch((err) => {
        console.log("password change ERROR: ", err);
        this.passwordRecoveryErrorHandler(err)
        // this.errMessage = `Ошибка изменения пароля: ${err}`
      })
  }

  passwordRecoveryErrorHandler(error) {
    console.log("в обработчик пришло: ", error);
    switch (error.code) {
      case "auth/expired-action-code":
        this.errMessage = "Время истекло. Попробуйте заново, начиная с личного кабинета раздел 'безопасность'  "
        break
      default: 
      this.errMessage = `Ошибка при изменении пароля: ${error}`
        break
    }
  }

  applyFirebaseCodes(mode, oobCode, apiKey) {
    switch(mode) {
      case("resetPassword"): {
        this.resetPasswordMode = true
        break;
      }
      case("verifyEmail"): {
        this.verifyEmailMode = true
        this.firebase.applyActionCode(oobCode)
          .then((resp) => {
            this.updateEmailVerifyStatus()
          })
          .catch((err) => {
            console.log("Ошибка отправки кода подтверждения почты: ", err);
            this.errMessage = `Ошибка отправки кода подтверждения почты: ${err}`
          })
        break;
      }
      case("recoverEmail"): {
        this.recoverEmailMode = true
        this.firebase.checkActionCode(oobCode)
          .then((resp) => {
            console.log(resp);
            let previousEmail = resp.data.email
            this.firebase.applyActionCode(oobCode)
              .then((resp) => {
                console.log(`почта восстановлена обратно на ${previousEmail}`);
                this.message = "почта восстановлена обратно на " + previousEmail
              })
              .catch((err) => {
                console.log("Ошибка восстановления почты");
              })
          })
          .catch((err) => {
            console.log("Ошибка проверки кода");
          })
          
        break;
      }
      
    }
  }

  updateEmailVerifyStatus() {
    const emailVerifyUpdate = {emailVerified: true}
            
    this.firebase.sendMyDataChanges(emailVerifyUpdate).subscribe((resp) => {
      console.log('верификация почты обновлена!', resp)
      console.log("подтверждение почты успешно");
      this.emailVerify = true
      this.popupService.toggleFbSecurityPopup()
      this.router.navigate(['/profile'])
      // setTimeout(() => {
      // }, 1500)
    },
    (err) => {
      console.log('ошибка обновления верификации почты')
    })
  }

}
