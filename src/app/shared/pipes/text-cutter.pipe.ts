import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textCutter'
})
export class TextCutterPipe implements PipeTransform {

  transform(text: string | undefined, symbols: number): string {
    if (typeof text === "undefined") {
      return undefined
    } else {
      let cuttedText = text.slice(0, symbols) + ".."
      return cuttedText;
    }
  }

}
