import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { log } from 'console';
import { alfaRegistrationResp, UserDoctor } from '../../interfaces';
import { FirebaseService } from '../../services/firebase.service';
import { PopupService } from '../../services/popup.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserData } from 'src/app/profile/shared/services/user-data.service';
import { DebugHelper } from 'protractor/built/debugger';
import { DevelopHelp } from '../../services/develop-help.service';
import { emailConfig, environment, zoomConfig } from 'src/environments/environment';
import { TelegramBotService } from '../../services/telegram-bot.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendar-block',
  templateUrl: './calendar-block.component.html',
  styleUrls: ['./calendar-block.component.sass']
})
export class CalendarBlockComponent implements OnInit {

  
  @Input() inputDoctorInfo: UserDoctor;
  @Input() doctorEventsYearMonthDayHour: object; //только для .html файла 
  @Input() isCalendarPage: boolean;
  @Input() calendarUserId: string;
  @Input() isInProfileModule: boolean | string; // string|boolean

  production = environment.production

  currentHour = new Date().getHours()
  selectedDay = 30 // номер дня (-1\ 1-31) 
  selectedDayOfWeek = -1
  day = new Date().getDate() //текущий день
  month = new Date().getMonth() + 1 //меняется при листании календаря
  currentMonth = new Date().getMonth() + 1 //1 = январь, 12 = декабрь (не меняется)
  year = new Date().getFullYear() //меняется при листании календаря
  currentYear = new Date().getFullYear() //не меняется при листании
  daysArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  currentDays: number //число дней в месяце
  monthsNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
  monthsNamesWhomCase = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"]
  monthName = ""
  daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пн", "Сб", "Вс"]
  currentFirstDay: number //день недели 1-го числа месяца месяца (1-7)
  selectedHourForLesson = -1 //выбранное клиентом время записи (8-22 часа workStart-workEnd)
  selectedTimeForLesson: any = '9:50'  //выбранное клиентом время записи (workGapsCln[n])
  updatingdWorkHourData = false //чтобы при каждом клике подряд не скачивать инфу
  workStart = 8
  workEnd = 22
  orderDetails = {}
  workGapsCln = ["9:00", "9:50", "10:40", "11:30", "12:20", "13:10", "14:00", "14:50", "15:40", "16:30", "17:20", "18:10", "19:00", "19:50", "20:40", "21:30"]
  scheduleHours = {}
  newScheduleHours = {} //для визуализации загрузки этих часов
  manualAddOrder = true
  
  workTEST = false
  workHoursArray = []
  doctorShedule = {}
  doctorsLessons = {}
  doctorAlertSign: string
  patientProblem = ""
  // withChild = "0" //проблема у ребенка или нет 0/1
  errorMakingLesson = ""
  successMakingLesson = ""
  asideIsExpanded = false
  expandSign = "Развернуть"
  isLoading = false
  isMakingAppointment = true //костыль
  
  daysOfWeekShedule = {}
  newDaysOfWeekShedule = {}
  environment: any;

  
  constructor(
    private firebase: FirebaseService,
    public popupService: PopupService,
    private router: Router,
    private auth: AuthService,
    public userData: UserData,
    public helper: DevelopHelp,
    private telegram: TelegramBotService,
  ) {
    // this.preventBubbling()

  }
    
  ngOnInit(): void {
    this.setMonthName()
    this.showDays()
    // this.makeHoursArray()
    // if (this.userData.myData.userType == "doctor") {
      
    this.waitForInfo() //после подгрузки инфы грузить все
    // this.triggerFalseClick()
  // }
  }


  // preventBubbling() {

  //   console.log("prevent Bubbling")
  //   var elements = document.getElementsByClassName("manual-add");

  //   for (var i = 0; i < elements.length; i++) {
  //       elements[i].addEventListener('click', el => {
  //         el.stopPropagation()
  //       });
  //   }
  // }

  waitForInfo() { //ждать подгрузки инфы себя (в профиле) (в случае F5 на странице календаря например)
    if (this.isInProfileModule == true && this.userData.myData.name == "") {
      const infoFound = setInterval(() => {
        console.log('waiting for user info')
        if (this.userData.myData.name != "") {
          clearInterval(infoFound)
          this.checkShedule()
        }
      }, 100)
    } else this.checkShedule()
    
  }

