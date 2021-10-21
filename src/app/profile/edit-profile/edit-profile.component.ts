import { Component, OnInit } from '@angular/core';
import { UserData } from '../shared/services/user-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { specializationsList } from 'src/app/shared/lists';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.sass']

})


export class EditProfileComponent implements OnInit {
  
  uploadingSertificates = false
  newFilesToUpload = 0
  uploadingAvatar = false
  defaultAvatar = environment.defaultAvatarUrl
  doubleClickPrevent = false
  doctorForm: FormGroup
  clientForm: FormGroup
  showUpdate = false
  specializations = specializationsList
  specializationsData = {
    specializationsSelected: [],
    mainSpecializationSelected: ""  
  }
  specializationsSelected = []
  avatarPrefireName = ""
  testSign = "test"
  educationsCount = 1
  educationsMax = 3

  constructor(
    public userData:UserData,
    private firebase: FirebaseService,
    public popupService: PopupService
    ) { }

  ngOnInit(): void {

    this.clientForm = new FormGroup({
      name: new FormControl(null),
      surname: new FormControl(null),
      patronymic: new FormControl(null),
      childDiagnosis: new FormControl(null),
    })

    this.doctorForm = new FormGroup({
      name: new FormControl(null),
      surname: new FormControl(null),
      patronymic: new FormControl(null),
      university: new FormControl(null),
      faculty: new FormControl(null),
      year: new FormControl(null),
      university2: new FormControl(null),
      faculty2: new FormControl(null),
      year2: new FormControl(null),
      university3: new FormControl(null),
      faculty3: new FormControl(null),
      year3: new FormControl(null),
      experience: new FormControl(null, [
        Validators.max(80),
        Validators.pattern("^[0-9]*$")
      ]),
      workPlace: new FormControl(null),
      aboutMe: new FormControl(null),
    })
    this.scanSpecialisationData()
  }
  
  incrEducation() {
    if (this.educationsCount < this.educationsMax) {
      this.educationsCount++
    }
  }

  decrEducation() {
    if (this.educationsCount > 1) {
      this.educationsCount--
    }
  }

  scanSpecialisationData() {
    const waitForUserData = setInterval(() => {
      if (this.userData.myData.name != "") { //когда юзер найден
        clearInterval(waitForUserData) 
        //подгрузить данные со скачанного объекта юзера
        if (this.userData.myData.userType == "doctor") {
          if (this.userData.myData.specializations != []) {
            this.specializationsData.specializationsSelected = this.userData.myData.specializations
          }
          if (this.userData.myData.aboutMe) {
            this.doctorForm.controls.aboutMe.setValue(this.userData.myData.aboutMe)
          }
          if (this.userData.myData.mainSpecialization) {
            this.specializationsData.mainSpecializationSelected = this.userData.myData.mainSpecialization
          }
          if (this.userData.myData.educationsCount) {
            this.educationsCount = this.userData.myData.educationsCount
            console.log("@@@@@@@@@@@@@@", this.userData.myData.educationsCount);
          } else {
            // console.log("@@@@@@@@@@@@@@", this.userData.myData.educationsCount);
          }
          
        }
      }
    }, 300)
    
    const findMainSpecialization = setInterval(() => {
      const mainSpecialization = <HTMLInputElement>document.querySelector(".main_specialization_selected input")
      // (<HTMLInputElement>document.querySelector('#avatar-upload-button')).files[0]
      if (mainSpecialization && this.specializationsData.mainSpecializationSelected === "") {
        clearInterval(findMainSpecialization)
        // console.log("specialization: ", mainSpecialization.value);
        this.specializationsData.mainSpecializationSelected = mainSpecialization.value
      }
    }, 300)
    
  }

