import { Component, OnInit } from '@angular/core';
import { UserData } from '../shared/services/user-data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {



  menuItems = [
    {
      name: "Календарь",
      link: "calendar",
    },
    {
      name: "Видеочат",
      link: "videochat",
    },
    {
      name: "Записи консультаций",
      link: "records",
    },
    // {
      //   name: "Записи консультаций",
      //   link: "multimedia",
      // },
      {
        name: "Редактировать личные данные",
        link: "edit",
      },
      {
        name: "Безопасность",
        link: "security",
      },
      {
        name: "Доктора",
        link: "doctors",
      },
      {
        name: "Помощь",
        link: "help",
      },

  ]
  

  constructor(
    public userData: UserData,
    private auth: AuthService,
    private router: Router,
    public popupService: PopupService
  ) {}

    
  ngOnInit(): void {

  }

  exitProfile() {
    this.auth.logout()
    this.router.navigate(["/"])
  }
  

}
