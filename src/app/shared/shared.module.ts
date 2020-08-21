import { NgModule } from '@angular/core';
import { CalendarBlockComponent } from './components/calendar-block/calendar-block.component';
import { CalendarDayComponent } from './components/calendar-day/calendar-day.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DaySheduleRowComponent } from './components/day-shedule-row/day-shedule-row.component';
import { CalendarDayOfWeekPipe } from './pipes/calendar-day-of-week.pipe';
import { TimeRowPipe } from './pipes/time-row.pipe';


@NgModule({
   imports: [
      CommonModule
   ],
   exports: [
      CommonModule,
      CalendarBlockComponent,
      CalendarDayComponent,
      DaySheduleRowComponent
   ],
   declarations: [
      CalendarBlockComponent,
      CalendarDayComponent,
      DaySheduleRowComponent,
      DaySheduleRowComponent,
      CalendarDayOfWeekPipe,
      TimeRowPipe
   ],
   providers: [],
})
export class SharedModule { }
