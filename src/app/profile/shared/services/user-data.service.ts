import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserClient, UserDoctor, AnyUser, UserDbInfo } from 'src/app/shared/interfaces';
import { tap } from 'rxjs/operators';
import { DebugHelper } from 'protractor/built/debugger';
import { DevelopHelp } from 'src/app/shared/services/develop-help.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { Router } from '@angular/router';

@Injectable()

export class UserData {


   myData: UserDbInfo = {
      name: "",
      surname: "",
      patronymic: "",
      userType: "client",
      description: "",
      // sertificatesLinks: [],
      // sertificatesNames: []
   }

   getDataError = "" 

   

   constructor(
      private helper: DevelopHelp,
      private auth: AuthService,
      private http: HttpClient,
      private firebase: FirebaseService,
      private popupService: PopupService,
      private router: Router
   ) {}


   initialization() {
      this.getMyData()
      .subscribe(
         (response: UserDbInfo) => {
            console.log("Получение данных (FB rltm-DB): ",response)
            if (response == null) {
               // this.router.navigate(['/profile'])
               this.firebase.signOut()
               console.log("user not found!")
               this.getDataError = "пользователь не найден"
               return
            }
            this.changeMyLocalData(response)
            if (this.myData.userType === "doctor") {
               this.getSertificates()
               this.checkMyLessons()
            } else if (this.myData.userType === "client") {
               if (this.myData.events) {
                  this.makeDatesOfEventsObject()
                  this.checkConfirmationOfMyLessons()
               }
            }
         },
         (err) => {
            console.log("ERROR: getting data from server");
         })
   }


   getMyData() {
      return this.http.get(`${environment.FbDbUrl}/users/${localStorage.getItem("user-Id")}.json`)
   }
   
   checkMyLessons() { //проверить свои новые уроки из events/...
      this.firebase.getAllLessons() //скач всех ивентов всех докторов
         .subscribe((resp) => {
            // console.log("все ивенты тут: ",resp)
            // console.log("!!!!!!",resp )
            const allLessonsArray = Object.entries(resp) //делаем массив всех уроков [[id, data],[id, data]],...
            console.log("lessons: ", allLessonsArray) 
            const myLessonsIdsFromServer = allLessonsArray.filter((item) => { //фильтр по урокам этого спеца
               const lessonIdParseArray = item[0].split("_"); //разделяем каждый Id урока на слова
               //*оставить если id пользователя == последней части id ивента
               return localStorage.getItem("user-Id") == lessonIdParseArray[lessonIdParseArray.length - 1]
            })
            // console.log(myLessonsIdsFromServer)
            //* проверка данных пользователя на наличие этих уроков в себе
            let newLessonsFound = false 
            let newLessonsToSend = {}
            if (!this.myData.events && myLessonsIdsFromServer) {
               this.myData.events = {} //*проверка, есть ли объект lessons в юзере
               newLessonsFound = true
               console.log("не было уроков в данных")
            }
            for(let lessonId of myLessonsIdsFromServer) {
               if (!this.myData.events[lessonId[0]]) { //*проверка, по каждому уроку
                  this.myData.events[lessonId[0]] = resp[lessonId[0]] //запись локально
                  newLessonsToSend[lessonId[0]] = resp[lessonId[0]]   //запись для отправления
                  newLessonsFound = true
                  console.log("найден новый урок", this.myData.events[lessonId[0]])
               }
            }
            if(newLessonsFound) {
               this.firebase.sendMyLessonsDataChanges(newLessonsToSend).subscribe(
               (resp) => {
                  console.log("новые уроки загружены: ", resp)
               },
               (err) => {
                  console.log("Ошибка обновления новых уроков: ", err)
               })
               

               // this.firebase.patchUserEvents(newLessonsToSend)
               
                  // .subscribe((resp) => {
                  //    console.log("новые уроки найдены и записаны в ячейку", resp)
                  // },
                  // (err) => {
                  //    console.log("Ошибка записи новых уроков: ", err)
                  // }) 
            } else {
               console.log("новых уроков не обнаружено")
            }
            this.makeDatesOfEventsObject()
            
         },
         (err) => {
            console.log("ошибка. не удалось найти ивенты", err)
         })
   }

