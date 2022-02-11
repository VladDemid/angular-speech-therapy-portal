import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-nav-home',
  templateUrl: './nav-home.component.html',
  styleUrls: ['./nav-home.component.sass']
})
export class NavHomeComponent implements OnInit {

  isAuthenticated = localStorage.getItem("user-Id")

  constructor(
    public popupService: PopupService,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private firebase: FirebaseService
    ) { }

  ngOnInit(): void {
    // this.checkAuthentication()
    // this.isAuthenticated = this.firebase.isAuthenticated()
    
    // this.scrollcheck()
  }

  

  checkAuthentication() {
    // this.activatedRoute.queryParams.subscribe((params: Params) => {
    //   let fromProfile = params["returnToProfileModule"]
    //   if (fromProfile && fromProfile == true ) {
    //     this.isAuthenticated = this.auth.isAuthenticated() //! только если query fromProfile == true
    //     //*возможно вообще нет. Хз зачем тут проверка
    //   } 
    // })

  }

  scrollcheck() {
    
    let menu = document.getElementById('home-nav')

    let navCheck = setInterval( () => {
      if(pageYOffset > 100) {
        // console.log("pageYOffset = ", pageYOffset)
        // console.log(pageYOffset, menu.className)
        menu.classList.add("fixed")
      } else {menu.classList.remove("fixed")}
    }
      ,100)
      // console.log(pageYOffset)
  }
  
}
