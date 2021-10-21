import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class DevelopHelp {
   
   DEBUG = !environment.production
   environmentVar = environment.production
   
   
   
   
   constructor() { }
   
   ngOnInit(): void {
      
   }
 

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

   preventLog() {
      if (environment.production) {
         window.console.log = function () { };   // disable any console.log debugging statements in production mode
       
      }
   }
}