   checkConfirmationOfMyLessons() { //проверка на подтвеждение спеца (если в себе урок не подтвержден, а на серваке уже подтвержден)
      
      let myEvents = Object.entries(this.myData.events)
      const myFutureNonconfirmedLessons = myEvents //= создание подобъекта будущих неподтвержденных уроков
         .filter(item => { 
            const lessonIdParseArray = item[0].split("_"); //разделяем каждый Id урока на слова
            //*оставить если год\месяц\день будущие и неподтвержден
            const date = new Date()
            const day = date.getDate()
            const month = date.getMonth()
            const year = date.getFullYear()
            const isFuture = Number(lessonIdParseArray[0]) >= year && Number(lessonIdParseArray[1]) >= month && Number(lessonIdParseArray[2]) >= day
            const isNonConfirmed = item[1].doctorsConfirmation == false
            // console.log(isFuture && isNonConfirmed)
            return isFuture && isNonConfirmed
         })
      console.log(myFutureNonconfirmedLessons)

      if (myFutureNonconfirmedLessons) { //!добавить проверку есть ли вообще уроки без подтверждения (работает вообще или нет)
         this.firebase.getAllLessons() //качаем все уроки
            .subscribe((resp) => {
               let myNewLessonData = {}
               for (let i of myFutureNonconfirmedLessons) { //ищем свои и сравниваем
                  // console.log(i[0])
                  if (resp[0] && resp[i[0]].doctorsConfirmation == true) { //если нашли что какой-то уже подтвержден, то запоминаем
                     console.log(`${i[0]}: `,resp[i[0]])
                     this.myData.events[i[0]].doctorsConfirmation = true
                     myNewLessonData[i[0]] = this.myData.events[i[0]]
                  }
               }
               if (Object.keys(myNewLessonData).length != 0) { //если нашли новые подтвержденные наши уроки, то сохраняем в FB
                  this.sendMyLessonsDataChanges(myNewLessonData) //отправка в FB/user/id/events/ нужных ивентов с doctorsConfirmation == true 
                     .subscribe((resp) => {
                        console.log("статус урока обновлен у пациента", resp)
                     },
                     (err) => {
                        console.log("Ошибка обновления статуса урокка у клиента", err)
                     })
               }
            },
            (err) => {
               console.log("ошибка скачки всех ивентов с firebase")
            })
      } 

         
   }

   

   // createLessonsChangesObject() {
   //    let myNewLessonData = {}
   //    myNewLessonData[eventId] = JSON.parse(JSON.stringify(eventLesson))
   //    delete myNewLessonData[eventId].daysLeft
   //    console.log(myNewLessonData)
   //    // myNewLessonData.lessons.lessonId = eventId
   //    this.userData.sendMyLessonsDataChanges(myNewLessonData)
   //       .subscribe((resp) => {
   //       console.log("урок добавлен в ячейку пользователя", resp)
         
   //       },
   //       (err) => {
   //       console.log("Ошибка добавления в ячейку пользователя", err)
   //       })
   // }

   makeDatesOfEventsObject() { //= создание нужного формата ивентов для отображения(дней в календаре, и т.д.)
      this.myData.eventsDates = {}
      // console.log(Object.assign(this.myData.events))
      // console.log(this.myData.events)
      let lessonsDates = {} 
      for(let lessonObj in this.myData.events) {
         const thisDate = this.myData.events[lessonObj].date
         const thistime = this.myData.events[lessonObj].time
         const newLessonTime = {
            [thisDate.year]: { //= создание объекта year-month-day-time
               [thisDate.month]: {
                  [thisDate.day]: {
                     [thistime]: {}
                  }
               }
            }
         }
         //= слияние нового объекта m(newLessonTime) и основного (lessonsDates)
         if (!lessonsDates[thisDate.year]) lessonsDates[thisDate.year] = {}
         if (!lessonsDates[thisDate.year][thisDate.month]) lessonsDates[thisDate.year][thisDate.month] = {}
         if (!lessonsDates[thisDate.year][thisDate.month][thisDate.day]) lessonsDates[thisDate.year][thisDate.month][thisDate.day] = {}
         if (!lessonsDates[thisDate.year][thisDate.month][thisDate.day][thistime]) 
            lessonsDates[thisDate.year][thisDate.month][thisDate.day][thistime] = 
            {
               patientName: this.myData.events[lessonObj].patientName,
               doctorName: this.myData.events[lessonObj].doctorName,
               problemDescription: this.myData.events[lessonObj].problemDescription
            }
      }
      this.myData.eventsDates = lessonsDates
      // console.log("!!!!!",this.myData)
      // this.myData.eventsDates[]
      // console.log(this.myData)
   }

