import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-footer-home',
  templateUrl: './footer-home.component.html',
  styleUrls: ['./footer-home.component.sass']
})
export class FooterHomeComponent implements OnInit {

  isProfile = false

  constructor(
    public popupService: PopupService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  // checkIsProfile() {
  //   let url$ = new BehaviorSubject(window.location.href)
  //   url$.subscribe((resp) => {
  //     console.log(resp)
  //   })
  // }

  




}
