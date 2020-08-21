import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeRow'
})
export class TimeRowPipe implements PipeTransform {

  transform(startTime: any): string {
    if (startTime) {
      return `${startTime}:00 - ${startTime}:40`;
    } else {
      return
    }
  }

}