  checkShedule() {
    if (this.userData.myData.scheduleTime) {
      this.scheduleHours = this.userData.myData.scheduleTime
    }
    // console.log("scheduleHours:", this.scheduleHours)
  }

  downloadSheduleInfo() { //! (хз устарело или нет)скан рабочих часов + занятых уроков 
    if ((this.userData.myData.userType == 'doctor' && this.isCalendarPage) || !this.isCalendarPage) {
      this.firebase.getDoctorShedule(this.calendarUserId) 
      .subscribe((resp) => {
        console.log("расписание доктора скачано: ", resp);
        // this.writeShedules(resp)
        // Object.assign(this.daysOfWeekShedule, resp)
        // this.daysOfWeekShedule = resp;
        // Object.assign(this.daysOfWeekShedule, resp)
        this.daysOfWeekShedule = JSON.parse(JSON.stringify(resp))
        if (this.daysOfWeekShedule != null) { //если доктор заполнил расписание 
          for(let i = 0; i<=6; i++) { //для работы Object.assign(). заполнить пустые ключи 
            if(!this.daysOfWeekShedule[i]) {this.daysOfWeekShedule[i] = null}
          }
          // Object.assign(this.newDaysOfWeekShedule, this.daysOfWeekShedule)
          this.newDaysOfWeekShedule = JSON.parse(JSON.stringify(this.daysOfWeekShedule))
        } else {
          this.daysOfWeekShedule = {1: null, 2: null, 3:null, 4:null, 5: null, 6: null, 7: null}
        }
      },
      (err) => {
        console.log("ошибка при скачивании расписании доктора: ", err);
      })
  
      this.firebase.getDoctorLessons(this.calendarUserId) 
      .subscribe((resp) => {
        console.log("занятые часы(купленные) доктора скачано: ", resp);
        this.doctorsLessons = resp
      },
      (err) => {
        console.log("ошибка при скачивании занятых часов(купленных): ", err);
      })
    } 
  } 

  // makeHoursArray() {
  //   for (let i = this.workStart; i <= this.workEnd; i++) { 
  //     this.workHoursArray.push(i) //массив всех часов для html ngFor
  //     // this.selectedDayHoursSettings[i] = {"workTime": false}
  //   }
  // }


  increaseMonth() {
    this.month++
    if (this.month == 13) {
      this.month = 1
      this.year++
    }
    this.resetDayTime()
    this.setMonthName()
    this.showDays()
  }

  decreaseMonth() {
    
    this.month--
    if (this.month == 0) {
      this.month = 12
      this.year--
    }
    this.resetDayTime()
    this.setMonthName()
    this.showDays()
  }

  resetDayTime() {
    this.selectedDay = -1 //сброс дня
    this.selectedHourForLesson = -1 //сброс часа
    this.selectedTimeForLesson = -1 //сброс часа
  }

  setMonthName() {
    this.monthName = this.monthsNames[this.month - 1]
  }

  showDays() {
    let m = this.month
    let y = this.year
    let days = new Date(y, m, 0).getDate()

    this.currentDays = days 
    this.daysArr = [] //массив дней от 0 до 30 например
    for(let i = 1; i <= days; i++) this.daysArr.push(i);
    
    this.getFirstDayOfWeek();
  }

  getFirstDayOfWeek () { //возвращает 1-7 (Пн-Вс)
    let firstDay = new Date(this.year, this.month - 1, 1)
    // console.log(firstDay);
    if (firstDay.getDay() == 0) {
      this.currentFirstDay = 7
      return
    }
    this.currentFirstDay = firstDay.getDay() // т.к. помоешная нумерация (Вс = 0, Пн = 1...)
    return 
  }

  onDayClick(dayIndex) { //номер дня (1-31)
    // console.log(this.year, this.month, dayIndex);
    this.selectedDay = dayIndex
    this.selectedTimeForLesson = -1
    this.selectedDayOfWeek = (this.currentFirstDay + this.selectedDay - 1)%7

  }

