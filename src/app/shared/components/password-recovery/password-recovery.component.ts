import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.sass']
})
export class PasswordRecoveryComponent implements OnInit {

  email = ""
  
  constructor(
    public popupService: PopupService,
    private firebase: FirebaseService
    ) { }

  ngOnInit(): void {
  }
  
  

  passwordRecovery() {
    this.firebase.passwordReset(this.email)
    .then(() => {
      console.log("email sent");
    })
    .catch((err) => {
      console.log("email sent ERROR", err);
    })

  }

}
