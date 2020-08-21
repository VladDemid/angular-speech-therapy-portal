import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-nav-home',
  templateUrl: './nav-home.component.html',
  styleUrls: ['./nav-home.component.sass']
})
export class NavHomeComponent implements OnInit {


  constructor(public popupService: PopupService) { }

  ngOnInit(): void {
  }

  
}
