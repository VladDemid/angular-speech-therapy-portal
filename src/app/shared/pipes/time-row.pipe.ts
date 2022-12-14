import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeRow'
})
export class TimeRowPipe implements PipeTransform {

  transform(startTime: any): string {
    const startTimeStr = startTime.split(":")
    let endHour = parseInt(startTimeStr[0], 10)
    let endMinute: any = parseInt(startTimeStr[1], 10)  + 40

    if (endMinute >= 60) {
      endMinute -= 60
      endHour += 1
      
      if (endMinute === 0) {
        endMinute = "00"
      } 
    }


    
    

    
    // console.log(`${hour}:${minute}`)
    return `${startTime} - ${endHour}:${endMinute}`;
  }

}
