import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { TelegramBotService } from 'src/app/shared/services/telegram-bot.service';
import { emailConfig, environment } from 'src/environments/environment';

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
      name: new FormControl('', [
        Validators.required
      ]),
      specialisation: new FormControl("", []),
      email: new FormControl('', [
        Validators.email,
        Validators.required
      ]),
      phone: new FormControl('+', [
        Validators.required
      ]),
      description: new FormControl('', []),
      termsOfUse: new FormControl(false, [
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
    
    Promise.resolve(this.telegram.sendSpecialistFeedback(this.form.value))
    .then((resp) => {
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
    })
  }

  

}
