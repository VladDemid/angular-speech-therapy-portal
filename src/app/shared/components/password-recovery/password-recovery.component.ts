import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.sass']
})
export class PasswordRecoveryComponent implements OnInit {

  constructor(public popupService: PopupService) { }

  ngOnInit(): void {
  }

}
