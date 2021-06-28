import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopupService } from '../../services/popup.service';
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
    const emitLessonDetailsObject = {
      problem: this.problem,
      withChild: this.withChild,

    }
    this.popupService.toggleappointmentDeatailsPopup()
    this.voted.emit(emitLessonDetailsObject)
    
    // this.callParent()
    // this.calendarBlock.patientProblem = this.problem
    // this.calendarBlock.withChild = this.withChild
    // this.calendarBlock.makeAnAppointment(this.testLesson.year, this.testLesson.month, this.testLesson.day, this.testLesson.hour)
  }
  

}
function input() {
  throw new Error('Function not implemented.');
}

