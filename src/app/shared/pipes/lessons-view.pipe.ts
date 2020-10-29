import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lessonsView'
})
export class LessonsViewPipe implements PipeTransform {

  transform(lessons: object, currentYear, currentMonth, currentDay, currentHour): any[] {
    let comingLessons = []
    let result
    for (let year in lessons) {
      if (year >= currentYear) {
        for (let month in lessons[year]) {
          if (month >= currentMonth) {
            for (let day in lessons[year][month]) {
              if (day >= currentDay) {
                for (let hour in lessons[year][month][day]) {
                  const lesson = lessons[year][month][day][hour]
                  lesson.year = year
                  lesson.month = month
                  lesson.day = day
                  lesson.hour = hour
      
                  comingLessons.push(lesson)
                }
              }
            }
          }
        }
      }
    }
    return comingLessons;
  }

}
