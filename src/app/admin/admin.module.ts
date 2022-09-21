import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminGuard } from './shared/admin.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AdminMainPageComponent } from './admin-main-page/admin-main-page.component';
import { AdminLayoutComponent } from './shared/components/admin-layout/admin-layout.component';
import { SpecialistRegComponent } from './shared/components/specialist-reg/specialist-reg.component';
import { AdminMenuComponent } from './shared/components/admin-menu/admin-menu.component';
import { EditSpecDataComponent } from './shared/components/edit-spec-data/edit-spec-data.component';
import { EditSoloSpecComponent } from './shared/components/edit-solo-spec/edit-solo-spec.component';
import { DeleteUsersComponent } from './shared/components/delete-users/delete-users.component';



@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminMainPageComponent,
    SpecialistRegComponent,
    AdminMenuComponent,
    EditSpecDataComponent,
    EditSoloSpecComponent,
    DeleteUsersComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {path: "", component: AdminLayoutComponent, children: [
         {path: "", redirectTo: "/admin/menu", pathMatch: "full", canActivate: [AdminGuard] },
         {path: "menu", component: AdminMenuComponent, canActivate: [AdminGuard] },
         {path: "reg-spec", component: SpecialistRegComponent, canActivate: [AdminGuard] },
         {path: "edit-spec", component: EditSpecDataComponent, canActivate: [AdminGuard] },
         {path: "delete-users", component: DeleteUsersComponent, canActivate: [AdminGuard] },
         {path:"**", redirectTo: "menu"}
      ]},
    ]),
  ],
  exports: [],
  providers:[
    AdminGuard
  ]
})
export class AdminModule { }
