import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { FirebaseService } from '../../services/firebase.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.sass']
})
export class PasswordRecoveryComponent implements OnInit {

  // email = ""
  errMessage = ""
  message = ""
  requiredErr = false

  passwordRecoveryForm = new FormGroup({
    email: new FormControl(null)
  })

  get email() {return this.passwordRecoveryForm.get('email')}
  
  constructor(
    public popupService: PopupService,
    private firebase: FirebaseService
    ) { }

  ngOnInit(): void {
  }
  
  

  passwordRecovery() {
    this.firebase.sendPasswordResetEmail(this.email.value)
    .then(() => {
      console.log("email sent");
      this.message = "На вашу почту было отправлено письмо"
    })
    .catch((err) => {
      console.log("email sent ERROR", err);
      this.errMessage = `Ошибка отправки письма на почту: ${err}`
    })

  }

}
