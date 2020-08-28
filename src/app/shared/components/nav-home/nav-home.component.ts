import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-nav-home',
  templateUrl: './nav-home.component.html',
  styleUrls: ['./nav-home.component.sass']
})
export class NavHomeComponent implements OnInit {

  isAuthenticated = false

  constructor(public popupService: PopupService) { }

  ngOnInit(): void {
    this.checkAuthentication()
  }

  checkAuthentication() {
    this.isAuthenticated = localStorage.getItem('token-Id') ? true : false
  }
  
}