  switchHour(time) { //
    console.log(this.scheduleHours)
    this.workTEST = !this.workTEST

    const selectedDay = this.selectedDay
    const month = this.month
    const year = this.year
    // console.log(time)
    time += ""
    let timeStr = time.replace(/[\.\/]/g,'_');
    if ( timeStr.indexOf("_") === -1 ) {
      timeStr += ":00"
    } else {
      timeStr += "0"
    }
    // console.log(timeStr)

    // console.log(selectedDay, month, year)
    if (!this.scheduleHours[year]) {
      this.scheduleHours[year] = {}
    }
    if (!this.scheduleHours[year][month]) {
      this.scheduleHours[year][month] = {}
    }
    if (!this.scheduleHours[year][month][selectedDay]) {
      this.scheduleHours[year][month][selectedDay] = {}
    }

    

    if (!this.scheduleHours[year][month][selectedDay][time]) {


      this.scheduleHours[year][month][selectedDay][time] = {active: true}
      this.newScheduleHours[time] = "adding"
    } else {
      delete this.scheduleHours[year][month][selectedDay][time]
      this.newScheduleHours[time] = "deleting"
    }

    // const scheduleTime = this.scheduleHours
    
    this.uploadScheduleQueue()
    
    
  }


  uploadScheduleQueue() {
    if (!this.updatingdWorkHourData) {
      this.updatingdWorkHourData = true
      setTimeout((function() {
        this.uploadSchedule()
      }).bind(this), 1500) //интервал = 1.5 сек, после которого начинается обновление
    }
  }
  
  uploadSchedule() {
    this.firebase.patchUserData(this.scheduleHours, "scheduleTime")
    .then((resp) => {
      console.log("расписание изменено:", resp)
      this.updateLocalSchedule()
    })
    .catch((err) => {
      console.log("ошибка изменения расписания: ", err)
    })
  }
  
  updateLocalSchedule() { 
    this.updatingdWorkHourData = false

    const selectedDay = this.selectedDay
    const month = this.month
    const year = this.year

    for (let key in this.newScheduleHours) {
      key += ""
      let timeStr = key.replace(/[\.\/]/g,'_');
      if ( timeStr.indexOf("_") === -1 ) {
        timeStr += "_00"
      } else {
          timeStr += "0"
      }

      console.log(this.userData.myData.scheduleTime)
      // console.log(timeStr, this.newScheduleHours[key])
      if (this.newScheduleHours[key] === "adding") {
        // console.log("adding")
        
        if (!this.userData.myData.scheduleTime) {this.userData.myData.scheduleTime = {}}
        if (!this.userData.myData.scheduleTime[year]) {this.userData.myData.scheduleTime[year] = {}}
        if (!this.userData.myData.scheduleTime[year][month]) {this.userData.myData.scheduleTime[year][month] = {}}
        if (!this.userData.myData.scheduleTime[year][month][selectedDay]) {this.userData.myData.scheduleTime[year][month][selectedDay] = {}}

        this.userData.myData.scheduleTime[year][month][selectedDay][key] = {active: true}
      } else if (this.newScheduleHours[key] === "deleting") {
        // console.log("deleting")
        // delete this.userData.myData.scheduleTime[this.year][this.month][this.selectedDay][key]
        delete this.userData.myData.scheduleTime[this.year][this.month][this.selectedDay][key]
      }
      console.log("расписание изменено: ", this.userData.myData.scheduleTime)

    }

    this.newScheduleHours = {}
  }


  onOutDay(dayOfWeekChoosen) { //ouput из отдельного дня
    console.log("выбран ", dayOfWeekChoosen);
  }

  onHoverTimeRow(lessonTime) { //! (переделать под новое расписание)
    if (!this.isCalendarPage) {  //клиент записывается к спецу
      if (this.inputDoctorInfo.scheduleTime && this.inputDoctorInfo.scheduleTime[this.year] && this.inputDoctorInfo.scheduleTime[this.year][this.month] && this.inputDoctorInfo.scheduleTime[this.year][this.month][this.selectedDay] && this.inputDoctorInfo.scheduleTime[this.year][this.month][this.selectedDay][lessonTime]) {
        if (!this.inputDoctorInfo.ordersFutureDates?.[this.year]?.[this.month]?.[this.selectedDay]?.[lessonTime]) {
          // console.log("Занято")
          this.selectedTimeForLesson = lessonTime
          // console.log(lessonTime, typeof lessonTime)
        }
      }
    }
  }

