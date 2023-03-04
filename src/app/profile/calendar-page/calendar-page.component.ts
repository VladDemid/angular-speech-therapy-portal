import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { PopupService } from 'src/app/shared/services/popup.service';
import { TelegramBotService } from 'src/app/shared/services/telegram-bot.service';
import { environment } from 'src/environments/environment';
// import { ZoomService } from 'src/app/shared/services/zoom.service';
import { UserData } from '../shared/services/user-data.service';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.sass']
})
export class CalendarPageComponent implements OnInit {
  
  production = environment.production
  daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
  daysOfWeekFlagged = {0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }
  testVar = false
  formData = {}
  workHoursFrom = 8
  workHoursTo = 22
  userTimeStart = 8
  userTimeEnd = 20
  myDuration: number
  myId: string //для инжект в календарь
  myEmail = ""

  // signatureEndpoint = 'https://logogo.herokuapp.com/'
  // apiKey = 'sSYzyR3TSBWM_EGy7z3qcw'
  // meetingNumber = '75106540621'
  // role = 0
  // leaveUrl = 'http://localhost:4200'
  // userName = 'Angular'
  // userEmail = 'test@gmail.com'
  // passWord = 'XW07fd'

  constructor(
    public userData: UserData,
    private telegram: TelegramBotService,
    // private zoom: ZoomService,
    public httpClient: HttpClient,
    public popupService: PopupService,
    @Inject(DOCUMENT) document
    
  ) { }

  ngOnInit(): void {
    this.myId = localStorage.getItem('user-Id')
    this.myEmail = "myEmail"
  }


  testMessage() {
    // const userName = `${this.userData.myData.surname} ${this.userData.myData.name} ${this.userData.myData.patronymic}`
    // this.telegram.sendNewLessonMessage(this.myId, userName)
  }

  // getDate() {
  //   console.log(new Date())
  // }
  
  
  testZoom() {
    // this.zoom.startZoom()
  }

  createMeeting() {
    // this.zoom.createMeeting()
  }

  getUserId() {
    // this.zoom.getUserId()
  }

  
  

  flagDayOfWeek(i) {
    // каждый клик по чекбоксу дня недели массив заново переопределятеся. 
    // работает криво зато работает (по 2 раза за каждый клик и скан по всем чекбоксам)
    // по 2 раза хз почему (можно было сделать через eventListener пожалуй)
    
    const daysList = document.querySelectorAll('input.day-selector')
    for (let dayItem in daysList) {
      if ((<HTMLInputElement>daysList[dayItem]).checked) { 
        this.daysOfWeekFlagged[dayItem] = true             
      } else {
        this.daysOfWeekFlagged[dayItem] = false
      }
    }
  }

  // sendTimeData() {
  //   console.log("start create data to send");
    
  //   let daysSchedule = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[]};
    
  //   if (this.userData.myData.daysShedule) { //сканирование расписания с БД
  //     for (let key in this.userData.myData.daysShedule) {
  //       if (typeof this.userData.myData.daysShedule[key] != "number") {
  //         daysSchedule[key] = this.userData.myData.daysShedule[key]
  //       }
  //     }
  //   }
    
  //   const daysList = document.querySelectorAll('input.day-selector')
  //   for (let dayItem in daysList) {
  //     if ((<HTMLInputElement>daysList[dayItem]).checked) { // добавление\изменение дней
  //       console.log("запись ",this.daysOfWeek[dayItem] ); // -------удалить--------
  //       daysSchedule[dayItem] = []
  //       daysSchedule[dayItem][0] = +this.userTimeStart
  //       daysSchedule[dayItem][1] = +this.userTimeEnd
  //     }
  //   }
    
  //   const durations = document.querySelectorAll("input[name='duration']") //продолжительность
  //   for (let input in durations) {
  //     if ((<HTMLInputElement>durations[input]).checked) { // поиск отмеченной продолжительности
  //       this.myDuration = +(<HTMLInputElement>durations[input]).value
  //     }
  //   }
    
  //   daysSchedule["lessonDuration"] = this.myDuration // добавление продолжительности в объект расписания

  //   const DataToSend = { // создание объекта с подобъектом для отправления в БД
  //     daysShedule: this.scheduleDataTrimmer(daysSchedule), 
  //   }

  //   // console.log(DataToSend);
    
  //   this.userData.sendMyDataChanges(DataToSend)
  //   .subscribe((resp) => {
  //     console.log("часы обновлены");
  //     this.userData.initialization()
  //   }),
  //   (err) => {
  //     console.log("ошибка обновления расписания: ", err);
  //   }
    
  // }

  // clearTimeData() {
  //   let daysSchedule = {0: [],1: [],2: [],3: [],4: [],5: [],6: []}

  //   if (this.userData.myData.daysShedule) { //сканирование расписания с БД
  //     for (let key in this.userData.myData.daysShedule) {
  //       if (typeof this.userData.myData.daysShedule[key] != "number")
  //       daysSchedule[key] = this.userData.myData.daysShedule[key]
  //     }
  //   }

  //   const daysList = document.querySelectorAll('input.day-selector')
  //   for (let dayItem in daysList) {
  //     if ((<HTMLInputElement>daysList[dayItem]).checked) { // добавление\изменение дней
  //       daysSchedule[dayItem] = []
  //       // daysSchedule[dayItem][0] = null
  //       // daysSchedule[dayItem][1] = null
  //     }
  //   }

    
  //   const durations = document.querySelectorAll("input[name='duration']") //продолжительность
  //   for (let input in durations) {
  //     if ((<HTMLInputElement>durations[input]).checked) { // поиск отмеченной продолжительности
  //       this.myDuration = +(<HTMLInputElement>durations[input]).value
  //     }
  //   }
  //   daysSchedule["lessonDuration"] = this.myDuration // добавление продолжительности в объект расписания
    
  //   const DataToSend = { // создание объекта с подобъектом для отправления в БД
  //     daysShedule: this.scheduleDataTrimmer(daysSchedule), 
  //   }

    
  //   this.userData.sendMyDataChanges(DataToSend)
  //   .subscribe((resp) => {
  //     console.log("выделенные дни очищены");
  //     this.userData.initialization()
  //   }),
  //   (err) => {
  //     console.log("ошибка обновления расписания: ", err);
  //   }
  // }

  
  scheduleDataTrimmer(schedule: Object) {
    let hasSchedule = false
    // console.log("до обрезки: ",schedule);
    for (let key in schedule) { //проход по всем свойствам передаваемого объекта с расписанием
      // console.log(key, schedule[key]);
      if (schedule[key] == null || schedule[key].length == 0) {
        delete schedule[key]
      }
      if (schedule[key] && key != "lessonDuration") {
        hasSchedule = true
      }
    }

    if (!hasSchedule) {
      delete schedule["lessonDuration"]
    }

    // console.log("после обрезки: ",schedule);
    return schedule
  }

  setTimeStart(event) {
    
    if (+event.target.value < this.userTimeEnd) {
      this.userTimeStart = +event.target.value;
    } else {
      this.userTimeStart = this.userTimeEnd - 1;
      (<HTMLInputElement>document.getElementById("startTime")).value = this.userTimeEnd - 1 + "";
    }
    
        
        // console.log("input от - ", event.target.value, " | var от - ", this.userTimeStart);
        
  }

  setTimeEnd(event) {
    if (event.target.value > this.userTimeStart) {
      this.userTimeEnd = event.target.value
    } else {
      this.userTimeEnd = this.userTimeStart + 1;
      (<HTMLInputElement>document.getElementById("endTime")).value = this.userTimeStart + 1 + "";
    }
  }
  
}
