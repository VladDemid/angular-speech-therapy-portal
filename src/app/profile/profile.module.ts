import { NgModule, OnInit } from "@angular/core";
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserData } from './shared/services/user-data.service';
import { ProfileNavComponent } from './shared/components/profile-nav/profile-nav.component';
import { ProfileLayoutComponent } from './shared/components/profile-layout/profile-layout.component';
import { ProfileGuard } from './shared/services/profile.guard';
import { SharedModule } from '../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DoctorsPageComponent } from './doctors-page/doctors-page.component';
import { SecurityPageComponent } from './security-page/security-page.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { EmailVerifyPopupComponent } from './shared/components/email-verify-popup/email-verify-popup.component';
import { FirebaseService } from '../shared/services/firebase.service';
import { AsideMenuComponent } from './shared/components/aside-menu/aside-menu.component';


@NgModule({
   declarations: [
      MenuComponent,
      CalendarPageComponent,
      EditProfileComponent,
      // ProfileNavComponent,
      ProfileLayoutComponent,
      DoctorsPageComponent,
      SecurityPageComponent,
      HelpPageComponent,
      EmailVerifyPopupComponent,
      AsideMenuComponent
   ],
   imports: [
      // CommonModule,
      // BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      RouterModule.forChild([
         {path: "", component: ProfileLayoutComponent, children: [
            {path: "", redirectTo: "/profile/menu", pathMatch: "full", canActivate: [ProfileGuard] },
            {path: "menu", component: MenuComponent, canActivate: [ProfileGuard] },
            {path: "calendar", component: CalendarPageComponent, canActivate: [ProfileGuard] },
            {path: "edit", component: EditProfileComponent, canActivate: [ProfileGuard] },
            {path: "doctors", component: DoctorsPageComponent, canActivate: [ProfileGuard] },
            {path: "security", component: SecurityPageComponent, canActivate: [ProfileGuard] },
            {path: "help", component: HelpPageComponent, canActivate: [ProfileGuard] },
            {path:"**", redirectTo: "menu"}
         ]
      },
         
      ])
   ],
   exports: [],
   providers:[
      // UserData,
      ProfileGuard
   ]
})

export class ProfileModule{
   
}