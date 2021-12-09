import { Component, OnInit } from '@angular/core';
import { UserData } from '../shared/services/user-data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/shared/services/popup.service';
import { DevelopHelp } from 'src/app/shared/services/develop-help.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
// import { AngularFireFunctions } from '@angular/fire/functions';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { FirebaseService } from 'src/app/shared/services/firebase.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  myId = localStorage.getItem('user-Id')
  testVar = 2
  production = environment.production

  menuItems = [
    {
      name: "Календарь",
      link: "calendar",
    },
    // {
    //   name: "Видеочат",
    //   link: "videochat",
    // },
    // {
    //   name: "Записи консультаций",
    //   link: "records",
    // },
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
        name: "Специалисты",
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
    public popupService: PopupService,
    public helper: DevelopHelp,
    private http: HttpClient
    // public afAuth: AngularFireAuth,
    // private firebase: FirebaseService
  ) {}

    
  ngOnInit(): void {

  }

  exitProfile() {
    this.auth.logout()
    this.router.navigate(["/"])
  }
  
  emailSend() {

  }



}