  selectSpecialization(specializationNameRus) {
    if (!this.doubleClickPrevent) {
      this.doubleClickPrevent = true
      const doubleClickPreventer = setTimeout(() => {this.doubleClickPrevent = false}, 50)
    } else {
      return
    }
    let index = -1
    if (this.specializationsData.specializationsSelected) {
      index = this.specializationsData.specializationsSelected.indexOf(specializationNameRus)
    }

    if (this.specializationsData.specializationsSelected === undefined) {
      this.specializationsData.specializationsSelected = [specializationNameRus]
    } else {
      if (index === -1) { //если нет такого, то добавить
        this.specializationsData.specializationsSelected.push(specializationNameRus)
      } else { //если есть такой, то удалить
        this.specializationsData.specializationsSelected.splice(index, 1)
      }
    }
    // console.log(this.specializationsData.specializationsSelected);

    //проверка на mainSpecialization
    if (specializationNameRus === this.specializationsData.mainSpecializationSelected) {
      this.specializationsData.mainSpecializationSelected = ""
      
      // const mainSpecialization = <HTMLInputElement>document.querySelector(".main_specialization_selected input")
      // if (mainSpecialization) {
      //   console.log("отменен:" , specializationNameRus, mainSpecialization.value);
      if (this.specializationsData.specializationsSelected != []) {
        this.specializationsData.mainSpecializationSelected = this.specializationsData.specializationsSelected[0]
      }
      // }
    }
    
  }
  
  changeSertificatesCount() {
    const files = (<HTMLInputElement>document.querySelector('#newSertificates')).files
    this.newFilesToUpload = files.length
  }

  selectMainSpecialization(mainSpecialization) {
    if (!this.doubleClickPrevent) {
      this.doubleClickPrevent = true
      const doubleClickPreventer = setTimeout(() => {this.doubleClickPrevent = false}, 50)
    } else {
      return
    }
    console.log(mainSpecialization);
    this.specializationsData.mainSpecializationSelected = mainSpecialization
  }
  
  setAboutMeDescription() {
  }
  

  changeMyImage() {
    const clientPhoto = (<HTMLInputElement>document.getElementById('clientPhoto')).files[0]
    this.firebase.uploadImage(clientPhoto, "avatar").then((response) => {
      console.log(response)
    })
    .catch((err) => {
      console.log("ошибка загрузки файла: ", err);
      
    })
  }

  clientChangeData() {
    const clientData = {
      name: this.clientForm.value.name,
      surname: this.clientForm.value.surname,
      patronymic: this.clientForm.value.patronymic,
      childDiagnosis: this.clientForm.value.childDiagnosis
    }

    const newUserData = this.dataTrimmer(clientData)
    if (Object.keys(newUserData).length == 0) {
      return
    }
    this.userData.sendMyDataChanges(newUserData)
      .subscribe(() => {
        this.userData.initialization()
        this.clientForm.reset()
        this.successfulDataUpdate()
      },(err) => {
        console.log("ERROR:", err);
      })
    
  }

  doctorChangeData() {
    // if (this.doctorForm.invalid) {
    //   console.log(this.doctorForm);
    // }
    this.sendSpecializationData()
    
    const doctorData = {
      name: this.doctorForm.value.name,
      surname: this.doctorForm.value.surname,
      patronymic: this.doctorForm.value.patronymic,
      university: this.doctorForm.value.university,
      faculty: this.doctorForm.value.faculty,
      year: this.doctorForm.value.year,
      university2: this.doctorForm.value.university2,
      faculty2: this.doctorForm.value.faculty2,
      year2: this.doctorForm.value.year2,
      university3: this.doctorForm.value.university3,
      faculty3: this.doctorForm.value.faculty3,
      year3: this.doctorForm.value.year3,
      experience: this.doctorForm.value.experience,
      workPlace: this.doctorForm.value.workPlace,
      aboutMe: this.doctorForm.value.aboutMe,
    }
    
    const newUserData = this.dataTrimmer(doctorData)
    console.log("NEW USER DATA: ", newUserData);
    
    for (let key in newUserData) {
      if (this.doctorForm.controls[key].invalid) {
        return
      }
    }
    
    newUserData['educationsCount'] = this.educationsCount //добавить в конце кол-во образований (криво, надо будет получше вставить)
    

    if (Object.keys(newUserData).length == 0) { //проверка на наличие хоть одного заполненного поля
      return
    }
    this.userData.sendMyDataChanges(newUserData)
      .subscribe(() => {
        this.userData.initialization()
        // this.doctorForm.reset()
        this.successfulDataUpdate()
      },(err) => {
        console.log("ERROR:", err);
      })
  }

