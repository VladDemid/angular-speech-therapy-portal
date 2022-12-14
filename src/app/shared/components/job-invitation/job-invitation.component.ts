import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-job-invitation',
  templateUrl: './job-invitation.component.html',
  styleUrls: ['./job-invitation.component.sass']
})
export class JobInvitationComponent implements OnInit {

  constructor(
    public popupService: PopupService
  ) { }

  ngOnInit(): void {
  }

}
