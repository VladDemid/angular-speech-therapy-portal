import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/shared/services/firebase.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.sass']
})
export class AdminLayoutComponent implements OnInit {


  constructor(
    private firebase: FirebaseService,
  ) { }

  ngOnInit(): void {
    this.getAllData()
  }

  getAllData() {
    const checkUser = setInterval(() => {
      // console.log(this.firebase.currentUser) 
      if (this.firebase.currentUser) {
        this.getShortIds()
        clearInterval(checkUser)
      } 
    }, 100)
  }

  

  getShortIds() {
    this.firebase.getShortIds()
  }

}