  sendSpecializationData() {
    // console.log(`selected = ${this.specializationsData.specializationsSelected}`);
    
    const newSpecializationsData = {
      specializations: this.specializationsData.specializationsSelected,
      mainSpecialization: this.specializationsData.mainSpecializationSelected
    }
    if (!this.userData.myData.specializations || this.specializationsSelected != this.userData.myData.specializations) {
      console.log(newSpecializationsData);
      this.userData.sendMyDataChanges(newSpecializationsData)
        .subscribe(() => {
          console.log("специализации загружены");
        },
        (err) => {
          console.log("ошибка загрузки специализациЙ", err);
        })
    }
  }

  showSpecializationsSelected() {
    console.log(this.specializationsData.specializationsSelected);
  }

  dataTrimmer(userData: Object) {
    for (let key in userData) {
      if (userData[key] == null || !userData[key].trim()) {
        delete userData[key]
      }
    }
    return userData
  }

  successfulDataUpdate() {
    this.showUpdate = true
    setTimeout(() => {
      this.showUpdate = false
    }, 3000)
  }

  deleteSertificate(index) {
    console.log("удаление ", this.userData.myData.sertificatesNames[index])
    this.firebase.deleteSertificate(this.userData.myData.sertificatesNames[index])
      .then((resp) => {
        console.log("файл удален успешно ", resp) 
        this.userData.getSertificates()
      })
      .catch((err) => {
        console.log("ошибка при удалении файла: ", err);
      })
  }

  async addNewSertificates() {
    this.uploadingSertificates = true
    const files = (<HTMLInputElement>document.querySelector('#newSertificates')).files
    this.newFilesToUpload = files.length
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
    console.log("все новые сертификаты загружены")
    this.uploadingSertificates = false
    this.userData.getSertificates();
    (<HTMLFormElement>document.getElementById('newSertificatesForm')).reset()
    
  }

  async updateAvatar() {
    console.log("updating avatar");
    this.uploadingAvatar = true
    const file = (<HTMLInputElement>document.querySelector('#avatar-upload-button')).files[0]
    console.log(file);
    await this.firebase.uploadAvatar(file)
      .then(() => {
        console.log(`аватарка загружена...`);
        this.uploadingAvatar = false
        this.setAvatarUrl()
      })
      .catch((err) => {
        this.uploadingAvatar = false
        console.log("ошибка при загрузке аватарки: ", err);
      })
  }

  setAvatarUrl() {
    console.log("получение url аватарки")
    this.firebase.getAvatar()
    .then((resp) => {
      console.log("ссылка на аватар: ", resp)
      this.userData.myData.avatarUrl = resp

      const newData = {
        avatarUrl: resp
      }

      this.userData.sendMyDataChanges(newData)
      .subscribe((resp) => {
        console.log("url аватара записан");
        this.avatarPrefireName = ""
      },
      (err) => {
        console.log("ошибка записи url аватара ", err);
      })
      

    })
    .catch((err) => {
      console.log("ошибка при получении ссылки аватара: ", err);
      
    })
    
  }

  scanAvatarName() {
    const scanAvatar = setInterval(() => {
      if ((<HTMLInputElement>document.querySelector('#avatar-upload-button')).files[0]) {
        const file = (<HTMLInputElement>document.querySelector('#avatar-upload-button')).files[0]
        this.avatarPrefireName = file.name
        clearInterval(scanAvatar)
      }
    }, 500)
  }

  

  

}

