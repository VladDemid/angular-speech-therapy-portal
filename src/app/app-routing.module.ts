import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { ProfileModule } from './profile/profile.module';
import { ProfileGuard } from './profile/shared/services/profile.guard';
import { SpecialistPageComponent } from './specialist-page/specialist-page.component';


const routes: Routes = [
  {path:"", component: HomePageComponent},
  {path:"registration", component: RegistrationPageComponent},
  {path:"doctor", component: SpecialistPageComponent},
  {path:"profile", loadChildren: "./profile/profile.module#ProfileModule"},
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
