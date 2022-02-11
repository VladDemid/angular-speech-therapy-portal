import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { DevelopHelp } from 'src/app/shared/services/develop-help.service';
import { UserData } from '../shared/services/user-data.service';

@Component({
  selector: 'app-doctors-page',
  templateUrl: './doctors-page.component.html',
  styleUrls: ['./doctors-page.component.sass']
})
export class DoctorsPageComponent implements OnInit {

  doctors = []
  userType: string

  constructor(
    private firebase: FirebaseService,
    private userData: UserData,
    private helper: DevelopHelp
  ) { }

  ngOnInit(): void {
    this.getAllDoctors()
    this.userType = this.userData.myData.userType
  }

  getAllDoctors() {
    this.firebase.getDoctorsInfo()
    .subscribe((resp) => {
      if (this.helper.DEBUG) {console.log("все пользователи: ", resp)}
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
      if (users[property].userType == "doctor" && users[property].zoomLink && users[property].weeklySchedule) {
        users[property].id = property;
        this.doctors.push(users[property])
      }
    }
    console.log("доктора: ", this.doctors);
  }

}