  onClickTimeRow(lessonTime) { //! (переделать под новое расписание)
    if (!this.isCalendarPage) {  //клиент записывается к спецу
      if (this.inputDoctorInfo.scheduleTime && this.inputDoctorInfo.scheduleTime[this.year] && this.inputDoctorInfo.scheduleTime[this.year][this.month] && this.inputDoctorInfo.scheduleTime[this.year][this.month][this.selectedDay] && this.inputDoctorInfo.scheduleTime[this.year][this.month][this.selectedDay][lessonTime]) {
        if (this.isInProfileModule === "true") { // если зареган
          this.appointmentDetails()
        }

      }
    }
  }



  // updateLocalsheduleData() { //! устарело надо удалить. обновление инфы по часам (отправка по клику, а скачивание не чаще заданного интервала)
  //   if (!this.updatingdWorkHourData) {
  //     this.updatingdWorkHourData = true
  //     setTimeout((function() { 
  //       this.downloadSheduleInfo()
  //       this.updatingdWorkHourData = false
  //     }).bind(this), 1500) //интервал = 1.5 сек, после которого начинается скачка
  //   }
  // }

  // changeActiveDaysOfWeek(index) {
  //   if (this.newDaysOfWeekShedule[index]) { // если день записан, то удалить
  //     delete this.newDaysOfWeekShedule[index]
  //   } else {
  //     if (this.daysOfWeekShedule[index]) {
  //       this.newDaysOfWeekShedule[index] = this.daysOfWeekShedule[index]
  //     } else {
  //       this.newDaysOfWeekShedule[index] = [this.workStart, this.workEnd]
  //     }
  //   }

  //   // this.newDaysOfWeekShedule[index] = [Math.floor(Math.random()*10)+10,21]
    
  // }
  makeLessonFromTimeRow() { //!хз зачем ваще
    // console.log(this.patientProblem)
    this.makeAnAppointment()
  }


  openManualOrderPopup(event, time) {
    event.stopPropagation();
    this.popupService.manualOrderDetails = {
      date: {
        day: this.selectedDay, 
        month: this.month, 
        year: this.year, 
        time: time 
      },
    }
    this.popupService.toggleManualOrderPopup()
  }

  makeLessonFromPopup(details) { //из manual или обычного popup
    console.log("создание заказа из попапа:...")
    console.log("детали клиента (popup): ", details) //childName, childDate, comment...
    // console.log(this.popupService.manualOrderDetails)
    console.log("manualOrderDetails: ", this.popupService.manualOrderDetails)
    console.log("popupOrderDetails: ", this.popupService.popupOrderDetails)
    let isManualOrder
    let manualDetails
    if (this.popupService.manualOrderDetails && !this.popupService.popupOrderDetails) {
      isManualOrder = true
    } else if (!this.popupService.manualOrderDetails && this.popupService.popupOrderDetails) {
      isManualOrder = false
    }
    manualDetails = { //детали занятия из любого попапа
      date: this.popupService.manualOrderDetails?.date,
      ...details,
    }
    console.log("manualDetails: ", manualDetails)
    // manualDetails.date.time = this.selectedTimeForLesson
    // this.selectedTimeForLesson = manualDetails.date.time

    // console.log("manualDetails: ", manualDetails)
    this.makeAnAppointment(isManualOrder, manualDetails)
  }


  checkIsDayFuture(year, month, day, hour) { //проверка прошел ли день уже?
    let timeAccess = true
    
    const orderDate = new Date(year, month - 1, day)
    const todayDate = new Date()
    
    if (orderDate < todayDate) {
      timeAccess = false
    }

    const data = {
      orderDate: {
        date: orderDate,
        year: orderDate.getFullYear(),
        month: orderDate.getMonth(),
        day: orderDate.getDate(),
      },
      todayDate: {
        date: todayDate,
        year: todayDate.getFullYear(),
        month: todayDate.getMonth(),
        day: todayDate.getDate(),
      }

    }
    console.log(timeAccess, data) 

    return timeAccess
  }


