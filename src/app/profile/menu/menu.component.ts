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
      name: "Видеочат",
      link: "videochat",
      icon: "icon-video-conference"
    },
    {
      name: "Записи консультаций",
      link: "records",
      icon: "icon-film-roll"
    },
    {
      name: "Безопасность",
      link: "security",
      icon: "icon-padlock"
    },
    {
      name: "Редактировать личные данные",
      link: "edit",
      icon: "icon-resume"
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
