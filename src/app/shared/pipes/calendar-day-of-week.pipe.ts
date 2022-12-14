import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calendarDayOfWeek'
})
export class CalendarDayOfWeekPipe implements PipeTransform {

  transform(number: number) {
    if (number != 0) {
      return number
    } else {
      return 7
    }
    
    // return array.filter(spec => spec.specialization == activeSpecialists)
  }

}
