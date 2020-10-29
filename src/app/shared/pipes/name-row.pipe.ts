import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameRow'
})
export class NameRowPipe implements PipeTransform {

  transform(fullName: string): string {
    let shortName = "",
        fullNameParts = fullName.split(" ");
    shortName = `${fullNameParts[0]} ${fullNameParts[1][0]}.${fullNameParts[2][0]}.`
    if (shortName.length > 16) {
      shortName = shortName.slice(0,16)
    }
    return shortName;
  }

}
