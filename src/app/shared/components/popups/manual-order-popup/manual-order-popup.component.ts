import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  requiredErr = false


  manualOrderForm = new FormGroup({
    childName: new FormControl('', [Validators.required,]),
    childDate: new FormControl('', [Validators.required,]),
    parentName: new FormControl('', [Validators.required,]),
    parentEmail: new FormControl('', [Validators.required,Validators.email]),
    phone: new FormControl('', [Validators.required,Validators.minLength(6)]),
    comment: new FormControl('', [Validators.required,]),
    termsOfUse: new FormControl('', [Validators.required,]),
  });

  get childName() {return this.manualOrderForm.get('childName')}
  get childDate() {return this.manualOrderForm.get('childDate')}
  get parentName() {return this.manualOrderForm.get('parentName')}
  get parentEmail() {return this.manualOrderForm.get('parentEmail')}
  get phone() {return this.manualOrderForm.get('phone')}
  get comment() {return this.manualOrderForm.get('comment')}

  constructor(
    public popupService: PopupService,
    // private calendarBlock: CalendarBlockComponent
  ) { }

  ngOnInit(): void {
  }

  makeManualAppointment() {
    // this.isUpdating = true
    const emitLessonDetailsObject = {
      childName: this.childName,
      childDate: this.childDate,
      parentName: this.parentName,
      parentEmail: this.parentEmail,
      phone: this.phone,
      comment: this.comment,
      isManualCreation: true,
    }

    if (this.termsOfUseAccepted) {
      this.popupService.toggleManualOrderPopup()
      this.voted.emit(emitLessonDetailsObject)
    } else {
      this.errorStatus = "Необходимо принять условия пользовательского соглашения"
    }

  }

}
