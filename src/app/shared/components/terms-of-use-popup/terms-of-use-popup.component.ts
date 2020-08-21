import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-terms-of-use-popup',
  templateUrl: './terms-of-use-popup.component.html',
  styleUrls: ['./terms-of-use-popup.component.sass']
})
export class TermsOfUsePopupComponent implements OnInit {

  constructor(public popupService: PopupService) { }

  ngOnInit(): void {
  }

}