  //TODO____________СОЗДАНИЕ_ЗАКАЗА____________________
  async makeAnAppointment(manualOrder = false, manualDetails = null) {
    const year = this.year
    const month = this.month
    const day = this.selectedDay
    const hour = this.selectedTimeForLesson

    this.isLoading = true
    this.errorMakingLesson = "" //сброс надписи об ошибках
    this.successMakingLesson = "" //сброс надписи об успехе
    let orderId = null
    if (!manualOrder) {
      orderId = `${year}_${month}_${day}_${hour}_${this.calendarUserId}`
    } else {
      orderId = `${year}_${month}_${day}_${hour}_${localStorage.getItem("user-Id")}`
    }

    
    if (!manualOrder && !this.checkIsDayFuture(year, month, day, hour) ) {
      this.errorMakingLesson = "Выбранный день уже прошел"
      this.isLoading = false
      return
    }
    
    console.log('тест записи...', manualDetails)
    // return
    
    //! добавить проверку
    //*сигнализация о занятом часе 
    // this.isLoading = false
    // this.errorMakingLesson = `данный час занят (${hour}:00 ${day}.${month}.${year})`
    // console.log("данный час занят")

    //записывать если пользователь авторизирован ,является клиентом и час не занят (пустое расписание или конкретно свободный час)
    let orderThisHour = null
    await this.firebase.getLesson(orderId)
      .then((snapshot) => {
        orderThisHour = snapshot.val()
        console.log("объект урока: ", snapshot.val()) //объект урока
      })
    //* проверка-был ли такой заказ уже
    if (!manualOrder && orderThisHour) { 
      if (orderThisHour.patientId === localStorage.getItem("user-Id")) {
        this.errorMakingLesson = `Вы уже записаны на этот час, но не оплатили. Пожалуйста оплатите этот заказ через Личный кабинет -> Календарь`
      } else {
        this.errorMakingLesson = `данный час уже занят`
      }
      console.log("ОШИБКА: !!!такой заказ уже был!!!")
      this.isLoading = false
      return
    }
    
    if ( (this.firebase.isAuthenticated() && (this.userData.myData.userType == 'client')) || manualOrder) {
      //*была проверка на занятость по doctorsLessons
      //! потом опять возвратить, когда у доктора будут записываться чисто id заказа
      // && (!this.doctorsLessons || !this.doctorsLessons[year] || !this.doctorsLessons[year][month] 
      //   || !this.doctorsLessons[year][month][day] || !this.doctorsLessons[year][month][day][hour] )

      let orderData = null
      if (!manualOrder) { 
        orderData = {
          orderId: orderId,
          date: {
            year: year,
            month: month,
            day: day,
            time: hour,
          },
          patientId: localStorage.getItem("user-Id"),
          patientName: `${this.userData.myData.surname} ${this.userData.myData.name} ${this.userData.myData.patronymic}`,
          problemDescription: manualDetails.comment,
          childName: manualDetails.childName,
          childDate: manualDetails.childDate,
          doctorId: this.calendarUserId,
          doctorName: `${this.inputDoctorInfo.surname} ${this.inputDoctorInfo.name} ${this.inputDoctorInfo.patronymic}`,
          doctorsConfirmation: false,
          zoomLink: this.inputDoctorInfo.zoomLink ? this.inputDoctorInfo.zoomLink : undefined,
          state: "",
        }
      } else if (manualDetails) { //вручную
        orderData = {
          orderId: orderId,
          date: {
            year: year,
            month: month,
            day: day,
            time: hour,
          },
          patientId: null,
          manualOrder: true,
          patientEmail: manualDetails.patientEmail,
          patientName: manualDetails.patientName,
          problemDescription: manualDetails.comment,
          patientPhone: manualDetails.phone,
          doctorId: localStorage.getItem("user-Id"),
          doctorName: `${this.userData.myData.surname} ${this.userData.myData.name} ${this.userData.myData.patronymic}`,
          doctorsConfirmation: false,
          zoomLink: this.userData.myData.zoomLink ? this.userData.myData.zoomLink : "null",
          state: "",
        }
      } else {
        console.log("Error making lesson..")
        return
      }

        //* создание заказа в БД (firebase)
      let dbSaveArray = this.createOrderInDB(orderId, orderData, manualOrder, manualDetails)
      await Promise.all([dbSaveArray])
        .then((resp) => {
          console.log("создание заказа в БД - удачно")
          // this.errorMakingLesson += "✔️запись в БД создана"
          
        })
        .catch((err) => {
          console.log("создание заказа в БД - неудачно", err)
          this.errorMakingLesson += "❌запись в БД не создана"
          this.isMakingAppointment = false
        })
      if (!this.isMakingAppointment) { return }
        
        //* вызов функции для создания заказа в банке
      const funcData = {
        id: orderId,
        prod: this.production
      }
      await this.firebase.reqFunc("orders-pay", funcData).subscribe(
        (resp: alfaRegistrationResp) => {
          console.log("orders-pay url: ", resp.formUrl)
          // this.router.navigate(['/profile/calendar'])
          this.isLoading = false
          // window.open(resp.formUrl, '_blank')
          if (!manualOrder) {
            this.successMakingLesson = "Ваше занятие лежит в разделе 'календарь'. Проверьте состояние оплаты заказа"
            window.location.href = resp.formUrl
          } else {
            this.successMakingLesson = "Вы записали клиента, теперь он должен оплатить заказ в течении 20 минут. Письмо на почту может идти минуту."
            orderData.paymentLink = resp.formUrl
            // this.sendEmailManual(orderData)
          }
        },
        (err) => {
          console.log("ERROR orders-pay: ", err)
          this.isLoading = false
        })
      //! поменять на observable
        // .then((resp) => {
        //   console.log("orders-pay: ", resp)
        // })
        // .catch((err) => {
        //   console.log("Ошибка orders-pay функции: ", err)
        // })
      
      
      //?
      //* регистрация заказа в альфе //
      // this.alfaTest()
      // getOrderStatusExtended.do - состояние заказа
      // deposit.do - регистрация заказа
      const action = "getOrderStatusExtended.do"
      if (!this.inputDoctorInfo.shortId) {
        this.isLoading = false
        this.errorMakingLesson = "У доктора не указан Id! Пожалуйста, сообщите нам об этом."
        return
      }
      // const orderId = `${eventLesson.date.year}_${eventLesson.date.month}_${eventLesson.date.day}_${eventLesson.date.time}_${this.inputDoctorInfo.shortId}`
      // console.log(orderId)

      //?
      //* отправка в альфу?
      // this.firebase.alfaREST(action, orderId, this.production).subscribe(
      //   (resp) => {
      //     console.log("order registration: ", resp)
      //     this.isLoading = false
      //   },
      //   (err) => {
      //     console.log("order reg error: ", err)
      //     this.isLoading = false
      //   }
      // )

      
      //* отправка почты  //(отправка на FB functions)
      // let clientsEmailConfirmation = {
      //   to: this.userData.myData.email,
      //   from: emailConfig.fromEmailAdress,
      //   templateId: emailConfig.EMAIL_TEMPLATES.CLIENT_MADE_AN_APPOINTMENT,
      //   dynamicTemplateData: {
      //     subject: "Logogo запись на прием",
      //     date: `${day}-${month}-${year}`,
      //     clientName: this.userData.myData.name,
      //     doctorName: `${this.inputDoctorInfo.surname} ${this.inputDoctorInfo.name} ${this.inputDoctorInfo.patronymic}`,
      //     time: "",
          
      //   }
      // }

      // this.firebase.sendEmailFunction(clientsEmailConfirmation)
      // .then((res) => {
      //   console.log("email отправлен: ", res)
      //   })
      // .catch((err) => {
      //     console.log("Ошибка FBtest: ", err)
      //     // this.isSendingData = false
      //   })


          

        
      


      // console.log(`запись: \n клиент: ${year} ${month} ${day} ${hour} \n ${clientData.name} \n ${clientData.id} \n доктор:`);
    } else if (!this.firebase.isAuthenticated() && !this.doctorsLessons[year][month][day][hour]) {
      console.log("надо залогиниться!");
      this.popupService.toggleLoginPopup()
      this.router.navigate(["/"], {
        queryParams: {
            needLoginToMakeAnAppointment: true
        }
      })
    } else if (this.userData.myData.userType != 'client' && !this.doctorsLessons[year][month][day][hour]) {
      this.doctorAlertSign = "Вы как доктор не можете записаться к доктору. Пожалуйста создайте аккаунт как пациент!"
    } else if (this.doctorsLessons[year][month][day][hour].name) {
      this.doctorAlertSign = "Это время уже занято. Пожалуйста выберите другой час."
    }
  }

