import { Pipe, PipeTransform } from '@angular/core';
import { SpecialistCard, UserDbInfo } from '../interfaces';

@Pipe({
  name: 'specialistFilter'
})
export class SpecialistFilterPipe implements PipeTransform {

  transform(array: UserDbInfo[], selectedSpecialisation: string) {
    if (!selectedSpecialisation || !array) {
      return array
    }
    // console.log(selectedSpecialisation, "...пока сортировка отключена");
    return array
    
    
    let specialistsOnly = array.filter(spec => {spec.mainSpecialization && spec.zoomLink})
    return specialistsOnly.filter(spec => spec.mainSpecialization.toLowerCase() == selectedSpecialisation.toLowerCase())
  }

}
