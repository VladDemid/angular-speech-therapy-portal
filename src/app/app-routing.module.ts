import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { ProfileModule } from './profile/profile.module';
import { ProfileGuard } from './profile/shared/services/profile.guard';
import { SpecialistPageComponent } from './specialist-page/specialist-page.component';
import { AdminLoginPageComponent } from './admin-login-page/admin-login-page.component';
import { AdminModule } from './admin/admin.module';

const routes: Routes = [
  {path:"", component: HomePageComponent},
  {path:"registration", component: RegistrationPageComponent},
  {path:"doctor", component: SpecialistPageComponent},
  {path:"admin-login", component: AdminLoginPageComponent},
  {path:"profile", loadChildren: "./profile/profile.module#ProfileModule"},
  // {path:"admin", loadChildren: "./profile/profile.module#ProfileModule"},
  {path:"admin", loadChildren: "./admin/admin.module#AdminModule"},
  {path:"**", redirectTo: "/"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 25],
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
