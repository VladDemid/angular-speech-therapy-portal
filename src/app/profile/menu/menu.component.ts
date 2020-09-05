import { Component, OnInit } from '@angular/core';
import { UserData } from '../shared/services/user-data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {



  menuItems = [
    {
      name: "Календарь приемов",
      link: "calendar",
      icon: "icon-calendar"
    },
    {
      name: "Выбрать доктора",
      link: "doctors",
      icon: "icon-doctor"
    },
    // {
    //   name: "Записи консультаций",
    //   link: "multimedia",
    //   icon: "icon-multimedia"
    // },
    // {
    //   name: "Безопасность",
    //   link: "security",
    //   icon: "icon-security"
    // },
    {
      name: "Редактировать личные данные",
      link: "edit",
      icon: "icon-edit"
    }
  ]
  

  constructor(
    public userData: UserData,
    private auth: AuthService,
    private router: Router
  ) {}

    
  ngOnInit(): void {

  }

  exitProfile() {
    this.auth.logout()
    this.router.navigate(["/"])
  }
  

}
