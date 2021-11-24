import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-admin-main-page',
  templateUrl: './admin-main-page.component.html',
  styleUrls: ['./admin-main-page.component.sass']
})
export class AdminMainPageComponent implements OnInit {

  

  constructor(
    private auth: AuthService,
    
  ) { }

  ngOnInit(): void {
   
  }

  exitProfile() {
    this.auth.logout()
    this.auth.toHomePage()
  }
}
