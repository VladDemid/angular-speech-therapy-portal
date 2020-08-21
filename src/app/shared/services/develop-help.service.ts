import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class DevelopHelp {
   constructor() { }
   
   DEBUG = true

   toConsole(value, value2?, value3?) {
      if (this.DEBUG) {
         for (var i = 0; i < arguments.length; i++) {
            console.log(arguments[i])
         }
      } 
   }
   
   test() {
      console.log("test test");
   }
}