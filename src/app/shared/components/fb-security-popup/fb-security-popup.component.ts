import { Component, OnInit } from '@angular/core';
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
  newPassword = ""
  oobCode = ""
  errMessage = ""
  message = ""
  

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
    this.firebase.resetPassword(this.oobCode, this.newPassword)
      .then(() => {
        console.log("password changed!");
        this.message = "Ваш пароль изменен"
        setTimeout(() => {
          this.popupService.toggleFbSecurityPopup()
          this.router.navigate(['/profile'])
        }, 2000)
        
      })
      .catch((err) => {
        console.log("password change ERROR: ", err);
        this.errMessage = `Ошибка изменения пароля: ${err}`
      })
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
          .then(() => {
            console.log("подтверждение почты успешно");
            setTimeout(() => {location.reload()}, 1500)
            this.popupService.toggleFbSecurityPopup()
            this.router.navigate(['/profile'])
          })
          .catch((err) => {
            console.log("Ошибка отправки кода подтверждения почты: ", err);
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

}
