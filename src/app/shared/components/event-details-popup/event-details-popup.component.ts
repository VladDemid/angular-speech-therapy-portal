import { Component, OnInit } from '@angular/core';
import { UserData } from 'src/app/profile/shared/services/user-data.service';
import { zoomConfig } from 'src/environments/environment';
import { PopupService } from '../../services/popup.service';
import { ZoomService } from '../../services/zoom.service';

@Component({
  selector: 'app-event-details-popup',
  templateUrl: './event-details-popup.component.html',
  styleUrls: ['./event-details-popup.component.sass']
})
export class EventDetailsPopupComponent implements OnInit {

  monthsNamesWhomCase = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"]
  
  constructor(
    public popupService: PopupService,
    private zoom: ZoomService,
    private userData: UserData
  ) { }

  ngOnInit(): void {
  }

  goToZoom(id, password, doctorName, clientName) {
    // this.popupService.toggleEventDetailsPopup()
    // if (this.userData.myData.userType == "client") {
    //   this.zoom.userName = clientName
    // } else {this.zoom.userName = doctorName}
    // this.zoom.startZoom() // Id и пароль берется пока из ZoomConfig environment
  }

  copyId(id) {
    navigator.clipboard.writeText(id)
      // .then(() => console.log("id скопирован"))
      // .catch(() => console.log("ошибка копирования id"))
  }

  copyPass(pass) {
    navigator.clipboard.writeText(pass)
      // .then(() => console.log("pass скопирован"))
      // .catch(() => console.log("ошибка копирования pass"))
  }



}
