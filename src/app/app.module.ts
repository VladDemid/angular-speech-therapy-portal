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
import { LoginPopupComponent } from './shared/components/login-popup/login-popup.component';
import { PasswordRecoveryComponent } from './shared/components/password-recovery/password-recovery.component';
import { TermsOfUsePopupComponent } from './shared/components/terms-of-use-popup/terms-of-use-popup.component';
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

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor
}

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
    TermsOfUsePopupComponent,
    SpecialistPageComponent,
    // SpecializationsListPipe,
    RequisitesPopupComponent,
    RecomendationComponent,
    JobInvitationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
    
  ],
  exports: [
    HttpClientModule
  ],
  providers: [
    UserData,
    INTERCEPTOR_PROVIDER
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
