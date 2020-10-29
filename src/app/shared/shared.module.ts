import { NgModule } from '@angular/core';
import { CalendarBlockComponent } from './components/calendar-block/calendar-block.component';
import { CalendarDayComponent } from './components/calendar-day/calendar-day.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DaySheduleRowComponent } from './components/day-shedule-row/day-shedule-row.component';
import { CalendarDayOfWeekPipe } from './pipes/calendar-day-of-week.pipe';
import { TimeRowPipe } from './pipes/time-row.pipe';
import { OurSpecialistsComponent } from './components/our-specialists/our-specialists.component';
import { SpecialistCardComponent } from './components/specialist-card/specialist-card.component';
import { SpecialistFilterPipe } from './pipes/specialist-filter.pipe';
import { RouterModule } from '@angular/router';
import { NavHomeComponent } from './components/nav-home/nav-home.component';
import { ProfileNavComponent } from '../profile/shared/components/profile-nav/profile-nav.component';
import { LessonsViewPipe } from './pipes/lessons-view.pipe';
import { NameRowPipe } from './pipes/name-row.pipe';
import { ImgPopupComponent } from './components/img-popup/img-popup.component';


@NgModule({
   imports: [
      CommonModule,
      RouterModule 
   ],
   exports: [
      CommonModule,
      CalendarBlockComponent,
      CalendarDayComponent,
      DaySheduleRowComponent,
      OurSpecialistsComponent,
      SpecialistCardComponent,
      ProfileNavComponent,
      ImgPopupComponent
      // RouterModule
   ],
   declarations: [
      CalendarBlockComponent,
      CalendarDayComponent,
      DaySheduleRowComponent,
      OurSpecialistsComponent,
      SpecialistCardComponent,
      ProfileNavComponent,
      // DaySheduleRowComponent,
      CalendarDayOfWeekPipe,
      TimeRowPipe,
      SpecialistFilterPipe,
      LessonsViewPipe,
      NameRowPipe,
      ImgPopupComponent,
   ],
   providers: [],
})
export class SharedModule { }
