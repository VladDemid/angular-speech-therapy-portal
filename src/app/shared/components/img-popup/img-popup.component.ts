import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-img-popup',
  templateUrl: './img-popup.component.html',
  styleUrls: ['./img-popup.component.sass']
})
export class ImgPopupComponent implements OnInit {

  constructor(
    public popupService: PopupService
  ) { }

  ngOnInit(): void {
  }

}
