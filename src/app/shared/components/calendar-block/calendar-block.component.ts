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
  selectedDay = -1 // номер дня (-1\ 0-30) 
  selectedDayOfWeek = -1 
  day = new Date().getDate()
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
  updatingdWorkHourData = false //чтобы при каждом клике подряд не скачивать инфу
  workStart = 8
  workEnd = 22
  currWorkStart = this.workStart
  currWorkEnd = this.workEnd
  currDayActive = false
  currFreeGaps = []
  activeGap = -1

  workHoursArray = []
  doctorShedule = {}
  doctorsLessons = {}
  doctorAlertSign: string
  patientProblem = "проблема..."
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
    private telegram: TelegramBotService
  ) {}
    
  ngOnInit(): void {
    this.setMonthName()
    this.showDays()
    this.makeHoursArray()
    // if (this.userData.myData.userType == "doctor") {
      
    this.waitForInfo() //после подгрузки инфы грузить все
    // this.triggerFalseClick()
  // }
  }

  

  triggerFalseClick() {
    setTimeout(() => {
      document.getElementById('day23').click()
      console.log("click")
    }, 4000)
  }



  TESTlogDoctorsLessons() {
    console.log(this.doctorsLessons)
  }

  TESTdoctorEventsYearMonthDayHour() {
    console.log(this.doctorEventsYearMonthDayHour)
  }

  invertExpand() {
    this.asideIsExpanded = !this.asideIsExpanded
    this.expandSign = this.expandSign == "Развернуть" ? "Свернуть" : "Развернуть"
  }

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
    if (!this.userData.myData.weeklySchedule) { //если нет расписания заполняем нуллами
      this.daysOfWeekShedule = {0:null, 1:null, 2:null, 3:null, 4:null, 5:null, 6:null}
      this.newDaysOfWeekShedule = {0:null, 1:null, 2:null, 3:null, 4:null, 5:null, 6:null}
    } else { //заполняем расписание если есть
      this.daysOfWeekShedule = JSON.parse(JSON.stringify(this.userData.myData.weeklySchedule))
      for(let i = 0; i<=6; i++) { //для работы Object.assign(). заполнить пустые ключи 
        if(!this.daysOfWeekShedule[i]) {this.daysOfWeekShedule[i] = null}
      }
      // Object.assign(this.newDaysOfWeekShedule, this.daysOfWeekShedule)
      this.newDaysOfWeekShedule = JSON.parse(JSON.stringify(this.daysOfWeekShedule))
    }

    if (!this.userData.myData.schedule) {
      this.userData.myData.schedule = {}
    }

  }

  downloadSheduleInfo() { //скан рабочих часов + занятых уроков 
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

  makeHoursArray() {
    for (let i = this.workStart; i <= this.workEnd; i++) { 
      this.workHoursArray.push(i) //массив всех часов для html ngFor
      // this.selectedDayHoursSettings[i] = {"workTime": false}
    }
  }


  increaseMonth() {
    this.selectedDay = -1 //сброс дня
    this.selectedHourForLesson = -1 //сброс часа
    this.month++
    if (this.month == 13) {
      this.month = 1
      this.year++
    }
    this.setMonthName()
    this.showDays()
  }
  decreaseMonth() {
    this.selectedDay = -1 //сброс дня
    this.selectedHourForLesson = -1 //сброс часа
    this.month--
    if (this.month == 0) {
      this.month = 12
      this.year--
    }
    this.setMonthName()
    this.showDays()
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
    // console.log(this.daysArr);
    
    this.getFirstDayOfWeek();
    // (<HTMLElement>document.querySelector(".day")).style.marginLeft = "30px"
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
    this.selectedDay = dayIndex - 1
    this.selectedDayOfWeek = (this.currentFirstDay + this.selectedDay - 1)%7

    this.calculateFreeGaps()
    // this.thisDayOfWeek = (this.currentFirstDay + this.dayIndex - 1)%7 //номер первого дня недели (1-7) + номер дня (1-31) -1 %7
    // if (this.thisDayOfWeek == 0) {
    //   this.thisDayOfWeek = 7
    // }
    // --this.thisDayOfWeek //чтобы Пн=0 Вс=6
  }

  calculateFreeGaps() {

    this.currFreeGaps = this.inputDoctorInfo.schedule[this.year][this.month][this.selectedDay + 1]

    const from = this.inputDoctorInfo.schedule[this.year][this.month][this.selectedDay + 1].from
    const to = this.inputDoctorInfo.schedule[this.year][this.month][this.selectedDay + 1].to
    this.currFreeGaps = [[from, to]]

    console.log(this.inputDoctorInfo.schedule[this.year][this.month][this.selectedDay + 1] )
  }


  onOutDay(dayOfWeekChoosen) { //ouput из отдельного дня
    console.log("выбран ", dayOfWeekChoosen);
  }

  onClickTimeRow(lessonTime) { //(устарело) почасовоее изменение расписания
    // console.log(lessonTime)
    if (this.isCalendarPage) {         //для страницы редактирования своего календаря
      let hourSettings = {workTime: true, isEngaged: false}
      //если час уже настроен (включен), то выключить его
      if (this.doctorShedule && 
          this.doctorShedule[this.year] &&
          this.doctorShedule[this.year][this.month] && 
          this.doctorShedule[this.year][this.month][this.selectedDay+1] && 
          this.doctorShedule[this.year][this.month][this.selectedDay+1][lessonTime]) {
          // hourSettings["workTime"] = !this.doctorShedule[this.year][this.month][this.selectedDay+1][lessonTime]["workTime"]
          delete hourSettings["workTime"]
          delete hourSettings["isEngaged"]
      }
      this.firebase.changeWorkHourBoolean(this.calendarUserId ,this.year, this.month, this.selectedDay+1, lessonTime, hourSettings)
      .subscribe((resp) => {
        // console.log("все пользователи: ", resp);
        console.log("этот час теперь рабочий");
        this.updateLocalsheduleData()
      },
      (err) => {
        console.log("ошибка при изменении рабочего часа ", err);
      })
      //для страницы просмотра и записи к доктору
    } else if (!this.isCalendarPage) {       
      if (this.inputDoctorInfo.weeklySchedule[this.selectedDayOfWeek]) 
      this.selectedHourForLesson = lessonTime
    }
  }



  updateLocalsheduleData() { //обновление инфы по часам (отправка по клику, а скачивание не чаще заданного интервала)
    if (!this.updatingdWorkHourData) {
      this.updatingdWorkHourData = true
      setTimeout((function() { 
        this.downloadSheduleInfo()
        this.updatingdWorkHourData = false
      }).bind(this), 1500) //интервал = 1.5 сек, после которого начинается скачка
    }
  }

  changeActiveDaysOfWeek(index) {
    if (this.newDaysOfWeekShedule[index]) { // если день записан, то удалить
      delete this.newDaysOfWeekShedule[index]
    } else {
      if (this.daysOfWeekShedule[index]) {
        this.newDaysOfWeekShedule[index] = this.daysOfWeekShedule[index]
      } else {
        this.newDaysOfWeekShedule[index] = [this.workStart, this.workEnd]
      }
    }

    // this.newDaysOfWeekShedule[index] = [Math.floor(Math.random()*10)+10,21]
    
  }

  selectTimeGap(index) {
    this.activeGap = index
  }

  makeLessonFromPopup(details) {
    this.patientProblem = details.problem
    // this.withChild = details.withChild
    // console.log("PARENT TEST SUCCESS", details)
    this.makeAnAppointment(this.year, this.month, this.selectedDay + 1, this.selectedHourForLesson)
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
  async makeAnAppointment(year, month, day, hour) {

    this.isLoading = true
    this.errorMakingLesson = "" //сброс надписи об ошибках
    this.successMakingLesson = "" //сброс надписи об успехе
    const orderId = `${year}_${month}_${day}_${hour}_${this.calendarUserId}`

    // console.log(`год ${year}, ${this.currentYear},| месяц: ${month}, ${this.currentMonth},| день ${day}, ${this.day}`)
    
    if ( !this.checkIsDayFuture(year, month, day, hour) ) {
      this.errorMakingLesson = "Выбранный день уже прошел"
      this.isLoading = false
      return
    }
    
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
    if (orderThisHour) { 
      if (orderThisHour.patientId === localStorage.getItem("user-Id")) {
        this.errorMakingLesson = `Вы уже записаны на этот час, но не оплатили. Пожалуйста оплатите этот заказ через Личный кабинет -> Календарь`
      } else {
        this.errorMakingLesson = `данный час уже занят`
      }
      console.log("ОШИБКА: !!!такой заказ уже был!!!")
      this.isLoading = false
      return
    }
    
    if (this.firebase.isAuthenticated() && this.userData.myData.userType == 'client') {
      //*была проверка на занятость по doctorsLessons
      //! потом опять возвратить, когда у доктора будут записываться чисто id заказа
      // && (!this.doctorsLessons || !this.doctorsLessons[year] || !this.doctorsLessons[year][month] 
      //   || !this.doctorsLessons[year][month][day] || !this.doctorsLessons[year][month][day][hour] )

      const orderData = {
        date: {
          year: year,
          month: month,
          day: day,
          time: hour,
        },
        patientId: localStorage.getItem("user-Id"),
        patientName: `${this.userData.myData.surname} ${this.userData.myData.name} ${this.userData.myData.patronymic}`,
        problemDescription: this.patientProblem,
        doctorId: this.calendarUserId,
        doctorName: `${this.inputDoctorInfo.surname} ${this.inputDoctorInfo.name} ${this.inputDoctorInfo.patronymic}`,
        doctorsConfirmation: false,
        zoomLink: this.inputDoctorInfo.zoomLink ? this.inputDoctorInfo.zoomLink : undefined,
        state: ""
      }

      //* создание заказа в БД (firebase)
      
      let dbSaveArray = this.createOrderInDB(orderId, orderData)
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
          window.open(resp.formUrl, '_blank')
          // this.router.navigate(['/profile/calendar'])
          this.successMakingLesson = "Вы записались! Ваше занятие лежит в разделе 'календарь'"
          this.isLoading = false
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

      let clientsEmailConfirmation = {
        to: this.userData.myData.email,
        from: emailConfig.fromEmailAdress,
        templateId: emailConfig.EMAIL_TEMPLATES.CLIENT_MADE_AN_APPOINTMENT,
        dynamicTemplateData: {
          subject: "Logogo запись на прием",
          date: `${day}-${month}-${year}`,
          clientName: this.userData.myData.name,
          doctorName: `${this.inputDoctorInfo.surname} ${this.inputDoctorInfo.name} ${this.inputDoctorInfo.patronymic}`,
          time: "",
          
        }
      }

      //* отправка почты 
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

  createOrderInDB(orderId, orderData) {
    const dbOrderPath = `orders/${orderId}`

    const dbPatientOrdersPath = `users/${localStorage.getItem("user-Id")}/orders/${orderId}`
    const patientData = { orderId: orderId }

    const dbDoctorOrdersPath = `users/${this.calendarUserId}/orders/${orderId}`
    const doctorData = { orderId: orderId }

    return Promise.all([
      this.firebase.setData(dbOrderPath, orderData),
      this.firebase.updateData(dbPatientOrdersPath, patientData),
      this.firebase.updateData(dbDoctorOrdersPath, doctorData)
    ])
  }

  payOrder(paymentUrl) {
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

  appointmentDetails(year, month , day, hour) {
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
    this.popupService.toggleappointmentDeatailsPopup()
    
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

  changeWorkHour(value, day, side) { // куда, какой день, from или to  
    const x = this.newDaysOfWeekShedule[day][side]
    let workPeriodCheck = true
    if (side == 0 && value == 1 && this.newDaysOfWeekShedule[day][0] + 1 >= this.newDaysOfWeekShedule[day][1]) {
      workPeriodCheck = false
    } else if (side == 1 && value == -1 && this.newDaysOfWeekShedule[day][1] - 1 <= this.newDaysOfWeekShedule[day][0]) {
      workPeriodCheck = false
    }
    // this.newDaysOfWeekShedule[day][0] < this.newDaysOfWeekShedule[day][1]
    if (workPeriodCheck && x && x + value >= this.workStart && x + value <= this.workEnd) {
      this.newDaysOfWeekShedule[day][side] += value;
      // console.log(this.daysOfWeekShedule[day][side], this.newDaysOfWeekShedule[day][side])
    } else {console.log(x, x + value >= this.workStart, x + value <= this.workEnd)} 
    // console.log(x + value >= this.workEnd);
  }

  changeDayWorkHour(var1, val) { // from/to +1/-1
    console.log(var1, val)
    if (!this.currDayActive) {return}

    const limit1 = var1 === 0 && val === -1 && this.currWorkStart === this.workStart 
                || var1 === 1 && val === 1  && this.currWorkEnd === this.workEnd

    const limit2 = var1 === 0 && val === 1 && this.currWorkStart >= this.currWorkEnd - 1
                || var1 === 1 && val === -1 && this.currWorkEnd <= this.currWorkStart + 1
                    
    if (limit1 || limit2) {
      return
    }
    
    if (!var1) {
      this.currWorkStart += val
    } else {
      this.currWorkEnd += val
    }

  }

  selectOrderTime() {

  }

  

  cancelNewShedule() {
    console.log('123')
    Object.assign(this.newDaysOfWeekShedule, this.daysOfWeekShedule)
  }

  unselectDay() {
    this.selectedDay = -1
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

  newScheduleUpdate() {
    console.log(this.currWorkStart, this.currWorkEnd)
    console.log(this.selectedDay + 1, this.month, this.year)

    const schedule = this.userData.myData.schedule
    if (!schedule[this.year]) {
      schedule[this.year] = {}
    }
    if (!schedule[this.year][this.month]) {
      schedule[this.year][this.month] = {}
    }
    if (!schedule[this.year][this.month][this.selectedDay + 1]) {
      schedule[this.year][this.month][this.selectedDay + 1] = {}
    }

    if (this.currDayActive) {
      schedule[this.year][this.month][this.selectedDay + 1] = {
        from: this.currWorkStart,
        to: this.currWorkEnd
      }
    } else {
      delete schedule[this.year][this.month][this.selectedDay + 1]
    }
    
    this.sendNewShedule()

    // console.log(this.userData.myData.schedule)
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

  toggleDayActive() {
    this.currDayActive = !this.currDayActive
    // this.currDayActive = true
  }


}
