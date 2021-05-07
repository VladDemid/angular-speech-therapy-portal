import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class DevelopHelp {
   
   DEBUG = true

   
   
   
   
   constructor() { }
   
   ngOnInit(): void {
      
      if (environment.production == true) {
         this.DEBUG = false
         //   enableProdMode();
      }
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
}