import { Pipe, PipeTransform } from '@angular/core';
import { Event } from "../interfaces"

@Pipe({
  name: 'lessonsView'
})
export class LessonsViewPipe implements PipeTransform {

  transform(lessons, currentYear, currentMonth, currentDay, currentHour) {
    let comingLessons = Object.entries(lessons)
    // console.log(comingLessons)
    comingLessons = comingLessons
      .filter((lesson: [any, Event], index) => {
        lesson[1]["daysLeft"] = this.countDaysLeft(currentYear, currentMonth, currentDay, lesson[1]) //= считаем сколько дней осталось
        // console.log(lesson[1].date.year, currentYear)
        return lesson[1].date.year >= currentYear && lesson[1].date.month >= currentMonth 
            && lesson[1].date.day >= currentDay
      })
      console.log("!!!!!!!!",comingLessons)
    return comingLessons;
  }

  countDaysLeft(currentYear, currentMonth, currentDay, lessonData) {
    const currentDate = new Date(`${currentMonth}/${currentDay}/${currentYear}/`)
    const lessonDate = new Date(`${lessonData.date.month}/${lessonData.date.day}/${lessonData.date.year}/`)
    const differenceInTime = lessonDate.getTime() - currentDate.getTime()
    const differenseInDays = differenceInTime / (1000 * 3600 * 24)
    return differenseInDays
  }

}
