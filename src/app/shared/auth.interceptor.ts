import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
import { DevelopHelp } from './services/develop-help.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PopupService } from './services/popup.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

   constructor(
      private popupService: PopupService,
      private auth: AuthService,
      private helper: DevelopHelp,
      private router: Router
   ) {}

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.helper.toConsole("intercept...")
      
      if (this.auth.isAuthenticated()) {
         this.helper.toConsole("user authenticated", this.auth.token.substring(0,10).concat("..."))
         req = req.clone({
            setParams: {
               auth: this.auth.token,
               // userId: localStorage.getItem("user-Id")
            }
         })
      } else {
         this.helper.toConsole("user is not authenticated (interceptor)")
      }

      return next.handle(req)
      .pipe(
         catchError((error: HttpErrorResponse) => {
            this.helper.toConsole('[Interceptor Error]: ', error)

            if (error.status === 401 && !this.auth.isAuthenticated()) {
               this.helper.toConsole("Ошибка 401")
               this.auth.logout()
               this.popupService.toggleLoginPopup()
               this.router.navigate(["/"], {
                  queryParams: {
                     needLogin: true
                  }
               })
            }

            return throwError(error)
         })
      )
   }
}