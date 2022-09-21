import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-manual-order-popup',
  templateUrl: './manual-order-popup.component.html',
  styleUrls: ['./manual-order-popup.component.sass']
})
export class ManualOrderPopupComponent implements OnInit {

  @Input() testVar = ''
  @Output() voted = new EventEmitter()

  patientName ="Владос клиент пипендосович"
  patientEmail ="vlatidos@gmail.com"
  problem = "ручное занятие"
  testLesson = { "year": 2000, "month": 0, "day": 0, "hour": 0 }
  withChild = "0"
  isUpdating = false
  successStatus = ""
  errorStatus = ""
  termsOfUseAccepted = false

  constructor(
    public popupService: PopupService,
    // private calendarBlock: CalendarBlockComponent
  ) { }

  ngOnInit(): void {
  }

  makeAnAppointment() {
    // this.isUpdating = true
    const emitLessonDetailsObject = {
      problem: this.problem,
      patientEmail: this.patientEmail,
      patientName: this.patientName,
    }

    if (this.termsOfUseAccepted) {
      this.popupService.toggleManualOrderPopup()
      this.voted.emit(emitLessonDetailsObject)
    } else {
      this.errorStatus = "Необходимо принять условия пользовательского соглашения"
    }

  }

}
