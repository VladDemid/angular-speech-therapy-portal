import { Component, OnInit } from '@angular/core';
import { UserData } from '../shared/services/user-data.service';
import { FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.sass']
})
export class EditProfileComponent implements OnInit {


  doctorForm: FormGroup
  clientForm: FormGroup
  showUpdate = false


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
      experience: new FormControl(null),
      workPlace: new FormControl(null),
    })
    
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
    const doctorData = {
      name: this.doctorForm.value.name,
      surname: this.doctorForm.value.surname,
      patronymic: this.doctorForm.value.patronymic,
      university: this.doctorForm.value.university,
      faculty: this.doctorForm.value.faculty,
      year: this.doctorForm.value.year,
      experience: this.doctorForm.value.experience,
      workPlace: this.doctorForm.value.workPlace
    }
    const newUserData = this.dataTrimmer(doctorData)
    if (Object.keys(newUserData).length == 0) {
      return
    }
    this.userData.sendMyDataChanges(newUserData)
      .subscribe(() => {
        this.userData.initialization()
        this.doctorForm.reset()
        this.successfulDataUpdate()
      },(err) => {
        console.log("ERROR:", err);
      })
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
    const files = (<HTMLInputElement>document.querySelector('#newSertificates')).files
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
    this.userData.getSertificates();
    (<HTMLFormElement>document.getElementById('newSertificatesForm')).reset()
    
  }

  async updateAvatar() {
    console.log("updating avatar");
    const file = (<HTMLInputElement>document.querySelector('#newAvatar')).files[0]
    console.log(file);
    await this.firebase.uploadAvatar(file)
      .then(() => {
        console.log(`аватарка загружена...`);
        this.setAvatarUrl()
      })
      .catch((err) => {
        console.log("ошибка при загрузке аватарки: ", err);
      })
  }

  setAvatarUrl() {
    console.log("получение url аватарки")
    this.firebase.getAvatar()
    .then((resp) => {
      console.log("ссылка на аватар: ", resp)

      const newData = {
        avatarUrl: resp
      }

      this.userData.sendMyDataChanges(newData)
      .subscribe((resp) => {
        console.log("url аватара записан");
        
      },
      (err) => {
        console.log("ошибка записи url аватара ", err);
      })
      

    })
    .catch((err) => {
      console.log("ошибка при получении ссылки аватара: ", err);
      
    })
    
  }

  

}

