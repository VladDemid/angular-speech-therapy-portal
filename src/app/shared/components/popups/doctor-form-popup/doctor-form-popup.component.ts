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

  requiredErr = false
  isSendingData = false 
  // specForm: FormGroup
  passwordMinLength = 6
  errMessage = ""
  submitted = false

  specForm = new FormGroup({name: new FormControl(environmentOther.name, [Validators.required]),
    specialization: new FormControl(environmentOther.specialization, []),
    email: new FormControl(environmentOther.emailSpec, [Validators.email,Validators.required]),
    phone: new FormControl(environmentOther.phone, [Validators.required]),
    comment: new FormControl(environmentOther.question, []),
    termsOfUse: new FormControl('', [Validators.required,]),
    // termsOfUse: new FormControl(false, [
    //   Validators.required,
    //   Validators.requiredTrue
    // ]),
  })

  constructor(
    public popupService: PopupService,
    private authServise: AuthService,
    private firebase: FirebaseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private telegram: TelegramBotService,
  ) { }

  ngOnInit(): void {}

  get name() {return this.specForm.get('name')}
  get specialization() {return this.specForm.get('specialization')}
  get email() {return this.specForm.get('email')}
  get phone() {return this.specForm.get('phone')}
  get comment() {return this.specForm.get('comment')}

  submit() {
    console.log("return")
    return
    this.isSendingData = true
    this.errMessage = ""
    
    let feedbackForm = {
      to: this.specForm.value.email,
      from: emailConfig.fromEmailAdress,
      templateId: emailConfig.EMAIL_TEMPLATES.MAIN_PAGE_FEEDBACK,
      dynamicTemplateData: {
        subject: "Logogo",
      }
    }
    
    
    
    if (this.specForm.invalid) {
      console.log(this.specForm)
      // this.showRulesRequired = true
      this.errMessage = "форма заполнена не полностью"
      this.isSendingData = false
      return
    }
    
    Promise.resolve(this.telegram.sendSpecialistFeedback(this.specForm.value))
    .then((resp) => {
      this.firebase.sendEmailFunction(feedbackForm)
      .then((res) => {
        console.log("email отправлен: ", res)
        this.specForm.reset()
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
