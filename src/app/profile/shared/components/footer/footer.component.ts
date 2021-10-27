import { Component, OnInit } from '@angular/core';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {

  constructor(
    public popupService: PopupService
  ) { }

  ngOnInit(): void {
  }

}
