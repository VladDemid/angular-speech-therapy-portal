import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupService } from '../../../services/popup.service';
// import { CalendarBlockComponent } from '../calendar-block/calendar-block.component';


@Component({
  selector: 'app-appointment-details-popup',
  templateUrl: './appointment-details-popup.component.html',
  styleUrls: ['./appointment-details-popup.component.sass']
})
export class AppointmentDetailsPopupComponent implements OnInit {
  
  @Input() selectedDay: number;
  @Input() selectedTimeForLesson: any;
  @Input() month: number;
  @Input() year: number;
  @Input() monthsNamesWhomCase: number;
  @Input() inputDoctorInfo: any;
  @Input() testVar = ''
  @Output() voted = new EventEmitter()

  appointmentDetailsForm = new FormGroup({
    childName: new FormControl('Имя ребенка', [Validators.required,]),
    childDate: new FormControl('2020-10-10', [Validators.required,]),
    comment: new FormControl('', [Validators.required,]),
  });

  get childName() {return this.appointmentDetailsForm.get('childName')}
  get childDate() {return this.appointmentDetailsForm.get('childDate')}
  get comment() {return this.appointmentDetailsForm.get('comment')}
  
  
  problem = ""
  testLesson = { "year": 2000, "month": 0, "day": 0, "hour": 0 }
  withChild = "0"
  isUpdating = false
  successStatus = ""
  requiredErr = false

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


  onSubmit() {
    // this.isUpdating = true
    const emitLessonDetailsObject = {
      childName: this.childName.value,
      childDate: this.childDate.value,
      comment: this.comment.value,
      isManualCreation: false,
    }
    // console.log(this.appointmentDetailsForm.controls)
    this.popupService.popupOrderDetails = emitLessonDetailsObject

    this.popupService.toggleAppointmentDeatailsPopup()
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

