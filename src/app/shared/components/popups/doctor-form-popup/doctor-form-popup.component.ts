import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { TelegramBotService } from 'src/app/shared/services/telegram-bot.service';
import { emailConfig, environment, environmentOther } from 'src/environments/environment';

@Component({
  selector: 'app-doctor-form-popup',
  templateUrl: './doctor-form-popup.component.html',
  styleUrls: ['./doctor-form-popup.component.sass']
})
export class DoctorFormPopupComponent implements OnInit {

  isSendingData = false 
  form: FormGroup
  passwordMinLength = 6
  ErrMessage = ""
  submitted = false

  constructor(
    public popupService: PopupService,
    private authServise: AuthService,
    private firebase: FirebaseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private telegram: TelegramBotService,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(environmentOther.name, [
        Validators.required
      ]),
      specialization: new FormControl(environmentOther.specialization, []),
      email: new FormControl(environmentOther.emailSpec, [
        Validators.email,
        Validators.required
      ]),
      phone: new FormControl(environmentOther.phone, [
        Validators.required
      ]),
      description: new FormControl(environmentOther.question, []),
      // termsOfUse: new FormControl(false, [
      //   Validators.required,
      //   Validators.requiredTrue
      // ]),
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
      // this.showRulesRequired = true
      this.ErrMessage = "форма заполнена не полностью"
      this.isSendingData = false
      return
    }
    
    Promise.resolve(this.telegram.sendSpecialistFeedback(this.form.value))
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

  

}
