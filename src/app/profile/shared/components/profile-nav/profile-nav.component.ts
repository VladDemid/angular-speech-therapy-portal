import { Component, OnInit } from '@angular/core';
import { UserData } from '../../services/user-data.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-profile-nav',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.sass']
})
export class ProfileNavComponent implements OnInit {

  constructor(
    public userData: UserData,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  exitProfile() {
    this.auth.logout()
    this.auth.toHomePage()
  }

}