  sendEmailManual(orderData) {

    console.log("временно выключено....")
    return

    const clientsEmailConfirmation = {
      to: "vlatidos@gmail.com",
      from: emailConfig.fromEmailAdress,
      // templateId: emailConfig.EMAIL_TEMPLATES.CLIENT_MADE_AN_APPOINTMENT,
      templateId: "d-46991a5b503b4f578b6f770eeac9c711",
      dynamicTemplateData: {
        subject: "Logogo запись на прием",
        // date: `${day}-${month}-${year}`,
        orderId: orderData.orderId,
        // orderId: "orderId-2435842590",
        date: `${orderData.date.time}(по Минску) ${orderData.date.day} ${this.monthsNamesWhomCase[orderData.date.month]} ${orderData.date.year}`,
        paymentLink: orderData.paymentLink,
        clientName: this.userData.myData.name,
        doctorName: `${this.inputDoctorInfo.surname} ${this.inputDoctorInfo.name} ${this.inputDoctorInfo.patronymic}`,
        time: "",
      }
    }
    this.firebase.testSendEmailFunction(clientsEmailConfirmation)
      .then((res) => {
        console.log("email отправлен: ", res)
        })
      .catch((err) => {
          console.log("Ошибка FBtest: ", err)
          // this.isSendingData = false
        })
  }

