import { Component, OnInit, Input } from '@angular/core';
import { log } from 'console';

@Component({
  selector: 'app-calendar-block',
  templateUrl: './calendar-block.component.html',
  styleUrls: ['./calendar-block.component.sass']
})
export class CalendarBlockComponent implements OnInit {

  @Input() inputSchedule: string;

  constructor() { }


  ngOnInit(): void {
    this.setMonthName()
    this.showDays()
    // this.setMargin()
    
  }
  day = new Date().getDate()
  month = new Date().getMonth() + 1 //меняется при листании календаря
  currentMonth = new Date().getMonth() + 1 //1 = январь, 12 = декабрь (не меняется)
  year = new Date().getFullYear() //меняется при листании календаря
  currentYear = new Date().getFullYear() //не меняется при листании
  daysArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  currentDays: number
  monthsNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
  monthName = ""
  daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пн", "Сб", "Вс"]
  currentFirstDay: number
  choosenDayWorkHours = [] //расписание на выбранный день
  selectedDay = -1

  increaseMonth() {
    this.month++
    if (this.month == 13) {
      this.month = 1
      this.year++
    }
    this.setMonthName()
    this.showDays()
  }
  decreaseMonth() {
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
    console.log(this.year, this.month, dayIndex);
    this.selectedDay = dayIndex - 1
  }

  onOutDay(dayOfWeekChoosen) {
    console.log("выбран ", dayOfWeekChoosen);
    // this.choosenDayWorkHours = this.inputSchedule[dayOfWeekChoosen]
    console.log(this.inputSchedule[dayOfWeekChoosen]);
    this.choosenDayWorkHours = []
    if (this.inputSchedule[dayOfWeekChoosen]) {
      for (let i = +this.inputSchedule[dayOfWeekChoosen][0]; i <= +this.inputSchedule[dayOfWeekChoosen][1]; i++) {
        this.choosenDayWorkHours[i] = i
      }
    }
  }

  onClickTimeRow(lessonTime) {
    console.log(lessonTime);
  }

}
