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
import { ActivatedRoute, Params } from '@angular/router';
import { UserData } from 'src/app/profile/shared/services/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnInit {

  signedIn = false
  actionCode: string

  constructor(
    private helper: DevelopHelp,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    // private userData: UserData
    ) {
      firebase.initializeApp(firebaseConfig)
      // this.userObserver()
    }

  ngOnInit(): void {
    console.log("auth = ",firebase.auth);
    
  }

  userObserver() {
    firebase.auth().onAuthStateChanged((user) =>{
      if(user){
        console.log("User is signed in (userObserver)", user);
        this.signedIn = true
        return user
      }else{
        console.log("User is signed out")
      }
    })
  }
  
  checkUser() {
    const user = firebase.auth().currentUser
    return user ? true : false
  }

  getUser() {
    return firebase.auth().currentUser
  }
  
  

  signOutCurrentUser() {
    this.signedIn = false
    return firebase.auth().signOut()
  }

  applyActionCode(code) {
    console.log("ОТПРАВКА КОДА: ", code);
    return firebase.auth().applyActionCode(code)
  }

  // checkActionCode() {
  //   console.log("checking action code: ", this.actionCode);
  //   firebase.auth().checkActionCode(this.actionCode)
  //     .then((resp) => {
  //       console.log("successfull: ", resp)
  //       this.applyActionCode()
  //     })
  //     .catch((err) => console.log("ERROR: ", err))
  // }


  sendVerificationEmail() {
    const user = firebase.auth().currentUser
    console.log(`отправка письма для подтверждения на почту (новое) ${user.email}`)
    var actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: 'http://localhost:4200/profile/menu',
      // This must be true.
      handleCodeInApp: true,
      
      // dynamicLinkDomain: 'http://localhost:4200/profile/menu'
    }

    return firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
  }

  checkActionCode(code) {
    return firebase.auth().checkActionCode(code)
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

  createNewPatientDataObject(user, result) { //шо то фигня
    this.helper.toConsole("инфа для заполнения пациента: ", user)
    this.helper.toConsole("Id нового пациента: ", result.user.uid)
    return this.http.put(`${environment.FbDbUrl}/users/patients/${result.user.uid}.json`, user)
    
  }

  createNewDoctorDataObject(user, result) { //шо это фигня
    this.helper.toConsole("инфа для заполнения пациента: ", user)
    this.helper.toConsole("Id нового пациента: ", result.user.uid)
    return this.http.put(`${environment.FbDbUrl}/users/doctors/${result.user.uid}.json`, user)
    
  }


  signInWithPass(user: User) {
    // this.userObserver()
    this.helper.toConsole("вход в систему через firebase...")
    return firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  }

  sendPasswordResetEmail(email) {
    return firebase.auth().sendPasswordResetEmail(email)
  }

  changeEmail(newEmail) {
    return firebase.auth().currentUser.updateEmail(newEmail)
  }

  resetPassword(oobCode, newPassword) {
    return firebase.auth().confirmPasswordReset(oobCode, newPassword)
  }

  passwordChange(newPassword) {
    let user = firebase.auth().currentUser;
    return user.updatePassword(newPassword)
  }

  reauthenticateWithCredential(token) {
    let user = firebase.auth().currentUser
    user.reauthenticateWithCredential(token)
    .then(() => {
      console.log("reauthenticate success!");
    })
    .catch((err) => {
      console.log("reauthenticate error: ", err);
    })
  }

  getCurrentUser() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("User is signed in");
      } else {
        console.log("No user is signed in");
      }
    });
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
        // console.log("скачивание сертификата ", storageImg.name);
        
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

  changeShedule(id, newShedule) {
    return this.http.put(`${environment.FbDbUrl}/doctorsDaysOfWeekSchedule/${id}.json`, newShedule)
  }


  getDoctorShedule(id) {
    return this.http.get(`${environment.FbDbUrl}/doctorsDaysOfWeekSchedule/${id}.json`)
  }



  getDoctorLessons(id) {
    return this.http.get(`${environment.FbDbUrl}/lessons/${id}.json`)
  }

  getDoctorLessonsTest(id) {
    return this.http.get(`${environment.FbDbUrl}/lessons.json`)
  }

  checkLessonEngage(eventId) {
    return this.http.get(`${environment.FbDbUrl}/events/${eventId}.json`)
  }

  getAllLessons() {
    return this.http.get(`${environment.FbDbUrl}/events.json`)
  }

  makeALesson(eventLesson, eventId) {
     return this.http.put(`${environment.FbDbUrl}/events/${eventId}.json`, eventLesson)
  }

  getEvents() {
    return this.http.get(`${environment.FbDbUrl}/events.json`)
  }

  getDoctorlessons(id) {
    return this.http.get(`${environment.FbDbUrl}/lessons/${id}.json`)
  }

  updateEvent(eventLesson, eventId) {
    let myNewLessonData = {}
    myNewLessonData[eventId] = JSON.parse(JSON.stringify(eventLesson))
    delete myNewLessonData[eventId].daysLeft
    console.log(myNewLessonData)
    // myNewLessonData.lessons.lessonId = eventId
    console.log("!!!!!!!!!!!",eventLesson, eventId)
    return this.http.patch(`${environment.FbDbUrl}/events.json`, myNewLessonData)
  }

  

}