  createOrderInDB(orderId, orderData, manualOrder = false, manualDetails = null) {
    const dbOrderPath = `orders/${orderId}`

    let dbPatientOrdersPath= null 
    let dbDoctorOrdersPath = null

    if (!manualOrder) {
      dbPatientOrdersPath = `users/${localStorage.getItem("user-Id")}/orders/${orderId}`
      dbDoctorOrdersPath = `users/${this.calendarUserId}/orders/${orderId}`
    } else {
      dbDoctorOrdersPath = `users/${localStorage.getItem("user-Id")}/orders/${orderId}`
    }
    
    const patientData = { orderId: orderId }
    const doctorData = { orderId: orderId }
    
    if (!manualOrder) {
      return Promise.all([
        this.firebase.setData(dbOrderPath, orderData),
        this.firebase.updateData(dbPatientOrdersPath, patientData),
        this.firebase.updateData(dbDoctorOrdersPath, doctorData)
      ])
    } else {
      return Promise.all([
        this.firebase.setData(dbOrderPath, orderData),
        this.firebase.updateData(dbDoctorOrdersPath, doctorData)
      ])
    }
  }

  payForOrder(paymentUrl) {
    window.open(paymentUrl)
  }

  

  alfaTest() {
    const registrData = {

    }

    this.firebase.testAlfaREST().subscribe(
      (resp) => {
        console.log("++", resp)
      },
      (err) => {
        console.log("--", err)
      })
    
  }

  appointmentDetails() {
    const year = this.year
    const month = this.month
    const day = this.selectedDay
    const hour = this.selectedTimeForLesson
    if (this.userData.myData.userType === "doctor") {
      this.isLoading = false
      this.errorMakingLesson = "Вы, как доктор, не можете записаться к другому доктору. Пожалуйста сделайте аккаунт как клиент."
      return
    }
    this.popupService.appointmentDetails = {
      year,
      month,
      day,
      hour,

    }
    this.popupService.toggleAppointmentDeatailsPopup()
    
  }



