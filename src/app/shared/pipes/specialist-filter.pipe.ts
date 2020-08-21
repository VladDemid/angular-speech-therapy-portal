import { Pipe, PipeTransform } from '@angular/core';
import { SpecialistCard, UserDbInfo } from '../interfaces';

@Pipe({
  name: 'specialistFilter'
})
export class SpecialistFilterPipe implements PipeTransform {

  transform(array: UserDbInfo[], activeSpecialists: string) {
    if (!activeSpecialists || !array) {
      return array
    }
    console.log(activeSpecialists, "...пока сортировка отключена");
    return array
    // return array.filter(spec => spec.specialization == activeSpecialists)
  }

}
