import { Injectable } from "@angular/core";

@Injectable({
   providedIn: 'root'
 })

export class FormsInputs {

  clientPopupForm = {
      childName: {
         title: 'Имя фамилия ребенка',
         errors: {
            
         }
      },
      childDate: {},
      parentName: {},
      email: {},
      phone: {},
      comment: {},
   }

   test = {
      0: {
         fieldName: "childName",
         title: 'Имя фамилия ребенка',
         errors: {}
      },
      1: {
         fieldName: "childDate",
         title: 'дата рождения ребенка',
         errors: {}
      }
   }
}
