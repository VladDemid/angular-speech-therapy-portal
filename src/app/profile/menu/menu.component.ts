import { Component, OnInit } from '@angular/core';
import { UserData } from '../shared/services/user-data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/shared/services/popup.service';
import { DevelopHelp } from 'src/app/shared/services/develop-help.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
// import { AngularFireFunctions } from '@angular/fire/functions';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { FirebaseService } from 'src/app/shared/services/firebase.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  production = environment.production
  myId = localStorage.getItem('user-Id')
  testVar = 2
  testAction = false


  menuItems = [
    {
      name: "Календарь",
      link: "calendar",
    },
    {
      name: "Специалисты",
      link: "doctors",
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
    private http: HttpClient,
    private firebase: FirebaseService
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

  testLoading() {
    const timer = setTimeout(() => {
      this.testAction = false
    }, 5000)
    this.testAction = true
    
  }

  
  TESTsetToken() {
    this.firebase.setUserToken()
  }
  
  TESTgetToken() {
    console.log(this.firebase.getUserToken()) 
  }
  
  
  TESTgetData() {
    this.firebase.getUserData()
  }
  
  TESTpatchUserData() {
    const data = {
      test:1,
      test2: "123"
    }
    this.firebase.patchUserData(data)
  }

  TESTmanualRESTpatchUserData() {
    this.firebase.TESTmanualREST().subscribe(
      (resp) => {
        console.log("REST: ", resp)
      },
      (err) => {
        console.log("REST ERROR: ", err)
      })
  }

}
