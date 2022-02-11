import { Component, OnInit } from '@angular/core';
import { UserData } from '../../services/user-data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';

@Component({
  selector: 'app-profile-nav',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.sass']
})
export class ProfileNavComponent implements OnInit {

  isAuthenticated = false


  constructor(
    public userData: UserData,
    private auth: AuthService,
    private firebase: FirebaseService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.auth.isAuthenticated()
  }

  test() {
    console.log(this.auth.isAuthenticated(), this.isAuthenticated )
  }

  exitProfile() {
    // this.auth.logout() 
    // this.auth.toHomePage()
    this.firebase.signOut()
  }

}
