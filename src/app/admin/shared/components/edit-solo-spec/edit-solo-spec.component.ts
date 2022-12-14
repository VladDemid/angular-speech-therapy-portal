import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/shared/services/firebase.service';

@Component({
  selector: 'app-edit-solo-spec',
  templateUrl: './edit-solo-spec.component.html',
  styleUrls: ['./edit-solo-spec.component.sass']
})
export class EditSoloSpecComponent implements OnInit {


  newKey = ''
  newValue = ''
  doctors = []
  chosenSpec = ''
  fetchStatus = ""

  
  constructor(
    private firebase: FirebaseService
  ) { }

  ngOnInit(): void {
    this.getAlldoctors()
  }

  getAlldoctors() {
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
      if (users[property].userType === "doctor") { 
        users[property].id = property;
        this.doctors.push(users[property])
      }
    }
    console.log("доктора: ", this.doctors);
  }

  chooseSpec(id) {
    // console.log(id)
    this.chosenSpec = id
  }

  fetchData() {
    this.fetchStatus = ""
    if (!this.chosenSpec) {
      return
    }
    const newData = {
      [this.newKey]: this.newValue
    }
    this.firebase.patchUserDataFromAdmin(newData, this.chosenSpec)
      .then((resp) => {
        this.fetchStatus = "поле добавлено"
      })
      .catch(err => {
        this.fetchStatus = `Ошибка: ${err}`
      })
  }

  

}
