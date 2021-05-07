import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textCutter'
})
export class TextCutterPipe implements PipeTransform {

  transform(text: string, symbols: number): string {
    let cuttedText = text.slice(0, symbols) + ".."
    return cuttedText;
  }

}
