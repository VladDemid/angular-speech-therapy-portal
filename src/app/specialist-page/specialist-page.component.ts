import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { UserDoctor } from '../shared/interfaces';
import { CrypterService } from '../shared/services/crypter.service';
import { UserData } from 'src/app/profile/shared/services/user-data.service';
import { FirebaseService } from '../shared/services/firebase.service';
import { DevelopHelp } from '../shared/services/develop-help.service';
import { TestBed } from '@angular/core/testing';
import { PopupService } from '../shared/services/popup.service';

@Component({
  selector: 'app-specialist-page',
  templateUrl: './specialist-page.component.html',
  styleUrls: ['./specialist-page.component.sass']
})
export class SpecialistPageComponent implements OnInit {

  defaultAvatarUrl = "https://firebasestorage.googleapis.com/v0/b/inclusive-test.appspot.com/o/users%2Fdefault-user-avatar.png?alt=media&token=59fe0397-e8df-467e-82cf-e7dc3aa3b60b"
  doctorInfo: UserDoctor
  doctorSertificates: any[]
  doctorEventsYearMonthDayHour: object
  doctorId: string
  isInProfileModule = "false" //может быть строкой т.к. params возвращает строку
  

  constructor(
    private firebase: FirebaseService,
    private route: ActivatedRoute,
    private crypter: CrypterService,
    public helper: DevelopHelp,
    public userData: UserData,
    public popupService: PopupService
  ) { }

  ngOnInit(): void {
    this.getDoctor() //скачивает данные доктора
    this.checkUserData() //проверяет данные пользователя (клиента), если F5
  }

  getDoctor() {
    this.route.queryParams
    .subscribe((params) => {
      this.isInProfileModule = params.returnToProfileModule //откуда пользователь попал на стр. доктора из профиля/из главной стр.
      this.doctorId = this.crypter.decrypt(params.id) //запись id доктора для инжектирования (ауф) в календарь
      this.firebase.getDoctorInfo(this.crypter.decrypt(params.id))
      .subscribe((doctorInfo: UserDoctor) => {
        this.doctorInfo = doctorInfo
        console.log("данные доктора загружены");
        console.log(doctorInfo);
        this.getSertificates()
        // this.sortDoctorLessons(doctorInfo)
        this.getDoctorsEventsDates(doctorInfo)
      })
    })
  }

  getSertificates() {
    console.log("поиск сертификатов")
    this.firebase.getSertificatesList(this.doctorId)
      .then((resp) => {
        console.log("сертификаты: ", resp.items)
        this.doctorSertificates = resp.items
        // resp.items.forEach(item => {
          
        // });
      })
      .catch((err) => {
        console.log("ошибка поиска сертификатов: ", err)
      })
  }


  getDoctorsEventsDates(doctorInfo) {
    doctorInfo.ordersFutureIds = this.getFutureOrdersIds(doctorInfo)
    // this.updateFutureOrders(this.myData.ordersFutureIds)
  }

  getFutureOrdersIds(doctorInfo) {
    let result = null
    let ordersFuture = null
    let date = new Date()
    let currDate = new Date()
    if (doctorInfo.orders) {
      console.log("doctorInfo.orders: ", doctorInfo.orders, ordersFuture)
      ordersFuture = Object.keys(doctorInfo.orders).filter((el) => {
          return this.userData.checkIsFutureOrder(el, currDate) 
      })
      let ordersFutureSortedObj = []
      ordersFuture.forEach( (orderId, i) => {
          // console.log(orderId)
          const orderSplit = orderId.split("_")
          this.setOrdersFutureDates(orderSplit, doctorInfo, orderId)
          const currentDate = new Date(orderSplit[0], orderSplit[1], orderSplit[2], orderSplit[3])
          ordersFutureSortedObj[i] = [orderId, currentDate.getTime()]
      });
      ordersFutureSortedObj.sort((a, b) => {return a[1] - b[1]})
      result = ordersFutureSortedObj.map((el) => el[0] )
    } 

    // console.log("result: ", result)
    return result
  }

  setOrdersFutureDates(orderSplit, doctorInfo, orderId) {
    const orderData = doctorInfo.orders[orderId]
    if (!doctorInfo.ordersFutureDates) {
      doctorInfo.ordersFutureDates = {}
    }
    if (!doctorInfo.ordersFutureDates[orderSplit[0]]) {
      doctorInfo.ordersFutureDates[orderSplit[0]] = {}
    }
    if (!doctorInfo.ordersFutureDates[orderSplit[0]][orderSplit[1]]) {
      doctorInfo.ordersFutureDates[orderSplit[0]][orderSplit[1]] = {}
    }
    if (!doctorInfo.ordersFutureDates[orderSplit[0]][orderSplit[1]][orderSplit[2]]) {
      doctorInfo.ordersFutureDates[orderSplit[0]][orderSplit[1]][orderSplit[2]] = {}
    }
    if (!doctorInfo.ordersFutureDates[orderSplit[0]][orderSplit[1]][orderSplit[2]][orderSplit[3]]) {
      doctorInfo.ordersFutureDates[orderSplit[0]][orderSplit[1]][orderSplit[2]][orderSplit[3]] = orderData
    }
    
 }

  // sortDoctorLessons(doctorInfo) { 
  //   if (doctorInfo.events) {
  //     const allDoctorLessonsArray = Object.entries(doctorInfo.events)
  //   } else return
  //   let lessonsDates = {} //год->месяц->день->час
  //   for(let lessonObj in this.doctorInfo.events) {
  //     const thisDate = this.doctorInfo.events[lessonObj].date
  //     const thistime = this.doctorInfo.events[lessonObj].time
  //     const newLessonTime = {
  //        [thisDate.year]: { //= создание объекта year-month-day-time
  //           [thisDate.month]: {
  //              [thisDate.day]: {
  //                 [thistime]: {}
  //              }
  //           }
  //        }
  //     }

  //     //= слияние нового объекта m(newLessonTime) и основного (lessonsDates)  (хз зачем это тут)
  //     if (!lessonsDates[thisDate.year]) lessonsDates[thisDate.year] = {}
  //     if (!lessonsDates[thisDate.year][thisDate.month]) lessonsDates[thisDate.year][thisDate.month] = {}
  //     if (!lessonsDates[thisDate.year][thisDate.month][thisDate.day]) lessonsDates[thisDate.year][thisDate.month][thisDate.day] = {}
  //     if (!lessonsDates[thisDate.year][thisDate.month][thisDate.day][thistime]) 
  //        lessonsDates[thisDate.year][thisDate.month][thisDate.day][thistime] = 
  //        {
  //           patientName: this.doctorInfo.events[lessonObj].patientName,
  //           doctorName: this.doctorInfo.events[lessonObj].doctorName,
  //           problemDescription: this.doctorInfo.events[lessonObj].problemDescription
  //        }
  //   }
  //   console.log("lessonsDates: ",lessonsDates)
  //   this.doctorEventsYearMonthDayHour = lessonsDates
  //   // console.log(lessonsDates)


  // }


  checkUserData() { //скачивает данные пользователя если F5
    if (this.isInProfileModule == "true" && !this.userData.myData?.name) {
      this.userData.initialization()
    }
  }

  decryptId() {

  }

  cryptDoctorId() {
    this.route.queryParams
    .subscribe((params) => {
      console.log(this.crypter.encrypt(""+params.id));
      console.log(this.crypter.decrypt("U2FsdGVkX1+HUjkmIk7PKmElj+3TsKZAURD2gSitKXrM3f6Hobs0/dUguZij+sNo"));
      
    })
  }

}
