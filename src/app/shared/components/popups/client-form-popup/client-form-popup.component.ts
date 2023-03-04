import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../../services/popup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TelegramBotService } from 'src/app/shared/services/telegram-bot.service';
import { emailConfig, environmentOther } from 'src/environments/environment';
import { FormsInputs } from 'src/assets/styles/popups-form-inputs';

@Component({
  selector: 'app-client-form-popup',
  templateUrl: './client-form-popup.component.html',
  styleUrls: ['./client-form-popup.component.sass']
})
export class ClientFormPopupComponent implements OnInit {

  // form: FormGroup
  // passwordMinLength = 6
  isSendingData = false
  submitted = false
  requiredErr = false
  errMessage = ""
  

  clientForm = new FormGroup({
    childName: new FormControl('', [Validators.required,]),
    childDate: new FormControl('', [Validators.required,]),
    parentName: new FormControl('', [Validators.required,]),
    email: new FormControl('', [Validators.required,Validators.email]),
    phone: new FormControl('', [Validators.required,Validators.minLength(6)]),
    comment: new FormControl('', [Validators.required,]),
    termsOfUse: new FormControl('', [Validators.required,]),
  });

  get childName() {return this.clientForm.get('childName')}
  get childDate() {return this.clientForm.get('childDate')}
  get parentName() {return this.clientForm.get('parentName')}
  get email() {return this.clientForm.get('email')}
  get phone() {return this.clientForm.get('phone')}
  get comment() {return this.clientForm.get('comment')}

 

  constructor(
    public popupService: PopupService,
    private authServise: AuthService,
    private firebase: FirebaseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private telegram: TelegramBotService,
    public formsInputs: FormsInputs,
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.clientForm.value)
    this.errMessage = ""
    this.requiredErr = false
    
    if (this.clientForm.invalid) {
      this.requiredErr = true
      this.errMessage = "форма заполнена не полностью"
      return
    }
    this.isSendingData = true
    this.errMessage = ""
    
    let feedbackForm = {
      to: this.clientForm.value.email,
      from: emailConfig.fromEmailAdress,
      templateId: emailConfig.EMAIL_TEMPLATES.MAIN_PAGE_FEEDBACK,
      dynamicTemplateData: {
        subject: "Logogo",
      }
    }
    
    
    

    let sendingData = this.clientForm.value
    sendingData.childDate = this.reformatDate(sendingData.childDate) // 2010-12-30 -> 30.12.2010
    console.log(sendingData)
    
    Promise.resolve(this.telegram.sendClientFeedback(sendingData))
    .then((resp) => {
      this.firebase.sendEmailFunction(feedbackForm)
        .then((res) => {
          console.log("email отправлен: ", res)
          this.clientForm.reset()
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
