import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'specializationsList'
})
export class SpecializationsListPipe implements PipeTransform {

  transform(value: string, specs: string[]): string[] {
    const mainSpecIndex = specs.indexOf(value)
    delete specs[mainSpecIndex];
    specs.splice(mainSpecIndex, 1)
    specs.unshift(value)
    // for (let i = 0; i < (specs.length - 1); ++i) {
    //   specs[i] += ","
    // }
    // console.log("11111111111", specs);
    return specs
  }

}
