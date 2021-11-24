import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DevelopHelp } from 'src/app/shared/services/develop-help.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-specialist-reg',
  templateUrl: './specialist-reg.component.html',
  styleUrls: ['./specialist-reg.component.sass']
})
export class SpecialistRegComponent implements OnInit {


  passwordMinLength = 6
  doctorRegistrationForm: FormGroup
  isSendingData = false
  showSuccessReg = ""
  showRulesRequired = false
  serverErrMessage = ""
  registrationStatus = ""
  createDBStatus = ""


  constructor(
    private auth: AuthService,
    private helper: DevelopHelp,
    public popupService: PopupService,
    private firebase: FirebaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.doctorRegistrationForm = new FormGroup({
      name: new FormControl(null,
        Validators.required),
      surname: new FormControl(null,
        Validators.required),
      patronymic: new FormControl(null,
        Validators.required),
      // university: new FormControl(null),
      // faculty: new FormControl(null),
      // year: new FormControl(null),
      // experience: new FormControl(null),
      // workPlace: new FormControl(null),
      // documents: new FormControl(null),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.passwordMinLength)
      ]),
      // passwordRepeat: new FormControl(null),
      termsOfUse: new FormControl(false, [
        Validators.required,
        Validators.requiredTrue
      ]),
      newsSubscription: new FormControl(false),


    })
  }


  sendDoctorForm() {
    this.isSendingData = true

    if (this.doctorRegistrationForm.invalid) {
      this.isSendingData = false
      // this.showRulesRequired = true
      return
    }
    // this.showRulesRequired = false

    const newDoctorData = {
      name: this.doctorRegistrationForm.value.name,
      surname: this.doctorRegistrationForm.value.surname,
      patronymic: this.doctorRegistrationForm.value.patronymic,
      email: this.doctorRegistrationForm.value.email, 
      newsSubscription: this.doctorRegistrationForm.value.newsSubscription,
      userType: "doctor",
      emailVerified: false
    }

    const registrationData = {
      email: this.doctorRegistrationForm.value.email,
      password: this.doctorRegistrationForm.value.password,
    }

    this.firebase.registrNewUser(registrationData).then((res) => {

      this.helper.toConsole("ответ сервера после регистрации: ", res)
      this.registrationStatus = "пользователь зарегистрирован"
      //после регистрации залогиниться в акк, чтобы записать данные (правило БД)
      this.auth.login(registrationData).subscribe(() => {  
        this.firebase.createNewUserDataObject(newDoctorData, res) // что записать и куда
          .subscribe(() => {
            this.isSendingData = false
            this.helper.toConsole("объект доктора создан")
            this.createDBStatus = "ячейка базы данных создана, пользователь полностью готов"
            this.doctorRegistrationForm.reset()
            // this.router.navigate(['/profile'])
          }, (err) => {
            this.isSendingData = false
            console.log("Ошибка создания ячейки данных: ", err);
          })
      }) 



    },(err) => {
      this.isSendingData = false
      console.log("Ошибка регистрации: ", err.code, err);
      this.errorHandler(err.code)
    })

  }

  errorHandler(error) {
    console.log("в обработчик пришло: ", error);
    switch (error) {
      case "auth/email-already-in-use":
        this.serverErrMessage = "Эта почта уже используется!"
        break
      default: 
      this.serverErrMessage = `Неизвестная ошибка при регистрации: ${error}`
        break
    }
  }

}
