import { Component, OnInit } from '@angular/core';
import { PopupService } from '../shared/services/popup.service';
import { FirebaseService } from '../shared/services/firebase.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent implements OnInit {

  doctors = []
  

  constructor(
    public popupService: PopupService,
    private firebase: FirebaseService
    ) { }

  ngOnInit(): void {
    this.getAllDoctors()
  }

  getAllDoctors() {
    this.firebase.getDoctorsInfo()
    .subscribe((resp) => {
      // console.log("все пользователи: ", resp);
      this.sortDoctors(resp)
    },
    (err) => {
      console.log("ошибка при получении докторов ", err);
    }) 
  }

  sortDoctors(users) {
    // let doctors = []
    for (const property in users) {
      // console.log("проверка пользователя:" ,users[property]);
      if (users[property].userType == "doctor") {
        users[property].id = property;
        this.doctors.push(users[property])
      }
    }
    console.log("доктора: ", this.doctors);
    

  }

  
  
}
