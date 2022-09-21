import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/shared/services/firebase.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.sass']
})
export class AdminMenuComponent implements OnInit {

  constructor(
    private firebase: FirebaseService
  ) { }

  ngOnInit(): void {
  }

  menuItems = [
    {
      name: "Регистрация нового специалиста",
      link: "reg-spec",
    },
    {
      name: "редактирование данных",
      link: "edit-spec",
    },
    {
      name: "удаление акков",
      link: "delete-users",
    },

  ]

  exitAdmin() {
    this.firebase.signOut()
  }

  TESTgetUser() {
    console.log(this.firebase.getUser())
  }

}
