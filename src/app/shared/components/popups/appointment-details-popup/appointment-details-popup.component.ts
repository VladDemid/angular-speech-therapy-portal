import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopupService } from '../../../services/popup.service';
// import { CalendarBlockComponent } from '../calendar-block/calendar-block.component';


@Component({
  selector: 'app-appointment-details-popup',
  templateUrl: './appointment-details-popup.component.html',
  styleUrls: ['./appointment-details-popup.component.sass']
})
export class AppointmentDetailsPopupComponent implements OnInit {
  
  @Input() testVar = ''
  @Output() voted = new EventEmitter()

  problem = ""
  testLesson = { "year": 2000, "month": 0, "day": 0, "hour": 0 }
  withChild = "0"
  isUpdating = false
  successStatus = ""

  constructor(
    public popupService: PopupService,
    // private calendarBlock: CalendarBlockComponent
  ) { }

  ngOnInit(): void {
  }

  // callParent() {
  //   console.log("dfgfdg");
  //   this.voted.emit('this is a test');
  // }


  makeAnAppointment() {
    // this.isUpdating = true
    const emitLessonDetailsObject = {
      problem: this.problem,
    }

    this.popupService.toggleappointmentDeatailsPopup()
    this.voted.emit(emitLessonDetailsObject)
    // this.successStatus = "Вы записаны. На также на почту отправлено подтверждение заказа" //тут не писать коменты
    // this.isUpdating = false



    // this.callParent()
    // this.calendarBlock.patientProblem = this.problem
    // this.calendarBlock.withChild = this.withChild
    // this.calendarBlock.makeAnAppointment(this.testLesson.year, this.testLesson.month, this.testLesson.day, this.testLesson.hour)
  }
  

}
function input() {
  throw new Error('Function not implemented.');
}

