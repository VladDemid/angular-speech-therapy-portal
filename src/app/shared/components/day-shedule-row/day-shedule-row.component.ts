import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-day-shedule-row',
  templateUrl: './day-shedule-row.component.html',
  styleUrls: ['./day-shedule-row.component.sass']
})
export class DaySheduleRowComponent implements OnInit {

  @Input() timeToDisplay: string
  @Input() index: number

  constructor() { }

  ngOnInit(): void {
    this.displayInfo()
  }

  displayInfo() {
    if (this.index % 2 == 0) {
      console.log("%2");
    }
  }

  // timeToDisplay = "09.30-11.20"

}
