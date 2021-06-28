import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-requisites-popup',
  templateUrl: './requisites-popup.component.html',
  styleUrls: ['./requisites-popup.component.sass']
})
export class RequisitesPopupComponent implements OnInit {

  constructor(
    public popupService: PopupService
  ) { }

  ngOnInit(): void {
  }

}
