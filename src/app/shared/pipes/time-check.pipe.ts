import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeCheck'
})
export class TimeCheckPipe implements PipeTransform {

  transform(time, scheduleTime, year, month, selectedDay, ...args: unknown[]): unknown {
    //  12.2|13 ==> 12_20|13_00
    // console.log( time)
    if (!scheduleTime?.[year]?.[month]?.[selectedDay]) {
      return false
    }
    
    let timeStr = time + ""
    timeStr = timeStr.replace(/[\.\/]/g,'_')
    if ( timeStr.indexOf("_") === -1 ) {
      timeStr += "_00"
    } else {
      timeStr += "0"
    }

    
    // console.log(scheduleTime && !!scheduleTime[timeStr])
    return scheduleTime?.[year]?.[month]?.[selectedDay]?.[timeStr];
  }

}
