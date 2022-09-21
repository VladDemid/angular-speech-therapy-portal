import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../../services/popup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TelegramBotService } from 'src/app/shared/services/telegram-bot.service';
import { emailConfig, environmentOther } from 'src/environments/environment';

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
      name: new FormControl(environmentOther.name, [
        Validators.required
      ]),
      surname: new FormControl(environmentOther.surname, []),
      dob: new FormControl(environmentOther.dob, []),
      email: new FormControl(environmentOther.emailClient, [
        Validators.email,
        Validators.required
      ]),
      phone: new FormControl(environmentOther.phone, [
        Validators.required
      ]),
      question: new FormControl(environmentOther.question, []),
      termsOfUse: new FormControl(null, [
        Validators.required,
        Validators.requiredTrue
      ]),
    })
  }

  submit() {
    this.isSendingData = true
    this.ErrMessage = ""
    
    let feedbackForm = {
      to: this.form.value.email,
      from: emailConfig.fromEmailAdress,
      templateId: emailConfig.EMAIL_TEMPLATES.MAIN_PAGE_FEEDBACK,
      dynamicTemplateData: {
        subject: "Logogo",
      }
    }
    
    
    
    if (this.form.invalid) {
      console.log(this.form)
      this.ErrMessage = "форма заполнена не полностью"
      // this.showRulesRequired = true
      this.isSendingData = false
      return
    }

    let sendingData = this.form.value
    sendingData.dob = this.reformatDate(sendingData.dob) // 2010-12-30 -> 30.12.2010
    console.log(sendingData)
    
    Promise.resolve(this.telegram.sendClientFeedback(sendingData))
    .then((resp) => {
      this.firebase.sendEmailFunction(feedbackForm)
        .then((res) => {
          console.log("email отправлен: ", res)
          this.form.reset()
          this.isSendingData = false
          this.submitted = true
          setTimeout(() => this.submitted = false, 5000)
        })
        .catch((err) => {
          console.log("Ошибка FBtest: ", err)
          this.isSendingData = false
        })
    })
  }

  reformatDate(dateStr) {
    const dArr = dateStr.split("-");  // ex input "2010-01-18"
    return dArr[2] + "." + dArr[1]+ "." + dArr[0]; //ex out: "18.01.10"
  }



}