   getSertificates() { //скачивание сертификатов и форматирование в массив
      this.firebase.getSertificatesList() //скач кривого формата
         .then((files) => {
            console.log("мои файлы", files.items)
            this.saveSertificatesNames(files.items)
            this.firebase.getDownloadLinks(files.items) //вытаскивание ссылок
            .then((links) => {
               console.log("полученные ссылки на скачку: ", links)
               this.myData.sertificatesLinks = links
               // this.updateSertifUrls() //! раскоментировать и проверить
            })
            
            
         })
         .catch((err) => {
            console.log("мои файлы не найдены: ", err);
         })
   }

   updateSertifUrls() { //загрузить новые ссылки на сертификаты в FB
      // this.firebase.updateSertifUrls()
      console.log("изменение sertList(???)")
      // console.log(this.userData.myData)
      let newUserData = {
        sertificatesLinks: this.myData.sertificatesLinks
      }
      
      console.log(newUserData)
      this.firebase.sendMyDataChanges(newUserData)
      .subscribe((resp) => {
        console.log("sertList uploaded")
      },
      (err) => {
        console.log("sertList uploading ERROR:", err)
      })
   }

   saveSertificatesNames(sertificates) {
      this.myData.sertificatesNames = []
      for (let file in sertificates) {
         if (!isNaN(+file)) {
            // console.log("добавление ", sertificates[file].name);
            
            this.myData.sertificatesNames[file] = (sertificates[file].name)
         }
      }
      console.log("мои сертификаты: ", this.myData.sertificatesNames);
   }

   changeMyLocalData(userData: UserDbInfo) {
      this.myData = userData
   }


   // checkEmailVerify() {
   //    // console.log(this.myData.emailVerified);
   //    if (this.myData.emailVerified === undefined) {
   //       console.log("myData.emailVerified не найдено");
   //       this.myData.emailVerified = false
   //       const newData = {
   //          emailVerified: false,
   //       }
   //       this.sendMyDataChanges(newData)
   //       .subscribe((resp) => {
   //          console.log("добавлено поле emailVerified = false")
   //          this.popupService.emailVerifyPopup = true
   //       })
   //    } else if (this.myData.emailVerified === false) {
   //       console.log("myData.emailVerified: false");
   //       this.popupService.emailVerifyPopup = true
   //    } else if (this.myData.emailVerified === true) {
   //       console.log("myData.emailVerified: true");
   //       this.popupService.emailVerifyPopup = false
   //    }
   // }

   sendMyDataChanges(newUserData) {
      // let firebaseUserType
      // if (userType == "client") firebaseUserType = "patients"
      // else firebaseUserType = "doctors"
      return this.http.patch(`${environment.FbDbUrl}/users/${localStorage.getItem("user-Id")}.json`, newUserData)
   }

   sendMyLessonsDataChanges(newLessonData) {
      // let firebaseUserType
      // if (userType == "client") firebaseUserType = "patients"
      // else firebaseUserType = "doctors"
      return this.http.patch(`${environment.FbDbUrl}/users/${localStorage.getItem("user-Id")}/events.json`, newLessonData)
   }

   sendTestDataChanges(newTestData) {
      return this.http.patch(`${environment.FbDbUrl}/users/${localStorage.getItem("user-Id")}/events.json`, newTestData)
   }


}