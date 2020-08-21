import { Component, OnInit } from '@angular/core';
import { PopupService } from '../shared/services/popup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../shared/services/firebase.service';
import { DevelopHelp } from '../shared/services/develop-help.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.sass']
})
export class RegistrationPageComponent implements OnInit {

  ClientFormDisplay = true
  DoctorFormDisplay = false
  showPassRepeatErrorMsg = false
  showRulesRequired = false
  showSuccessReg = false
  serverErrMessage = ""

  experienceStages = [
    "Менее года",
    "1 год",
    "2 года",
    "3 года",
    "4 года",
    "Более 5-ти лет"
  ]

  passwordMinLength = 6

  clientRegistrationForm: FormGroup
  doctorRegistrationForm: FormGroup

  constructor(
    private auth: AuthService,
    private helper: DevelopHelp,
    public popupService: PopupService,
    private firebase: FirebaseService,
    private router: Router
    ) { }

  ngOnInit(): void {

    // this.select();
    
    this.clientRegistrationForm = new FormGroup({
      name: new FormControl(null,
        Validators.required),
      surname: new FormControl(null,
        Validators.required),
      patronymic: new FormControl(null,
        Validators.required),
      childDiagnosis: new FormControl(null,
        Validators.required),
      // photo: new FormControl(null),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.passwordMinLength)
      ]),
      passwordRepeat: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.passwordMinLength)
      ]),
      termsOfUse: new FormControl(null, [
        Validators.required,
        Validators.requiredTrue
      ]),
      newsSubscription: new FormControl(false),
    })

    this.doctorRegistrationForm = new FormGroup({
      name: new FormControl(null,
        Validators.required),
      surname: new FormControl(null,
        Validators.required),
      patronymic: new FormControl(null,
        Validators.required),
      university: new FormControl(null,
        Validators.required),
      faculty: new FormControl(null,
        Validators.required),
      year: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)]),
      experience: new FormControl(null),
      workPlace: new FormControl(null,
        Validators.required),
      documents: new FormControl(null,
        Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.passwordMinLength)
      ]),
      passwordRepeat: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.passwordMinLength)
      ]),
      termsOfUse: new FormControl(false, [
        Validators.required,
        Validators.requiredTrue
      ]),
      newsSubscription: new FormControl(false),


    })
    
  }
  
  

  sendClientForm() {
    
    const pass1 = this.clientRegistrationForm.value.password 
    const pass2 = this.clientRegistrationForm.value.passwordRepeat 

    if (this.clientRegistrationForm.invalid || !this.checkPassIdentical(pass1, pass2)) {
      this.showRulesRequired = true
      return
    }
    this.showRulesRequired = false 

    const newClientData = {
      name: this.clientRegistrationForm.value.name,
      surname: this.clientRegistrationForm.value.surname,
      patronymic: this.clientRegistrationForm.value.patronymic,
      childDiagnosis: this.clientRegistrationForm.value.childDiagnosis,
      email: this.clientRegistrationForm.value.email,
      newsSubscription: this.doctorRegistrationForm.value.newsSubscription,
      userType: "client"
    }
    
    const registrationData = {
      email: this.clientRegistrationForm.value.email,
      password: this.clientRegistrationForm.value.password,
    }

    this.firebase.registrNewUser(registrationData).then((res) => {

      this.helper.toConsole("ответ сервера после регистрации: ", res)

      //после регистрации залогиниться в акк, чтобы записать данные (правило БД)
      this.auth.login(registrationData).subscribe(() => {  
        this.firebase.createNewUserDataObject(newClientData, res)
          .subscribe(() => {
            this.helper.toConsole("ячейка данных создана")
            this.clientRegistrationForm.reset()
            this.successfulRegistrationAlert() //может не нада
            this.router.navigate(['/profile'])
          }, (err) => {
            console.log("Ошибка создания ячейки данных: ", err);
          })
      }) 
    
    },(err) => {
      console.log("Ошибка регистрации: ", err.code, err);
      this.errorHandler(err.code)
    })
    
  }

  sendDoctorForm() {
    
    const pass1 = this.doctorRegistrationForm.value.password 
    const pass2 = this.doctorRegistrationForm.value.passwordRepeat 
    if (this.doctorRegistrationForm.invalid || !this.checkPassIdentical(pass1, pass2)) {
      this.showRulesRequired = true
      return
    }
    this.showRulesRequired = false

    const newDoctorData = {
      name: this.doctorRegistrationForm.value.name,
      surname: this.doctorRegistrationForm.value.surname,
      patronymic: this.doctorRegistrationForm.value.patronymic,
      university: this.doctorRegistrationForm.value.university,        
      faculty: this.doctorRegistrationForm.value.faculty,        
      year: this.doctorRegistrationForm.value.year,        
      experience: document.getElementById("currentExperiense").innerText,       
      workPlace: this.doctorRegistrationForm.value.workPlace,        
      email: this.doctorRegistrationForm.value.email, 
      newsSubscription: this.doctorRegistrationForm.value.newsSubscription,
      userType: "doctor"
    }
    
    const registrationData = {
      email: this.doctorRegistrationForm.value.email,
      password: this.doctorRegistrationForm.value.password,
    }

    
    this.firebase.registrNewUser(registrationData).then((res) => {

      this.helper.toConsole("ответ сервера после регистрации: ", res)

      //после регистрации залогиниться в акк, чтобы записать данные (правило БД)
      this.auth.login(registrationData).subscribe(() => {  
        this.uploadSertificates()
        .then(() => {
          this.firebase.createNewUserDataObject(newDoctorData, res)
            .subscribe(() => {
              this.helper.toConsole("ячейка данных создана")
              this.doctorRegistrationForm.reset()
              this.successfulRegistrationAlert() //может не нада
              this.router.navigate(['/profile'])
            }, (err) => {
              console.log("Ошибка создания ячейки данных: ", err);
            })
        })
        .catch(err => {
          console.log("ошибка при загрузке файлов: ", err);
          
        })
      }) 



    },(err) => {
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

  successfulRegistrationAlert() {
    this.showSuccessReg = true
    setTimeout(() => {
      this.showSuccessReg = false
      // this.router.navigate(['/profile'])
    }, 3000)
  }

  showClientForm() {
    this.ClientFormDisplay = true
    this.DoctorFormDisplay = false
  }

  showDoctorForm() {
    this.ClientFormDisplay = false
    this.DoctorFormDisplay = true
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

checkExperience() {
  const newDoctorData = {
    name: this.doctorRegistrationForm.value.name,
    surname: this.doctorRegistrationForm.value.surname,
    patronymic: this.doctorRegistrationForm.value.patronymic,
    university: this.doctorRegistrationForm.value.university,        
    faculty: this.doctorRegistrationForm.value.faculty,        
    year: this.doctorRegistrationForm.value.year,        
    experience: document.getElementById("currentExperiense").innerText,        
    workPlace: this.doctorRegistrationForm.value.workPlace,        
    email: this.doctorRegistrationForm.value.email, 
    newsSubscription: this.doctorRegistrationForm.value.newsSubscription,
    userType: "doctor"
  }
  console.log(newDoctorData);
}

}
