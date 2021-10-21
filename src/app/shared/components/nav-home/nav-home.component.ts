import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-home',
  templateUrl: './nav-home.component.html',
  styleUrls: ['./nav-home.component.sass']
})
export class NavHomeComponent implements OnInit {

  isAuthenticated = false

  constructor(
    public popupService: PopupService,
    private auth: AuthService
    ) { }

  ngOnInit(): void {
    this.checkAuthentication()
    // this.scrollcheck()
  }

  checkAuthentication() {
    this.isAuthenticated = this.auth.isAuthenticated()
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
