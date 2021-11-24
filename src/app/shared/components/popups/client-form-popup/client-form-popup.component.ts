import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../../services/popup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TelegramBotService } from 'src/app/shared/services/telegram-bot.service';

@Component({
  selector: 'app-client-form-popup',
  templateUrl: './client-form-popup.component.html',
  styleUrls: ['./client-form-popup.component.sass']
})
export class ClientFormPopupComponent implements OnInit {

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
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      surname: new FormControl(null, []),
      email: new FormControl('', [
        Validators.email,
        Validators.required
      ]),
      phone: new FormControl('', [
        Validators.required
      ]),
      question: new FormControl('', []),
    })
  }

  submit() {
    // console.log(this.form)
    this.telegram.sendClientFeedback(this.form.value)
  }



}
