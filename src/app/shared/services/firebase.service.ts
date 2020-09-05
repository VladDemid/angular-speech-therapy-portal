import { Injectable, OnInit } from '@angular/core';
import * as firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"
import { firebaseConfig, environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DevelopHelp } from './develop-help.service';
import { User } from 'src/app/shared/interfaces'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnInit {


  constructor(
    private helper: DevelopHelp,
    private http: HttpClient) 
    {
      firebase.initializeApp(firebaseConfig)
    }

  ngOnInit(): void {
    console.log("auth = ",firebase.auth);
  }
  
  registrNewUser(newUser) {
    this.helper.toConsole("Try to create new user: ", newUser)
    return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
  }

  createNewUserDataObject(user, result) {
    this.helper.toConsole("инфа для заполнения пользователя: ", user)
    this.helper.toConsole("Id нового пользователя: ", result.user.uid)
    return this.http.put(`${environment.FbDbUrl}/users/${result.user.uid}.json`, user)
    
  }


  signInWithPass(user: User) {
    this.helper.toConsole("вход в систему через firebase...")
    return firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  }

  uploadImage(image, type) {
    let name = type + ".jpg"

    const storageRef = firebase.storage().ref()
    const UsersIdRef = storageRef.child(`users/${localStorage.getItem("user-Id")}/${name}`);
    
    return UsersIdRef.put(image)
  }
  
  uploadSertificates(file) {
    const storageRef = firebase.storage().ref()
    const UsersIdSertRef = storageRef.child(`users/${localStorage.getItem("user-Id")}/sertificates/${file.name}`)
    
    return UsersIdSertRef.put(file)
  }

  uploadAvatar(file) {
    const storageRef = firebase.storage().ref()
    // const fileExtension = file.name.split(".")[1] //получить расширение файла
    const UsersIdSertRef = storageRef.child(`users/${localStorage.getItem("user-Id")}/avatar.jpg`)
    
    return UsersIdSertRef.put(file)
  }

  getSertificatesList() {
    this.helper.toConsole("...качаем сертификаты")
    const storageRef = firebase.storage().ref()
    const UsersIdSerts = storageRef.child(`users/${localStorage.getItem("user-Id")}`)
    
    return UsersIdSerts.child("/sertificates").listAll()
  }
  
  getAvatar() {
    const storageRef = firebase.storage().ref()
    const UserAvatar = storageRef.child(`users/${localStorage.getItem("user-Id")}/avatar.jpg`)
    
    return UserAvatar.getDownloadURL()
    
  }
  
  async getDownloadLinks(files) {
    const sertsDownloadLinks = []
    
    for (let file in files) {
      if (!isNaN(+file)) {
        const storageRef = firebase.storage().ref()
        const storageImg = storageRef.child(`users/${localStorage.getItem("user-Id")}/sertificates/${files[file].name}`)
        console.log("скачивание сертификата ", storageImg.name);
        
        await storageImg.getDownloadURL()
          .then((link) => {
            sertsDownloadLinks[file] = link
          })
          .catch((err) => {
            console.log("Ошибка при скачивании сертификата: ", err);
          })
          
      }
    }
    
    // console.log("ссылки: ", sertsDownloadLinks);
    
    return sertsDownloadLinks
  }

  deleteSertificate(fileName) {
    const storageRef = firebase.storage().ref()
    const storageFile = storageRef.child(`users/${localStorage.getItem("user-Id")}/sertificates/${fileName}`)
    console.log("путь удаления файла - ", `users/${localStorage.getItem("user-Id")}/sertificates/${fileName}`);
    

    return storageFile.delete()
  }

  getDoctorsInfo() {
    return this.http.get(`${environment.FbDbUrl}/users/.json`)
  }

  getDoctorInfo(id) {
    return this.http.get(`${environment.FbDbUrl}/users/${id}.json`)
  }

  changeWorkHourBoolean(id, year, month, day, hour, hourSettings) {
    return this.http.put(`${environment.FbDbUrl}/doctorsSchedule/${id}/${year}/${month}/${day}/${hour}.json`, hourSettings)
  }


  getDoctorShedule(id) {
    return this.http.get(`${environment.FbDbUrl}/doctorsSchedule/${id}.json`)
  }

  makeALesson(time, doctor, client) {
    return this.http.put(`${environment.FbDbUrl}/lessons/${doctor.id}/${time.year}/${time.month}/${time.day}/${time.hour}.json`, client)
  }

}