  uploadNewEvent(eventLesson, eventId) {
    let myNewLessonData = {}
    myNewLessonData[eventId] = JSON.parse(JSON.stringify(eventLesson))
    delete myNewLessonData[eventId].daysLeft
    console.log(myNewLessonData)
    // myNewLessonData.lessons.lessonId = eventId
    this.firebase.sendMyLessonsDataChanges(myNewLessonData)
      .subscribe((resp) => {
        console.log("урок добавлен в ячейку пользователя", resp)
        
      },
      (err) => {
        console.log("Ошибка добавления в ячейку пользователя", err)
      })
  }

  // changeWorkHour(value, day, side) { // куда, какой день, from или to  
  //   const x = this.newDaysOfWeekShedule[day][side]
  //   let workPeriodCheck = true
  //   if (side == 0 && value == 1 && this.newDaysOfWeekShedule[day][0] + 1 >= this.newDaysOfWeekShedule[day][1]) {
  //     workPeriodCheck = false
  //   } else if (side == 1 && value == -1 && this.newDaysOfWeekShedule[day][1] - 1 <= this.newDaysOfWeekShedule[day][0]) {
  //     workPeriodCheck = false
  //   }
  //   // this.newDaysOfWeekShedule[day][0] < this.newDaysOfWeekShedule[day][1]
  //   if (workPeriodCheck && x && x + value >= this.workStart && x + value <= this.workEnd) {
  //     this.newDaysOfWeekShedule[day][side] += value;
  //     // console.log(this.daysOfWeekShedule[day][side], this.newDaysOfWeekShedule[day][side])
  //   } else {console.log(x, x + value >= this.workStart, x + value <= this.workEnd)} 
  //   // console.log(x + value >= this.workEnd);
  // }

  cancelNewShedule() {
    console.log('123')
    Object.assign(this.newDaysOfWeekShedule, this.daysOfWeekShedule)
  }

  unselectDay() {
    this.selectedDay = -1
  }

  toggleManualAddOrder() {
    this.manualAddOrder = !this.manualAddOrder
  }

  // confirmEvent(eventName) { //!все фигня, надо удалять
  //   this.userData.myData.events[eventName].doctorsConfirmation = true
  //   console.log(this.userData.myData.events[eventName])
    
  //   this.uploadNewEvent(this.userData.myData.events[eventName], eventName)
  //   this.firebase.updateEvent(this.userData.myData.events[eventName], eventName)
  //     .subscribe((resp) => {
  //       this.telegram.telegramNotifConfirmMeeting(this.userData.myData.events[eventName])
  //       // console.log(resp)
  //     },
  //     (err) => {
  //       console.log("ОШИБКА подтверждения занятия: ", err)
  //     })
  // }
  sendNewShedule() {
    this.updatingdWorkHourData = true
    console.log("записываю расписание", this.calendarUserId);
    // this.firebase.changeShedule(this.calendarUserId, this.newDaysOfWeekShedule)
    //   .subscribe((resp) => {
    //     // console.log("все пользователи: ", resp);
    //     console.log("Расписание изменено");
    //     this.updateLocalsheduleData() ///!!!!!!!!!!!!!!!!!!!!!!
    //   },
    //   (err) => {
    //     console.log("ошибка при изменении расписания доктора ", err);
    //   })
    const newShedule = {schedule: this.userData.myData.schedule}
    this.firebase.sendMyDataChanges(newShedule)
      .subscribe((resp) => {
        this.updatingdWorkHourData = false
        console.log('расписание изменено: ', resp)
      },
      (err) => {
        this.updatingdWorkHourData = false
        console.log('Ошибка изменения расписания: ', err)
      })
  }

  testEmail() {
    console.log("email sending...")
    const data = {}
    this.sendEmailManual(data)
  }

  redirectToSignIn() {
    this.popupService.hideAllPopups()
    this.popupService.toggleLoginPopup()
    this.router.navigate(["/"])
  }
  
  redirectToQuestionForm() {
    this.popupService.hideAllPopups()
    this.popupService.toggleHoPgClientPopup()
    this.router.navigate(["/"])
  }



}
