import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PopupService } from 'src/app/shared/services/popup.service';

@Injectable()
export class ProfileGuard implements CanActivate {

   userId = localStorage.getItem("user-Id")
   
   constructor(
      private auth: AuthService,
      private popupService: PopupService,
      private router: Router
   ) { }

   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
      ) {
      if (this.auth.isAuthenticated() && this.userId !== "XUuNLsPankPqmDKLBb8ZS4X1dq12") {
         return true
      } else {
         this.auth.logout()
         this.popupService.toggleLoginPopup()
         this.router.navigate(["/"], {
            queryParams: {
               needLogin: true
            }
         })
      }

   }
}