import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminGuard } from './shared/admin.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AdminMainPageComponent } from './admin-main-page/admin-main-page.component';
import { AdminLayoutComponent } from './shared/components/admin-layout/admin-layout.component';
import { SpecialistRegComponent } from './shared/components/specialist-reg/specialist-reg.component';



@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminMainPageComponent,
    SpecialistRegComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {path: "", component: AdminLayoutComponent, children: [
         {path: "", redirectTo: "/admin/main", pathMatch: "full", canActivate: [AdminGuard] },
         {path: "main", component: AdminMainPageComponent, canActivate: [AdminGuard] },
         {path:"**", redirectTo: "main"}
      ]},
    ]),
  ],
  exports: [],
  providers:[
    AdminGuard
  ]
})
export class AdminModule { }
