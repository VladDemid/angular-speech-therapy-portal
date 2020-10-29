import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/shared/services/firebase.service';

@Component({
  selector: 'app-security-page',
  templateUrl: './security-page.component.html',
  styleUrls: ['./security-page.component.sass']
})
export class SecurityPageComponent implements OnInit {

  email: string
  oldPassword: string
  newPassword: string

  constructor(
    private firebase: FirebaseService,
  ) { }

  ngOnInit(): void {
    // this.firebase.getCurrentUser()
  }

  changePassword() {
    this.firebase.passwordChange(this.newPassword)
    .then(() => {
      console.log("password changed!");
    })
    .catch((err) => {
      console.log("password change error: ", err);
    })
  }

}
