import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { ProfileModule } from './profile/profile.module';
import { ProfileGuard } from './profile/shared/services/profile.guard';
import { SpecialistPageComponent } from './specialist-page/specialist-page.component';
import { AdminLoginPageComponent } from './admin-login-page/admin-login-page.component';
import { AdminModule } from './admin/admin.module';
import { TermsOfUsePageComponent } from './terms-of-use-page/terms-of-use-page.component';
import { PaymentCheckPageComponent } from './payment-check-page/payment-check-page.component';
import { RequisitesComponent } from './requisites/requisites.component';
import { FeedbackPageComponent } from './feedback-page/feedback-page.component';

const routes: Routes = [
  {path:"", component: HomePageComponent},
  {path:"registration", component: RegistrationPageComponent},
  {path:"terms-of-use", component: TermsOfUsePageComponent},
  {path:"requisites", component: RequisitesComponent},
  {path:"payment-check", component: PaymentCheckPageComponent},
  {path:"doctor", component: SpecialistPageComponent},
  {path:"feedback", component: FeedbackPageComponent},
  {path:"admin-login", component: AdminLoginPageComponent},
  {
    path:"profile", 
    loadChildren: () => import('./profile/profile.module').then(x => x.ProfileModule)
    // path:"profile", component: ProfileModule,
  },
  {
    path:"admin", 
    loadChildren: () => import('./admin/admin.module').then(x => x.AdminModule)
  },
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
