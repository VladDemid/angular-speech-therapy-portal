import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { TelegramBotService } from 'src/app/shared/services/telegram-bot.service';

@Component({
  selector: 'app-doctor-form-popup',
  templateUrl: './doctor-form-popup.component.html',
  styleUrls: ['./doctor-form-popup.component.sass']
})
export class DoctorFormPopupComponent implements OnInit {

  isSubmitting = false 
  form: FormGroup
  passwordMinLength = 6
  ErrMessage = ""

  constructor(
    public popupService: PopupService,
    private authServise: AuthService,
    private firebase: FirebaseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private telegram: TelegramBotService,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      specialisation: new FormControl(null, []),
      email: new FormControl('', [
        Validators.email,
        Validators.required
      ]),
      phone: new FormControl('', [
        Validators.required
      ]),
      description: new FormControl('', []),
    })
  }

  submit() {
    // console.log(this.form)
    this.telegram.sendSpecialistFeedback(this.form.value)
  }

}
