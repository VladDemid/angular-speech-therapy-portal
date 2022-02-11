import { Injectable, OnInit } from '@angular/core';
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"
import "firebase/functions"
import { firebaseConfig, environment, emailConfig } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DevelopHelp } from './develop-help.service';
import { EmailData, User, UserCredentials } from 'src/app/shared/interfaces'
import { Observable, Subject } from 'rxjs';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserData } from 'src/app/profile/shared/services/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnInit {


  shortIds = null
  signedIn = false
  actionCode: string
  functions = {}
  currentUser = null
  userToken = ""
  
  constructor(
    private helper: DevelopHelp,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    // private userData: UserData
    ) {
      firebase.initializeApp(firebaseConfig)
      firebase.auth().onAuthStateChanged((user) => this.onAuthStateChanged(user))
      // this.userObserver()
      this.functions = firebase.functions()
      // this.timerLogger()
    }
    
  ngOnInit(): void {
    console.log("auth = ",firebase.auth);
    // this.currentUser1 = firebase.auth().currentUser
    // console.log(this.currentUser, this.currentUser1)
  }


  onAuthStateChanged(user) {
    
    this.currentUser = user
    this.setUserToken()
  }

  setObserverOnUserToken() {
    // const user = new Subject<object>()
    // const currentUser$ = user.asObservable()
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

  timerLogger() {
    const timer = setInterval(() => {
      // console.log("1: ", this.currentUser, "2: ", this.currentUser1)
    }, 300)

  }

  testEmailFunction() {
    const fireHttpEmail = firebase.functions().httpsCallable('fireHttpEmail');
    return fireHttpEmail({
      to: "mr.zgot@yandex.ru",
      from: "vlatidos@gmail.com",
      templateId: emailConfig.EMAIL_TEMPLATES.MAIN_PAGE_FEEDBACK,
      dynamicTemplateData: {
         text: "тут текст",
         subject: "Тема письма",
         name: 'кастомноеИмя'
      }
      
    })

  }

  testFunctionRandom() {
    const randomNumberCall = firebase.functions().httpsCallable('randomNumberCall');
    return randomNumberCall()

  }

  testAlfa(): Promise<any> {
    const alfaTest = firebase.functions().httpsCallable('alfaReq');
    return alfaTest()
  }

  
  alfaREST(action, orderId, isProd) {
    // getOrderStatusExtended.do - состояние заказа
    // deposit.do - регистрация заказа
    return this.http.get(`https://us-central1-inclusive-test.cloudfunctions.net/alfaReq?actionUrl=${action}&orderId=${orderId}&isProd=${isProd}`)
  }
  
  testAlfaREST() {
    return this.http.get("https://us-central1-inclusive-test.cloudfunctions.net/alfaReq?actionUrl=getOrderStatusExtended.do")
  }
  
  testGetAlfaAll(action, isProd) {
    return this.http.get(`https://us-central1-inclusive-test.cloudfunctions.net/alfaAllReq?actionUrl=${action}&isProd=${isProd}`)
  }

  testQuery() {
    return this.http.get("https://us-central1-inclusive-test.cloudfunctions.net/queryTest?test=1243")
  }
  
  authFuncTest(data) {
    const fireHttpEmail = firebase.functions().httpsCallable('alfaCall');
    return fireHttpEmail(data)
  }

  sendEmailFunction(msg: EmailData) {
    const fireHttpEmail = firebase.functions().httpsCallable('fireHttpEmail');
    return fireHttpEmail(msg)

    // {
    //   to: "mr.zgot@yandex.ru",
    //   from: "vlatidos@gmail.com",
    //   dynamicTemplateData: {
    //      text: "тут текст",
    //      subject: "Тема письма",
    //      name: 'кастомноеИмя'
    //   }
    // }

  }

  isAuthenticated() { //вроде работает
    return !!firebase.auth().currentUser
  }

  setUid(userCredentials: UserCredentials) { //вроде не нужно теперь
    localStorage.setItem("user-Id",  userCredentials.uid)
    console.log("authorization completed")
  }
  
  checkUser() { //?? Нахрена такой огород
    const user = firebase.auth().currentUser
    return user ? true : false
  }

  getUser() {
    return firebase.auth().currentUser
  }

  setUserToken() { 
    firebase.auth().currentUser?.getIdToken()
    .then((resp) => {
      this.userToken = resp
      // console.log("token set")
    })
    .catch((err) => {
      console.log("set FB token ERROR: ", err)
    })
  }

  getUserToken() {
    return this.userToken
  }

  getUserData() {
    const user = this.getUser()
    const userId = user.uid
    var userRef = firebase.database().ref('users/' + userId );
    userRef.on('value', (snapshot) => {
      const data = snapshot.val();
      console.log(data)
    });
  }

  getShortIds() {
    // const user = this.getUser()
    // const userId = user.uid
    var userRef = firebase.database().ref('shortIds');
    userRef.on('value', (snapshot) => {
      const data = snapshot.val();
      this.shortIds = data
      // console.log(data)
    });
  }
  
  patchUserData(newData) {
    const user = this.getUser()
    const userId = user.uid
    const path = 'users/' + userId + "/newTest"
    // var userRef = firebase.database().ref('users/' + userId );
    return firebase.database().ref(path).update(newData);
  }

  patchUserDataFromAdmin(newData, userId) {
    const path = 'users/' + userId
    // var userRef = firebase.database().ref('users/' + userId );
    return firebase.database().ref(path).update(newData);
  }

  patchDataByPath(newData, path) {
    // const path = 'users/' + userId
    // var userRef = firebase.database().ref('users/' + userId );
    return firebase.database().ref(path).update(newData);
  }

  TESTmanualREST() {
    const authToken = this.getUserToken()
    // console.log(authToken)
    const newUserData = {
      test: 123,
      test3: "32425354"
    }
    return this.http.patch(`${environment.FbDbUrl}/users/${localStorage.getItem("user-Id")}/new.json?auth=${authToken}`, newUserData)
  }
  

  signOut(query?) { //замена прошлому signOut (auth)
    this.signedIn = false
    localStorage.clear()
    console.log("FB signOut")
    if (!query) {
      this.router.navigate(['/'])
    } else if (query === "needLogin") {
      this.router.navigate(["/"], {
        queryParams: {
           needLogin: true
        }
     })
    }
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

  sendMyDataChanges(newUserData) { //обновить часть данных
    return this.http.patch(`${environment.FbDbUrl}/users/${localStorage.getItem("user-Id")}.json?auth=${this.userToken}`, newUserData)
  }

  sendMyLessonsDataChanges(newLessonData) {
    return this.http.patch(`${environment.FbDbUrl}/users/${localStorage.getItem("user-Id")}/events.json?auth=${this.userToken}`, newLessonData)
  }
  
  registrNewUser(newUser) {
    console.log("Try to create new user: ", newUser)
    return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
  }

  createNewUserDataObject(user, result) {
    console.log("инфа для заполнения пользователя: ", user)
    console.log("Id нового пользователя: ", result.user.uid)
    return this.http.put(`${environment.FbDbUrl}/users/${result.user.uid}.json`, user)
  }

  createNewUserDBbyAdmin(userId, userInfo) { //data-base object
    console.log("инфа для заполнения пользователя: ", userId)
    return this.http.put(`${environment.FbDbUrl}/users/${userId}.json?auth=${this.userToken}`, userInfo)
  }

  TESTcreateNewUserDataObject(userId, userInfo) {
    console.log("инфа для заполнения пользователя: ", userId)
    return this.http.put(`${environment.FbDbUrl}/users/${userId}.json?auth=${this.userToken}`, userInfo)
    
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
    console.log("firebase signIn @ & Pass...")
    return firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  }

  setPersistence() {
    return firebase.auth().setPersistence("local")
  }

  signInWithPassNew(user: User) {
    console.log("FB login...")
    console.log("setPersistence local")
    firebase.auth().setPersistence("local")
    .then(() => {
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((userCredentials) => {
          this.currentUser = userCredentials.user
        })
        .catch((err) => {
          console.log("signInWithEmailAndPassword ERRORO: ", err)
        })
      })
    .catch((err) => {
        console.log("setPersistence ERROR: ", err)
      })
    
    // this.userObserver()
  }

  // signOut() {
  //   return firebase.auth().signOut()
  // }

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

  getSertificatesList(userId?) {
    if (!userId) { //для edit page доктора
      userId = localStorage.getItem("user-Id")
      // console.log(userId, "34524352456362345")
    } 
    
    console.log("...качаем сертификаты")
    const storageRef = firebase.storage().ref()
    const UsersIdSerts = storageRef.child(`users/${userId}`)
    
    return UsersIdSerts.child("/sertificates").listAll()
  }


  
  getAvatar() {
    const storageRef = firebase.storage().ref()
    const UserAvatar = storageRef.child(`users/${localStorage.getItem("user-Id")}/avatar.jpg`)
    
    return UserAvatar.getDownloadURL()
    
  }
  
  async getDownloadLinks(files) { //вытаскивание ссылок 
    const sertsDownloadLinks = []
    // console.log("на входе: ", files) //непонятный формат, где есть имя файла
    
    const storageRef = firebase.storage().ref()
    for (let file in files) { //по каждому имени файла запрашивать URL адреса сертификатов
      // console.log(file)
      if (!isNaN(+file)) {
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

  patchUserEvents(newLessonData) { //???
    const userEvents = firebase.database().ref(`users/${localStorage.getItem("user-Id")}/events`);
    return userEvents.update(newLessonData);
    // return this.http.patch(`${environment.FbDbUrl}/users/${localStorage.getItem("user-Id")}/events.json`, newLessonData)
 }

  getUserEvents() {
    const userEvents = firebase.database().ref(`users/${localStorage.getItem("user-Id")}/events`);
    return userEvents.get();
  }


  

}




