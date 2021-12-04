import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../../services/popup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TelegramBotService } from 'src/app/shared/services/telegram-bot.service';
import { emailConfig } from 'src/environments/environment';

@Component({
  selector: 'app-client-form-popup',
  templateUrl: './client-form-popup.component.html',
  styleUrls: ['./client-form-popup.component.sass']
})
export class ClientFormPopupComponent implements OnInit {

  form: FormGroup
  passwordMinLength = 6
  ErrMessage = ""
  isSendingData = false
  submitted = false

  constructor(
    public popupService: PopupService,
    private authServise: AuthService,
    private firebase: FirebaseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private telegram: TelegramBotService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('123', [
        Validators.required
      ]),
      surname: new FormControl("123", []),
      dob: new FormControl("0012-12-12", []),
      email: new FormControl('mr.zgot@yandex.ru', [
        Validators.email,
        Validators.required
      ]),
      phone: new FormControl('+7809', [
        Validators.required
      ]),
      question: new FormControl('один два три', []),
      termsOfUse: new FormControl(true, [
        Validators.required,
        Validators.requiredTrue
      ]),
    })
  }

  submit() {
    this.isSendingData = true
    
    let feedbackForm = {
      to: this.form.value.email,
      from: emailConfig.fromEmailAdress,
      templateId: emailConfig.EMAIL_TEMPLATES.MAIN_PAGE_FEEDBACK,
      dynamicTemplateData: {
        subject: "Logogo",
      }
    }
    
    
    
    if (this.form.invalid) {
      console.log(this.form.value)
      // this.showRulesRequired = true
      this.isSendingData = false
      return
    }
    
    // Promise.resolve(this.telegram.sendClientFeedback(this.form.value))
    // .then((resp) => {
      this.firebase.sendEmailFunction(feedbackForm)
        .then((res) => {
          // console.log("ура : ", res)
          this.form.reset()
          this.isSendingData = false
          this.submitted = true
          setTimeout(() => this.submitted = false, 3000)
        })
        .catch((err) => {
          console.log("Ошибка FBtest: ", err)
          this.isSendingData = false
        })
    // })
  }



}
