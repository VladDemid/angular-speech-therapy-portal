import { Component, OnInit } from '@angular/core';
import { UserData } from '../shared/services/user-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { specializationsList } from 'src/app/shared/lists';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { environment } from 'src/environments/environment';
import { UserDbInfo } from 'src/app/shared/interfaces';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.sass']

})


export class EditProfileComponent implements OnInit {
  
  requiredErr = false
  newFilesToUpload = 0
  uploadingAvatar = false
  defaultAvatar = environment.defaultAvatarUrl
  doubleClickPrevent = false
  showUpdate = false
  updateError = false
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
  isLoading = false
  uploadingSertificates = false

  clientForm = new FormGroup({
    clientName: new FormControl(null),
    clientSurname: new FormControl(null),
    clientPatronymic: new FormControl(null),
    clientPhone: new FormControl(null),
  })

  get clientName() {return this.clientForm.get('clientName')}
  get clientSurname() {return this.clientForm.get('clientSurname')}
  get clientPatronymic() {return this.clientForm.get('clientPatronymic')}
  get clientPhone() {return this.clientForm.get('clientPhone')}

  specForm = new FormGroup({
    specSurname: new FormControl(null),
    specName: new FormControl(null),
    specPatronymic: new FormControl(null),
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
    zoomLink: new FormControl(null),
    aboutMe: new FormControl(null),
  })

  get specName() {return this.specForm.get('specName')}
  get specSurname() {return this.specForm.get('specSurname')}
  get specPatronymic() {return this.specForm.get('specPatronymic')}
  get university() {return this.specForm.get('university')}
  get faculty() {return this.specForm.get('faculty')}
  get year() {return this.specForm.get('year')}
  get university2() {return this.specForm.get('university2')}
  get faculty2() {return this.specForm.get('faculty2')}
  get year2() {return this.specForm.get('year2')}
  get university3() {return this.specForm.get('university3')}
  get year3() {return this.specForm.get('year3')}
  get experience() {return this.specForm.get('experience')}
  get workPlace() {return this.specForm.get('workPlace')}
  get zoomLink() {return this.specForm.get('zoomLink')}
  get aboutMe() {return this.specForm.get('aboutMe')}
  

  constructor(
    public userData:UserData,
    private firebase: FirebaseService,
    public popupService: PopupService
    ) { }

  ngOnInit(): void {
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
          if (this.userData.myData.specializations.length) {
            this.specializationsData.specializationsSelected = this.userData.myData.specializations
          }
          if (this.userData.myData.aboutMe) {
            this.specForm.controls.aboutMe.setValue(this.userData.myData.aboutMe)
          }
          if (this.userData.myData.mainSpecialization) {
            this.specializationsData.mainSpecializationSelected = this.userData.myData.mainSpecialization
          }
          if (this.userData.myData.educationsCount) {
            this.educationsCount = this.userData.myData.educationsCount
            // console.log("@@@@@@@@@@@@@@", this.userData.myData.educationsCount);
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
      if (this.specializationsData.specializationsSelected.length) {
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
    this.isLoading = true
    const clientData = {
      name: this.clientForm.value.clientName,
      surname: this.clientForm.value.clientSurname,
      patronymic: this.clientForm.value.clientPatronymic,
      clientPhone: this.clientForm.value.clientPhone,
    }

    const newUserData = this.dataTrimmer(clientData)
    if (Object.keys(newUserData).length == 0) {
      this.isLoading = false
      return
    }
    this.firebase.sendMyDataChanges(newUserData)
      .subscribe(() => {
        this.isLoading = false
        this.userData.initialization()
        this.clientForm.reset()
        this.successfulDataUpdate()
      },(err) => {
        this.isLoading = false
        console.log("ERROR:", err);
      })
    
  }

  deleteField(fieldName) {
    const elId = `${fieldName}-delete-field-button`
    const el = document.getElementById(elId)
    el.classList.add("loading-circle")
    console.log(fieldName);
    const newData = {
      [fieldName]: null
    };
    console.log(newData)
    // (<HTMLInputElement>document.getElementById(fieldName)).value = "";
    this.firebase.patchUserData(newData, '')
    .then((resp) => {
      console.log(resp);
      this.userData.myData.zoomLink = ''
    })
    .catch((err) => {
      console.log("deletion error: ", err)
    })
    .finally(() => el.classList.remove("loading-circle"))
  }

  doctorChangeData() {
    this.isLoading = true
    // if (this.specForm.invalid) {
    //   console.log(this.specForm);
    // }
    this.sendSpecializationData()
    
    const doctorData = {
      name: this.specForm.value.specName,
      surname: this.specForm.value.specSurname,
      patronymic: this.specForm.value.specPatronymic,
      university: this.specForm.value.university,
      faculty: this.specForm.value.faculty,
      year: this.specForm.value.year,
      university2: this.specForm.value.university2,
      faculty2: this.specForm.value.faculty2,
      year2: this.specForm.value.year2,
      university3: this.specForm.value.university3,
      faculty3: this.specForm.value.faculty3,
      year3: this.specForm.value.year3,
      experience: this.specForm.value.experience,
      workPlace: this.specForm.value.workPlace,
      zoomLink: this.specForm.value.zoomLink,
      aboutMe: this.specForm.value.aboutMe,
    }
    
    const newUserData = this.dataTrimmer(doctorData)
    console.log("NEW USER DATA: ", newUserData);
    
    // for (let key in newUserData) {
    //   if (this.specForm.controls[key].invalid) {
    //     this.isLoading = false
    //     return
    //   }
    // }
    
    newUserData['educationsCount'] = this.educationsCount //добавить в конце кол-во образований (криво, надо будет получше вставить)
    

    if (Object.keys(newUserData).length == 0) { //проверка на наличие хоть одного заполненного поля
      this.isLoading = false
      return
    }
    this.firebase.sendMyDataChanges(newUserData)
      .subscribe(() => {
        this.isLoading = false
        this.userData.initialization()
        // this.specForm.reset()
        this.successfulDataUpdate()
      },(err) => {
        this.isLoading = false
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
      this.firebase.sendMyDataChanges(newSpecializationsData)
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
    console.log("userData: ", userData)
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
    }, 5000)
  }

  failedDataUpdate() {
    this.updateError = true
    setTimeout(() => {
      this.showUpdate = false
    }, 5000)
  }

  deleteSertificate(index) {
    console.log("удаление ", this.userData.myData.sertificatesNames[index])
    this.firebase.deleteSertificate(this.userData.myData.sertificatesNames[index])
      .then((resp) => {
        console.log("файл удален успешно ", resp) 
        this.userData.getSertificates()
        // this.updateSertifUrls();
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
    (<HTMLFormElement>document.getElementById('newSertificatesForm')).reset();
    // this.updateSertifUrls();
    
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
      console.log("newData: ", newData)

      // this.userData.sendMyDataChanges(newData)
      // .subscribe((resp) => {
      //   console.log("url аватара записан");
      //   this.avatarPrefireName = ""
      // },
      // (err) => {
      //   console.log("ошибка записи url аватара ", err);
      // })

      this.firebase.sendMyDataChanges(newData)
      .subscribe(() => {
        console.log("url аватара записан");
        this.avatarPrefireName = ""
        // this.specForm.reset()
      },(err) => {
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

