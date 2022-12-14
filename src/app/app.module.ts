import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Provider } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { SpecialistPageComponent } from './specialist-page/specialist-page.component';
import { NavHomeComponent } from './shared/components/nav-home/nav-home.component';
import { FooterHomeComponent } from './shared/components/footer-home/footer-home.component';
import { FaqComponent } from './shared/components/faq/faq.component';
import { FaqItemComponent } from './shared/components/faq-item/faq-item.component';
import { PasswordRecoveryComponent } from './shared/components/password-recovery/password-recovery.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth.interceptor';
import { ProfileGuard } from './profile/shared/services/profile.guard';
import { SharedModule } from './shared/shared.module';
import { UserData } from './profile/shared/services/user-data.service';
import { SpecializationsListPipe } from './shared/pipes/specializations-list.pipe';
import { FbSecurityPopupComponent } from './shared/components/fb-security-popup/fb-security-popup.component';
import { FaqNewComponent } from './shared/components/faq-new/faq-new.component';
import { RequisitesPopupComponent } from './shared/components/requisites-popup/requisites-popup.component';
import { RecomendationComponent } from './shared/components/recomendation/recomendation.component';
import { JobInvitationComponent } from './shared/components/job-invitation/job-invitation.component';
import { SwiperModule } from 'swiper/angular';
import { ClientFormPopupComponent } from './shared/components/popups/client-form-popup/client-form-popup.component';
import { DoctorFormPopupComponent } from './shared/components/popups/doctor-form-popup/doctor-form-popup.component';
import { CookiePopupComponent } from './shared/components/popups/cookie-popup/cookie-popup.component';
import { AdminLoginPageComponent } from './admin-login-page/admin-login-page.component';
import { TermsOfUsePageComponent } from './terms-of-use-page/terms-of-use-page.component';
import { LoginPopupComponent } from './shared/components/popups/login-popup/login-popup.component';
import { PaymentCheckPageComponent } from './payment-check-page/payment-check-page.component';
import { RequisitesComponent } from './requisites/requisites.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeedbackPageComponent } from './feedback-page/feedback-page.component'
// import { tns } from "tiny-slider/src/tiny-slider"
// const INTERCEPTOR_PROVIDER: Provider = {
//   provide: HTTP_INTERCEPTORS,
//   multi: true,
//   useClass: AuthInterceptor
// }


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RegistrationPageComponent,
    NavHomeComponent,
    FooterHomeComponent,
    // OurSpecialistsComponent,
    // SpecialistCardComponent,
    FaqComponent,
    FaqItemComponent,
    FaqNewComponent,
    LoginPopupComponent,
    PasswordRecoveryComponent,
    FbSecurityPopupComponent,
    RequisitesPopupComponent,
    ClientFormPopupComponent,
    DoctorFormPopupComponent,
    CookiePopupComponent,
    SpecialistPageComponent,
    // SpecializationsListPipe,
    RecomendationComponent,
    JobInvitationComponent,
    AdminLoginPageComponent,
    TermsOfUsePageComponent,
    PaymentCheckPageComponent,
    RequisitesComponent,
    FeedbackPageComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    SwiperModule,
    BrowserAnimationsModule,
  ],
exports: [
    HttpClientModule,
    // NgxTinySliderModule
  ],
  providers: [
    UserData,
    // INTERCEPTOR_PROVIDER,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
