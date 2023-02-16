import { Component, OnInit } from '@angular/core';
import { PopupService } from '../shared/services/popup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../shared/services/firebase.service';
import { DevelopHelp } from '../shared/services/develop-help.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UserData } from '../profile/shared/services/user-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.sass']
})
export class RegistrationPageComponent implements OnInit {

  production = environment.production
  clientFormDisplay = true 
  doctorFormDisplay = false
  showPassRepeatErrorMsg = false
  showRulesRequired = false
  showSuccessReg = false
  serverErrMessage = ""
  serverScsMessage = ""
  isSendingData = false

  experienceStages = [
    "Менее года",
    "1 год",
    "2 года",
    "3 года",
    "4 года",
    "Более 5-ти лет"
  ]

  passwordMinLength = 6

  doctorRegistrationForm: FormGroup
  requiredErr = false

  clientRegistrationForm = new FormGroup({
    surname: new FormControl('',
      Validators.required),
    name: new FormControl('',
      Validators.required),
    patronymic: new FormControl('',
      Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(this.passwordMinLength)
    ]),
    // passwordRepeat: new FormControl(null, [
    //   Validators.required,
    //   Validators.minLength(this.passwordMinLength)
    // ]),
    termsOfUse: new FormControl(null, [
      Validators.required,
      Validators.requiredTrue
    ]),
    newsSubscription: new FormControl(false),
  })

  get surname() {return this.clientRegistrationForm.get('surname')}
  get name() {return this.clientRegistrationForm.get('name')}
  get patronymic() {return this.clientRegistrationForm.get('patronymic')}
  get email() {return this.clientRegistrationForm.get('email')}
  get password() {return this.clientRegistrationForm.get('password')}
  get termsOfUse() {return this.clientRegistrationForm.get('termsOfUse')}
  get newsSubscription() {return this.clientRegistrationForm.get('newsSubscription')}


  

  constructor(
    private auth: AuthService,
    private helper: DevelopHelp,
    public popupService: PopupService,
    private userData: UserData,
    private firebase: FirebaseService,
    private router: Router,
    // private activatedRoute: ActivatedRoute,
    ) { }

  ngOnInit(): void {

    // this.select();
    
    

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
      // termsOfUse: new FormControl(false, [
      //   Validators.required,
      //   Validators.requiredTrue
      // ]),
      newsSubscription: new FormControl(false),


    })
    
  }
  
  

  sendClientForm() {
    
    this.isSendingData = true
    this.serverScsMessage = ""
    this.serverErrMessage = ""

    if (this.clientRegistrationForm.invalid) {
      this.showRulesRequired = true
      this.isSendingData = false
      return
    }
    this.showRulesRequired = false 

    const newClientData = {
      name: this.clientRegistrationForm.value.name,
      surname: this.clientRegistrationForm.value.surname,
      patronymic: this.clientRegistrationForm.value.patronymic,
      email: this.clientRegistrationForm.value.email.trim(),
      newsSubscription: this.doctorRegistrationForm.value.newsSubscription,
      userType: "client",
      emailVerified: false,
    }
    
    const registrationData = {
      email: this.clientRegistrationForm.value.email.trim(),
      password: this.clientRegistrationForm.value.password.trim(),
    }

    this.firebase.registrNewUser(registrationData).then((res) => {

      this.helper.toConsole("ответ сервера после регистрации: ", res)

      //после регистрации залогиниться в акк, чтобы записать данные (правило БД)
      this.auth.login(registrationData).subscribe(() => {  
        this.firebase.createNewUserDataObject(newClientData, res)
          .subscribe(() => {
            this.isSendingData = false
            this.helper.toConsole("объект пользователя создан")
            this.clientRegistrationForm.reset()
            this.sendVerificationEmail()
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

  sendVerificationEmail() {
    const user = this.firebase.getUser()
    console.log("user: ", user)
    // let backUrl = window.location.href.replace("registration", " ")
    if (user && user.emailVerified === false) {
      console.log("start sending email..")
      this.firebase.sendVerificationEmail()
        .then((resp) => {
          // this.emailSendSuccess = 1
          this.serverScsMessage = "Мы выслали вам письмо на почту для верификации"
          console.log("письмо отправлено: ", resp)
        })
        .catch((err) => {
          // this.emailSendSuccess = 0
          console.log("ошибка отправления письма: ", err)
      })
    }
  }


  testSendEmail() {
    const user = this.firebase.getUser()
    console.log("user: ", user)
    // let backUrl = window.location.href.replace("registration", " ")
    if (user && user.emailVerified === false) {
      console.log("start sending email..")
      this.firebase.sendVerificationEmail()
        .then((resp) => {
          console.log("письмо отправлено: ", resp)
        })
        .catch((err) => {
          console.log("ошибка отправления письма: ", err)
      })

    }
  }

  

  sendDoctorForm() {
    // const pass1 = this.doctorRegistrationForm.value.password 
    // const pass2 = this.doctorRegistrationForm.value.passwordRepeat 

    this.isSendingData = true

    if (this.doctorRegistrationForm.invalid) {
      this.isSendingData = false
      this.showRulesRequired = true
      return
    }
    this.showRulesRequired = false

    const newDoctorData = {
      name: this.doctorRegistrationForm.value.name,
      surname: this.doctorRegistrationForm.value.surname,
      patronymic: this.doctorRegistrationForm.value.patronymic,
      // university: this.doctorRegistrationForm.value.university,        
      // faculty: this.doctorRegistrationForm.value.faculty,        
      // year: this.doctorRegistrationForm.value.year,        
      // experience: document.getElementById("currentExperiense").innerText,       
      // workPlace: this.doctorRegistrationForm.value.workPlace,        
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

      //после регистрации залогиниться в акк, чтобы записать данные (правило БД)
      this.auth.login(registrationData).subscribe(() => {  
        // this.uploadSertificates()
        // .then(() => {
        this.firebase.createNewUserDataObject(newDoctorData, res) // что записать и куда
          .subscribe(() => {
            this.isSendingData = false
            this.helper.toConsole("объект доктора создан")
            this.doctorRegistrationForm.reset()
            this.router.navigate(['/profile'])
          }, (err) => {
            this.isSendingData = false
            console.log("Ошибка создания ячейки данных: ", err);
          })
        // })
        // .catch(err => {
        //   console.log("ошибка при загрузке файлов: ", err);
          
        // })
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

  
  async uploadSertificates() {
    const files = (<HTMLInputElement>document.querySelector('#sertificates')).files
    console.log("файлы для отправки: ", files);
    
    for (let file in files) {

      if (!isNaN(+file)) {
        console.log(file, " итеррация");
        await this.firebase.uploadSertificates(files[file])
          .then(() => {
            console.log(`файл ${files[file].name} загружен...`);
          })
          .catch((err) => {
            console.log("ошибка при загрузке файла: ", err);
          })
      }
    }
    console.log("все загружено")
  }

  checkPassIdentical(password1, password2): boolean {
    if (password1 === password2) {
      this.showPassRepeatErrorMsg = false
      return true
    } else { 
      this.showPassRepeatErrorMsg = true
      return false 
    }
  }


  showClientForm() {
    this.clientFormDisplay = true
    this.doctorFormDisplay = false
  }

  showDoctorForm() {
    this.clientFormDisplay = false
    this.doctorFormDisplay = true
  }

//--------для input select---------

// select = function () {
  
//   let selectHeader = document.querySelectorAll('.select__header');
//   let selectItem = document.querySelectorAll('.select__item');
//   // console.log(document.querySelector('.registration-block'));


//   selectHeader.forEach(item => {
//       item.addEventListener('click', selectToggle)
//   });

//   selectItem.forEach(item => {
//       item.addEventListener('click', selectChoose)
//   });

//   function selectToggle() {
//       this.parentElement.classList.toggle('is-active');
//   }

//   function selectChoose() {
//       let text = this.innerText,
//           select = this.closest('.select'),
//           currentText = select.querySelector('.select__current');
//       currentText.innerText = text;
//       select.classList.remove('is-active');
//            this.closest('.select').querySelector('.select__current').innerText
//   }

// }

  toggleSelectBody(event) {
    event.target.classList.toggle('is-active')
  }

  setExperience(event) {
    // console.log(event.target.innerText);
    // document.querySelector("#experience").nodeValue = event.target.innerText
    // (<HTMLInputElement>document.querySelector("#experience")).innerText = event.target.innerText
    // (<HTMLInputElement>document.getElementById("experience")).value = event.target.innerText
    // (<HTMLDivElement>document.getElementById("currentExperiense")).innerText = event.target.innerText
    document.getElementById("currentExperiense").innerText = event.target.innerText
    
  }

  // checkExperience() {
  //   const newDoctorData = {
  //     name: this.doctorRegistrationForm.value.name,
  //     surname: this.doctorRegistrationForm.value.surname,
  //     patronymic: this.doctorRegistrationForm.value.patronymic,
  //     university: this.doctorRegistrationForm.value.university,        
  //     faculty: this.doctorRegistrationForm.value.faculty,        
  //     year: this.doctorRegistrationForm.value.year,        
  //     experience: document.getElementById("currentExperiense").innerText,        
  //     workPlace: this.doctorRegistrationForm.value.workPlace,        
  //     email: this.doctorRegistrationForm.value.email, 
  //     newsSubscription: this.doctorRegistrationForm.value.newsSubscription,
  //     userType: "doctor"
  //   }
  //   console.log(newDoctorData);
  // }

}
